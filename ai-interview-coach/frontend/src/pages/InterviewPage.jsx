import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useInterview from '../hooks/useInterview';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { computeWPM, countFillers } from '../utils/voiceMetrics';
import { STAGES, MAX_QUESTIONS } from '../utils/constants';

export default function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const {
    currentStage,
    questionIndex,
    currentQuestion,
    isLoading,
    isComplete,
    fetchNextQuestion,
    submitAnswer,
    completeInterview
  } = useInterview();

  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const { startListening, stopListening, transcript, isListening, isSupported } = useSpeechRecognition();

  const [lastScore, setLastScore] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Load first question on mount
  const handleInitialFetch = useCallback(() => {
    setFetchError(null);
    fetchNextQuestion(sessionId).catch(err => setFetchError(err.message));
  }, [sessionId, fetchNextQuestion]);

  useEffect(() => {
    if (sessionId) handleInitialFetch();
  }, [sessionId]);

  // Speak question when it changes
  useEffect(() => {
    if (currentQuestion) {
      speak(currentQuestion);
      setLastScore(null);
      setShowSubmit(false);
    }
  }, [currentQuestion, speak]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setShowSubmit(true);
    } else {
      cancel(); 
      startListening();
      setShowSubmit(false);
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
    await completeInterview(sessionId);
    navigate(`/report/${sessionId}`);
  };

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
        <button 
          onClick={handleInitialFetch}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Interview Complete!</h2>
        <p className="text-slate-600 mb-8 max-w-md">Your report is ready.</p>
        <button onClick={handleFinish} className="bg-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg">View Full Report</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          {STAGES.map((s) => (
            <div key={s.id} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${currentStage === s.id ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400'}`}>
              {s.label}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col">
        <div className="w-full bg-slate-200 h-1.5 rounded-full mb-4 overflow-hidden">
          <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${(questionIndex / MAX_QUESTIONS) * 100}%` }} />
        </div>
        
        <div className="text-center mb-8">
           <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Question {questionIndex + 1} of {MAX_QUESTIONS}</span>
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center relative min-h-[300px]">
          {lastScore !== null && (
            <div className="absolute top-6 right-6 font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">Score: {lastScore}</div>
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

        <div className="mt-8 flex flex-col items-center gap-6">
          {(isListening || transcript) && (
            <div className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 min-h-[80px] text-slate-600 text-sm italic">
               {isListening && <span className="text-indigo-600 font-bold text-[10px] block mb-1">LISTENING...</span>}
               {transcript || "Waiting..."}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              id="interview-mic-btn"
              onClick={handleMicClick}
              disabled={isLoading || isSpeaking}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'
              } disabled:opacity-30`}
            >
              {isListening ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0h-4m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
            </button>

            {showSubmit && !isListening && (
              <button onClick={handleSubmit} className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold">Submit Answer</button>
            )}
          </div>
          <p className="text-slate-400 text-xs">
            {isSpeaking ? "Interviewer is speaking..." : isListening ? "Click again to finish speaking" : "Click to start recording"}
          </p>
        </div>
      </main>
    </div>
  );
}
