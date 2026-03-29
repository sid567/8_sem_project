export default function OverallScore({ score = 0 }) {
  const colorClass = score >= 70 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const strokeClass = score >= 70 ? 'stroke-emerald-500' : score >= 50 ? 'stroke-amber-500' : 'stroke-red-500';

  // Circular progress math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${strokeClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        
        <div className="text-center">
          <span className={`text-6xl font-black tracking-tighter ${colorClass}`}>
            {score}
          </span>
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Overall Score
          </span>
        </div>
      </div>
    </div>
  );
}
