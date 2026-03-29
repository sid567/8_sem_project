import { useParams, Link } from 'react-router-dom';
import useReport        from '../hooks/useReport';
import OverallScore     from '../components/report/OverallScore';
import StageBreakdown   from '../components/report/StageBreakdown';
import VoiceMetrics     from '../components/report/VoiceMetrics';
import StrengthsPanel   from '../components/report/StrengthsPanel';
import TranscriptLog    from '../components/report/TranscriptLog';

export default function ReportPage() {
  const { sessionId } = useParams();
  const { report, questions, loading, error } = useReport(sessionId);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Generating detailed analysis...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="text-red-500 text-5xl">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800">{error || 'Report not found.'}</h2>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">Back to start</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-indigo-100">
      
      {/* ---------- Header ---------- */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm hover:scale-105 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
            </Link>
            <span className="font-bold text-slate-800 tracking-tight">Interview Report</span>
          </div>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Save as PDF
          </button>
        </div>
      </header>

      {/* ---------- Print Banner ---------- */}
      <div className="hidden print:block w-full border-b-2 border-indigo-600 pb-4 mb-8">
        <h1 className="text-2xl font-black text-indigo-600">AI Interview Coach</h1>
        <p className="text-xs text-slate-400">Detailed Performance Analysis for Session: {sessionId}</p>
      </div>

      {/* ---------- Main Dashboard ---------- */}
      <main className="max-w-4xl mx-auto px-6 py-10 print:py-0">
        
        {/* Top Fold: Big Score + Charts */}
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2 bg-white rounded-[40px] shadow-sm border border-slate-100 flex items-center justify-center p-4">
             <OverallScore score={report.overallScore} />
          </div>
          <div className="md:col-span-3">
             <StageBreakdown stageScores={report.stageScores} />
          </div>
        </div>

        {/* Section 2: Metrics */}
        <section className="mb-8">
          <VoiceMetrics metrics={report.voiceMetrics} />
        </section>

        {/* Section 3: AI Insights */}
        <section className="mb-12">
           <StrengthsPanel strengths={report.topStrengths} improvements={report.topImprovements} />
        </section>

        {/* Section 4: Transcript (Detailed review) */}
        <section className="border-t border-slate-200 pt-10 print:pt-6">
           <TranscriptLog questions={questions} />
        </section>

      </main>

      {/* Basic Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { width: 100% !important; max-width: 100% !important; padding: 0 !important; }
          .rounded-[40px], .rounded-3xl { border-radius: 12px !important; border: 1px solid #e2e8f0 !important; }
          svg circle.text-slate-100 { stroke: #f1f5f9 !important; }
        }
      `}} />

    </div>
  );
}
