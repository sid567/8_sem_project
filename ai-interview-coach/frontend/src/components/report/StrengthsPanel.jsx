export default function StrengthsPanel({ strengths = [], improvements = [] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 py-4">
      {/* Strengths */}
      <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
        <h3 className="flex items-center gap-2 text-emerald-800 font-bold mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          Top Strengths
        </h3>
        <ul className="space-y-3">
          {strengths.length > 0 ? strengths.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-emerald-700 leading-relaxed bg-white/60 p-3 rounded-xl border border-emerald-100/50">
              <span className="font-bold shrink-0 opacity-40">#{i + 1}</span>
              {s}
            </li>
          )) : <li className="text-sm text-emerald-600/60 italic">Complete technical questions to see strengths</li>}
        </ul>
      </div>

      {/* Improvements */}
      <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100">
        <h3 className="flex items-center gap-2 text-amber-800 font-bold mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-[10px]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Areas for Improvement
        </h3>
        <ul className="space-y-3">
          {improvements.length > 0 ? improvements.map((imp, i) => (
            <li key={i} className="flex gap-3 text-sm text-amber-700 leading-relaxed bg-white/60 p-3 rounded-xl border border-amber-100/50">
              <span className="font-bold shrink-0 opacity-40">#{i + 1}</span>
              {imp}
            </li>
          )) : <li className="text-sm text-amber-600/60 italic">No major improvements identified yet.</li>}
        </ul>
      </div>
    </div>
  );
}
