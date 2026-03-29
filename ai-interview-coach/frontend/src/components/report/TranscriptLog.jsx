import { useState } from 'react';

function QuestionItem({ question }) {
  const [isOpen, setIsOpen] = useState(false);
  const { technicalScore, depthScore, clarityScore, confidenceScore } = question.scores || {};

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden mb-4 bg-white transition-all hover:shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-start justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
              {question.stage.replace('_', ' ')}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Question {question.questionIndex + 1}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-800">{question.questionText}</h4>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className={`text-lg font-black ${technicalScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {technicalScore || 0}%
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-0 animate-fade-in">
          <div className="bg-slate-50 rounded-xl p-5 mb-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Transcript</h5>
            <p className="text-sm text-slate-700 italic">"{question.transcribedAnswer || 'No answer recorded.'}"</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
             <ScoreStat label="Technical" value={technicalScore} />
             <ScoreStat label="Depth" value={depthScore} />
             <ScoreStat label="Clarity" value={clarityScore} />
             <ScoreStat label="Confidence" value={confidenceScore} />
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5">
            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">AI Feedback</h5>
            <p className="text-sm text-indigo-900 font-bold mb-1">{question.feedback?.summary}</p>
            <p className="text-sm text-indigo-700/80">💡 {question.feedback?.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreStat({ label, value }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-slate-100">
      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-base font-black text-slate-800">{value || 0}%</div>
    </div>
  );
}

export default function TranscriptLog({ questions = [] }) {
  return (
    <div className="py-6">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Detailed Transcript</h3>
      {questions.length > 0 ? (
        questions.map((q) => <QuestionItem key={q._id} question={q} />)
      ) : (
        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
          Questions will appear here after submission.
        </div>
      )}
    </div>
  );
}
