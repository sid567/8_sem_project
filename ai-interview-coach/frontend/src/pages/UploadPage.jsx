import { useNavigate } from 'react-router-dom';
import DropZone       from '../components/upload/DropZone';
import UploadProgress from '../components/upload/UploadProgress';
import useUpload      from '../hooks/useUpload';

export default function UploadPage() {
  const navigate = useNavigate();

  const {
    file,
    uploading,
    success,
    error,
    sessionId,
    candidateName,
    handleFileAccepted,
    handleUpload,
  } = useUpload();

  function handleStartInterview() {
    if (sessionId) navigate(`/interview/${sessionId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* ---------- Header ---------- */}
        <div className="mb-8 text-center">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            AI Interview Coach
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Upload your CV and we'll tailor a mock interview just for you.
          </p>
        </div>

        {/* ---------- Card ---------- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 px-8 py-8 flex flex-col gap-5">

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold">1</span>
            Upload your résumé
          </div>

          {/* Drop zone */}
          <DropZone onFileAccepted={handleFileAccepted} />

          {/* Progress / status */}
          <UploadProgress
            uploading={uploading}
            success={success}
            error={error}
            candidateName={candidateName}
          />

          {/* Analyse button — visible once a file is picked, before success */}
          {file && !success && (
            <button
              id="btn-analyse-cv"
              onClick={handleUpload}
              disabled={uploading}
              className={[
                'w-full rounded-xl py-3 px-5 text-sm font-semibold transition-all duration-150',
                uploading
                  ? 'bg-indigo-300 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-md shadow-indigo-200',
              ].join(' ')}
            >
              {uploading ? 'Analysing…' : 'Analyse CV'}
            </button>
          )}

          {/* Start Interview button — only enabled after successful upload */}
          {success && (
            <button
              id="btn-start-interview"
              onClick={handleStartInterview}
              className="w-full rounded-xl py-3 px-5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-md shadow-emerald-200 transition-all duration-150 flex items-center justify-center gap-2"
            >
              Start Interview
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>

        {/* ---------- Footer note ---------- */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Your CV is processed securely and never stored permanently.
        </p>

      </div>
    </div>
  );
}
