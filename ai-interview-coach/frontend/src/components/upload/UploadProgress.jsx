/**
 * @param {{
 *   uploading: boolean,
 *   success: boolean,
 *   error: string,
 *   candidateName: string
 * }} props
 */
export default function UploadProgress({ uploading, success, error, candidateName }) {
  if (!uploading && !success && !error) return null;

  return (
    <div className="mt-4 w-full">
      {/* Uploading / analysing */}
      {uploading && (
        <div className="flex items-center gap-3 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
          {/* Spinner */}
          <svg
            className="w-5 h-5 shrink-0 animate-spin text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm text-indigo-700 font-medium">Analysing your CV…</p>
        </div>
      )}

      {/* Success */}
      {success && !uploading && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <span className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-emerald-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <p className="text-sm text-emerald-800 font-medium">
            Ready,{' '}
            <span className="text-emerald-600">{candidateName || 'candidate'}</span>!
            Your profile has been extracted.
          </p>
        </div>
      )}

      {/* Error */}
      {error && !uploading && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
