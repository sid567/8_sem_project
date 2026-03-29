import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { STAGES } from '../utils/constants';

/**
 * Distributes `total` questions across stages using the Largest Remainder
 * Method so the counts ALWAYS sum to EXACTLY `total` — no rounding drift.
 * Each stage gets at least 1 question.
 */
function buildDistribution(total) {
  const base = STAGES.reduce((acc, s) => acc + s.questionCount, 0);

  // Step 1: compute exact proportions and take the floor
  const exact   = STAGES.map(s => (s.questionCount / base) * total);
  const floored = exact.map(Math.floor);
  let remainder = total - floored.reduce((a, b) => a + b, 0);

  // Step 2: distribute leftover to stages with the highest fractional parts
  const order = exact
    .map((v, i) => [v - Math.floor(v), i])
    .sort((a, b) => b[0] - a[0]);

  for (let i = 0; i < remainder; i++) {
    floored[order[i][1]]++;
  }

  // Step 3: ensure every stage has at least 1 question
  return STAGES.map((stage, i) => ({ ...stage, questionCount: Math.max(1, floored[i]) }));
}

export default function useInterview() {
  const [searchParams] = useSearchParams();
  const totalQuestions = Math.min(
    Math.max(parseInt(searchParams.get('questions') || '10', 10), 5),
    15,
  );

  // Build a proportional stage distribution based on the chosen total
  const stages = useMemo(() => buildDistribution(totalQuestions), [totalQuestions]);
  const maxQuestions = stages.reduce((acc, s) => acc + s.questionCount, 0);

  const [currentStage, setCurrentStage]         = useState('intro');
  const [questionIndex, setQuestionIndex]        = useState(0);
  const [currentQuestion, setCurrentQuestion]   = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading]               = useState(false);
  const [isComplete, setIsComplete]             = useState(false);

  /** Returns the stage id for a given zero-based question index */
  const getStageForIndex = (index) => {
    let count = 0;
    for (const stage of stages) {
      count += stage.questionCount;
      if (index < count) return stage.id;
    }
    return null;
  };

  const fetchNextQuestion = useCallback(async (sessionId) => {
    setIsLoading(true);
    try {
      const stage = getStageForIndex(questionIndex);
      if (!stage) {
        setIsComplete(true);
        return;
      }

      setCurrentStage(stage);

      const response = await api.post(`/api/session/${sessionId}/question`, {
        stage,
        conversationHistory,
      });

      setCurrentQuestion(response.data.questionText);
      setCurrentQuestionId(response.data.questionId);

      setConversationHistory((prev) => [
        ...prev,
        { role: 'interviewer', text: response.data.questionText },
      ]);
    } catch (err) {
      console.error('Failed to fetch next question', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [questionIndex, conversationHistory, stages]);

  const submitAnswer = useCallback(async (sessionId, transcript, voiceMetrics) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/api/session/${sessionId}/answer`, {
        questionId: currentQuestionId,
        transcriptText: transcript,
        voiceMetrics,
      });

      setConversationHistory((prev) => [
        ...prev,
        { role: 'candidate', text: transcript },
      ]);

      setQuestionIndex((prev) => prev + 1);
      return response.data;
    } catch (err) {
      console.error('Failed to submit answer', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestionId]);

  const completeInterview = useCallback(async (sessionId) => {
    try {
      await api.post(`/api/session/${sessionId}/complete`);
    } catch (err) {
      console.error('Failed to complete interview', err);
    }
  }, []);

  return {
    currentStage,
    questionIndex,
    maxQuestions,
    totalQuestions,
    currentQuestion,
    currentQuestionId,
    conversationHistory,
    isLoading,
    isComplete,
    fetchNextQuestion,
    submitAnswer,
    completeInterview,
  };
}
