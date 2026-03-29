export default function VoiceMetrics({ metrics = {} }) {
  const statCards = [
    { label: 'Avg WPM', value: metrics.avgWPM || 0, icon: '⚡', subtitle: 'Normal: 120-160' },
    { label: 'Filler Words', value: metrics.totalFillerWords || 0, icon: '🗣️', subtitle: 'Um, Ah, Like' },
    { label: 'Longest Pause', value: `${(metrics.longestPause || 0).toFixed(1)}s`, icon: '⏸️', subtitle: 'Fluency' },
    { label: 'Q&A Pairs', value: metrics.answerCount || 0, icon: '✅', subtitle: 'Total rounds' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
      {statCards.map((card, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{card.icon}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{card.value}</div>
          <div className="text-[10px] text-slate-400 mt-1">{card.subtitle}</div>
        </div>
      ))}
    </div>
  );
}
