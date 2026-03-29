const genAI = require('../config/gemini');
const { buildExtractProfilePrompt }   = require('../prompts/extractProfile.prompt');
const { buildGenerateQuestionPrompt } = require('../prompts/generateQuestion.prompt');
const { buildEvaluateAnswerPrompt }   = require('../prompts/evaluateAnswer.prompt');

const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Retries an async function with exponential backoff on failure.
 */
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    // Check if error is retryable (like a 429 rate limit or 5xx server error)
    const isRetryable = error.status === 429 || (error.status >= 500 && error.status < 600) || !error.status;
    
    if (!isRetryable) throw error;

    console.warn(`[Gemini Retry] ${retries} attempts left. Retrying in ${delay / 1000}s...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

/**
 * Strips markdown code fences (```json ... ```) that Gemini sometimes wraps around JSON.
 */
function stripFences(raw) {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
}

async function extractProfileFromCV(rawText) {
  const model  = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = buildExtractProfilePrompt(rawText);

  const raw = await retryWithBackoff(() => model.generateContent(prompt).then(r => r.response.text()));

  try {
    return JSON.parse(stripFences(raw));
  } catch (err) {
    throw new Error(`Invalid JSON from Gemini: ${err.message}`);
  }
}

async function generateQuestion(profileJSON, stage, conversationHistory) {
  const model  = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = buildGenerateQuestionPrompt(profileJSON, stage, conversationHistory);

  const resultText = await retryWithBackoff(() => model.generateContent(prompt).then(r => r.response.text()));
  return resultText.trim();
}

async function evaluateAnswer(questionText, transcriptText, profileJSON) {
  const model  = genAI.getGenerativeModel({ model: MODEL_NAME });
  const prompt = buildEvaluateAnswerPrompt(questionText, transcriptText, profileJSON);

  const raw = await retryWithBackoff(() => model.generateContent(prompt).then(r => r.response.text()));

  try {
    return JSON.parse(stripFences(raw));
  } catch (err) {
    throw new Error(`Invalid JSON from Gemini: ${err.message}`);
  }
}

module.exports = { extractProfileFromCV, generateQuestion, evaluateAnswer };
