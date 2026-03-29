import { FILLER_WORDS, IDEAL_WPM_MIN, IDEAL_WPM_MAX } from './constants';

/**
 * Computes words per minute (WPM).
 * @param {string} transcript 
 * @param {number} durationSeconds 
 * @returns {number}
 */
export function computeWPM(transcript, durationSeconds) {
  if (!transcript || durationSeconds <= 0) return 0;
  const wordCount = transcript.trim().split(/\s+/).length;
  return Math.round((wordCount / durationSeconds) * 60);
}

/**
 * Counts filler words/phrases.
 * @param {string} transcript 
 * @returns {number}
 */
export function countFillers(transcript) {
  if (!transcript) return 0;
  let count = 0;
  const text = transcript.toLowerCase();
  
  FILLER_WORDS.forEach(filler => {
    // Escape for regex and check for word boundaries
    const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  
  return count;
}

/**
 * Computes a confidence score based on WPM and pause density.
 * @param {number} wpm 
 * @param {number} pauseCount (number of pauses detected)
 * @returns {number} 0-100
 */
export function computeConfidenceScore(wpm, pauseCount) {
  let score = 100;

  // WPM deduction: +/- 1 point for every 2 WPM away from ideal range
  if (wpm < IDEAL_WPM_MIN) score -= (IDEAL_WPM_MIN - wpm) / 2;
  if (wpm > IDEAL_WPM_MAX + 10) score -= (wpm - (IDEAL_WPM_MAX + 10)) / 2;

  // Pause deduction: 5 points per pause
  score -= (pauseCount * 5);

  return Math.max(0, Math.min(100, Math.round(score)));
}
