import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useInterview from '../hooks/useInterview';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { computeWPM, countFillers } from '../utils/voiceMetrics';
import { STAGES } from '../utils/constants';

/** Formats elapsed seconds → MM:SS */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/** Counts approx words in a string */
function wordCount(text) {
  if (!text?.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

const ANSWER_WORD_LIMIT = 150; // soft cap shown in UI

export default function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    currentStage,
    questionIndex,
    maxQuestions,
    currentQuestion,
    isLoading,
    isComplete,
    fetchNextQuestion,
    submitAnswer,
    completeInterview
  } = useInterview();

  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const { startListening, stopListening, transcript, isListening, isSupported } = useSpeechRecognition();

  const [lastScore, setLastScore]   = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [countdown, setCountdown]   = useState(null); // null | 3 | 2 | 1 | 0('GO!')

  // ── Interview timer ────────────────────────────────────────
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // ── Load first question ────────────────────────────────────
  const handleInitialFetch = useCallback(() => {
    setFetchError(null);
    fetchNextQuestion(sessionId).catch(err => setFetchError(err.message));
  }, [sessionId, fetchNextQuestion]);

  useEffect(() => {
    if (sessionId) handleInitialFetch();
  }, [sessionId]);

  // ── Speak question when it changes ────────────────────────
  useEffect(() => {
    if (currentQuestion) {
      speak(currentQuestion);
      setLastScore(null);
      setShowSubmit(false);
    }
  }, [currentQuestion, speak]);

  /** Fires a 3-2-1-GO countdown then starts the mic. */
  const startWithCountdown = useCallback(() => {
    cancel();
    setShowSubmit(false);
    setCountdown(3);
    let count = 3;
    const tick = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(tick);
        setCountdown('GO!');
        setTimeout(() => {
          setCountdown(null);
          startListening();
        }, 600);
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [cancel, startListening]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setShowSubmit(true);
    } else {
      startWithCountdown();
    }
  };

  const handleSubmit = async () => {
    const { transcript: finalTranscript, durationSeconds } = stopListening();

    const wpm = computeWPM(finalTranscript, durationSeconds);
    const fillerCount = countFillers(finalTranscript);
    const metrics = { wpm, fillerCount, pauseCount: 0, answerDuration: durationSeconds };

    try {
      const result = await submitAnswer(sessionId, finalTranscript, metrics);
      setLastScore(result.weightedScore);
      setShowSubmit(false);

      setTimeout(() => {
        setFetchError(null);
        fetchNextQuestion(sessionId).catch(err => setFetchError(err.message));
      }, 2000);
    } catch (err) {
      setFetchError('Failed to submit answer. Please try again.');
    }
  };

  const handleFinish = async () => {
    clearInterval(timerRef.current);
    await completeInterview(sessionId);
    navigate(`/report/${sessionId}`);
  };

  // ── Word count of live transcript ─────────────────────────
  const words = wordCount(transcript);
  const isOverLimit = words > ANSWER_WORD_LIMIT;

  // ── Error state ───────────────────────────────────────────
  if (!isSupported) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Browser Not Supported</h2>
        <p className="text-slate-600 mb-8 max-w-md">Voice recognition requires Google Chrome or Microsoft Edge. Please open this app in a supported browser.</p>
        <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">Back to Home</button>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Something went wrong</h2>
        <p className="text-slate-600 mb-6">{fetchError}</p>
        <button onClick={handleInitialFetch} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Retry</button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Interview Complete!</h2>
        <p className="text-slate-500 mb-2">Total time: <span className="font-bold text-slate-700">{formatTime(elapsed)}</span></p>
        <p className="text-slate-600 mb-8 max-w-md">Your report is ready.</p>
        <button onClick={handleFinish} className="bg-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg">View Full Report</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Header: stages + timer ────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Stages */}
          <div className="flex items-center gap-2 overflow-x-auto flex-1">
            {STAGES.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  currentStage === s.id ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400'
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>

          {/* Live timer */}
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full shrink-0">
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono font-bold text-slate-700 text-sm tabular-nums">{formatTime(elapsed)}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col">
        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full mb-4 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-500"
            style={{ width: `${Math.min((questionIndex / maxQuestions) * 100, 100)}%` }}
          />
        </div>

        <div className="text-center mb-8">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Question {Math.min(questionIndex + 1, maxQuestions)} of {maxQuestions}
          </span>
        </div>

        {/* Question card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center relative min-h-[300px]">
          {lastScore !== null && (
            <div className="absolute top-6 right-6 font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
              Score: {lastScore}
            </div>
          )}

          {isLoading && !currentQuestion ? (
            <div className="w-full space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto"></div>
              <div className="h-8 bg-slate-100 rounded w-3/4 mx-auto"></div>
              <div className="h-8 bg-slate-100 rounded w-2/3 mx-auto"></div>
            </div>
          ) : (
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
              {currentQuestion}
            </h2>
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Transcript + word count */}
          {(isListening || transcript) && (
            <div className="w-full">
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 min-h-[80px] text-slate-600 text-sm italic">
                {isListening && <span className="text-indigo-600 font-bold text-[10px] block mb-1">LISTENING...</span>}
                {transcript || 'Waiting...'}
              </div>
              {/* Word count bar */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isOverLimit ? 'bg-red-500' : 'bg-indigo-400'}`}
                    style={{ width: `${Math.min((words / ANSWER_WORD_LIMIT) * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-mono font-bold tabular-nums ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
                  {words}/{ANSWER_WORD_LIMIT}w
                </span>
                {isOverLimit && (
                  <span className="text-xs text-red-500 font-medium">Keep it concise!</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* Countdown overlay replaces the mic button */}
            {countdown !== null ? (
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${
                countdown === 'GO!' ? 'bg-emerald-500' : 'bg-indigo-500'
              } text-white`}>
                <span className="text-3xl font-black animate-ping absolute">{countdown}</span>
                <span className="text-3xl font-black">{countdown}</span>
              </div>
            ) : (
              <button
                id="interview-mic-btn"
                onClick={handleMicClick}
                disabled={isLoading || isSpeaking || countdown !== null}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
                } disabled:opacity-30`}
              >
              {isListening ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0h-4m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
              </button>
            )}

            {showSubmit && !isListening && (
              <button onClick={handleSubmit} className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold">
                Submit Answer
              </button>
            )}
          </div>

          <p className="text-slate-400 text-xs">
            {countdown !== null
              ? 'Get ready to speak...'
              : isSpeaking
              ? 'Interviewer is speaking...'
              : isListening
              ? 'Click again to finish speaking'
              : 'Click to start recording'}
          </p>
        </div>
      </main>
    </div>
  );
}
