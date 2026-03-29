/**
 * Constants used throughout the AI Interview Coach frontend.
 */

export const STAGES = [
  { id: 'intro',           label: 'Introduction',   questionCount: 3 },
  { id: 'cv_deep_dive',    label: 'CV Deep-Dive',    questionCount: 4 },
  { id: 'technical',       label: 'Technical',       questionCount: 5 },
  { id: 'problem_solving', label: 'Problem Solving', questionCount: 3 },
];

export const MAX_QUESTIONS = STAGES.reduce((acc, stage) => acc + stage.questionCount, 0);

export const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'right', 'so', 'literally'
];

export const IDEAL_WPM_MIN = 120;
export const IDEAL_WPM_MAX = 160;

export const STAGE_LABELS = {
  intro: 'Intro',
  cv_deep_dive: 'CV Dive',
  technical: 'Technical',
  problem_solving: 'Logic'
};
