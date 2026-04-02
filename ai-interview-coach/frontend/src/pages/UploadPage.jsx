import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, Trophy, ArrowRight, Lock } from 'lucide-react';
import DropZone       from '../components/upload/DropZone';
import UploadProgress from '../components/upload/UploadProgress';
import useUpload      from '../hooks/useUpload';

const PRESETS = [
  { label: 'Quick',    questions: 5,  duration: '~5 min',  icon: Zap,    color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/40' },
  { label: 'Standard', questions: 10, duration: '~12 min', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/40' },
  { label: 'Full',     questions: 15, duration: '~20 min', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/40' },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(10);

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
    if (sessionId) navigate(`/interview/${sessionId}?questions=${questionCount}`);
  }

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-20 px-4 flex items-start justify-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-indigo-700/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mt-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Step 1 of 2</p>
            <h1 className="text-3xl font-bold font-heading text-white mb-3">Upload your CV</h1>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
              We'll read your background and generate questions tailored specifically to you.
            </p>
          </motion.div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm flex flex-col gap-6"
        >
          {/* Dropzone */}
          <div>
            <DarkDropZone onFileAccepted={handleFileAccepted} />
            <UploadProgress uploading={uploading} success={success} error={error} candidateName={candidateName} />
          </div>

          {/* Analyse */}
          {file && !success && (
            <button
              id="btn-analyse-cv"
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                uploading
                  ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5'
              }`}
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-indigo-200/40 border-t-indigo-200 rounded-full animate-spin" />
                  Analysing your CV…
                </>
              ) : 'Analyse CV'}
            </button>
          )}

          {/* Length picker */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
                Choose interview length
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {PRESETS.map(({ label, questions, duration, icon: Icon, color, bg, border }) => {
                  const selected = questionCount === questions;
                  return (
                    <button
                      key={label}
                      onClick={() => setQuestionCount(questions)}
                      className={`flex flex-col items-center gap-2 py-5 px-2 rounded-xl border-2 transition-all duration-200 ${
                        selected
                          ? `${border} ${bg}`
                          : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                      }`}
                    >
                      <Icon size={22} className={selected ? color : 'text-slate-500'} />
                      <span className={`text-sm font-bold font-heading ${selected ? 'text-white' : 'text-slate-400'}`}>
                        {label}
                      </span>
                      <span className={`text-xs ${selected ? 'text-slate-300' : 'text-slate-600'}`}>
                        {questions} Qs · {duration}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                id="btn-start-interview"
                onClick={handleStartInterview}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Start Interview · {questionCount} Questions
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Privacy note */}
        <p className="mt-5 flex items-center justify-center gap-1.5 text-slate-600 text-xs">
          <Lock size={11} />
          Your CV is processed securely and never stored permanently.
        </p>
      </div>
    </div>
  );
}

/* ── Dark-themed dropzone wrapper ─────────────────────────── */
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileCheck2 } from 'lucide-react';

function DarkDropZone({ onFileAccepted }) {
  const [dropError, setDropError] = useState('');
  const [acceptedFile, setAcceptedFile] = useState(null);

  const onDrop = useCallback(
    (accepted, rejected) => {
      setDropError('');
      if (rejected.length > 0) {
        const reason = rejected[0].errors[0];
        setDropError(
          reason.code === 'file-too-large'
            ? 'File exceeds the 5 MB limit.'
            : reason.code === 'file-invalid-type'
            ? 'Unsupported type — use PDF or DOCX.'
            : reason.message
        );
        setAcceptedFile(null);
        return;
      }
      if (accepted.length > 0) {
        setAcceptedFile(accepted[0]);
        onFileAccepted(accepted[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        id="cv-dropzone"
        className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-12 px-6 cursor-pointer transition-all duration-200 select-none outline-none ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : acceptedFile
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-slate-700 bg-slate-800/30 hover:border-indigo-500/60 hover:bg-indigo-500/5'
        }`}
      >
        <input {...getInputProps()} />

        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          acceptedFile ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700/60 text-slate-400'
        }`}>
          {acceptedFile
            ? <FileCheck2 size={28} />
            : <UploadCloud size={28} />
          }
        </div>

        {acceptedFile ? (
          <div className="text-center">
            <p className="text-emerald-400 font-semibold text-sm">{acceptedFile.name}</p>
            <p className="text-slate-500 text-xs mt-1">{(acceptedFile.size / 1024).toFixed(1)} KB · Click to change</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-slate-300 font-medium text-sm">
              {isDragActive ? 'Drop it here…' : 'Drop your CV here or click to browse'}
            </p>
            <p className="text-slate-600 text-xs mt-1.5">PDF or DOCX · max 5 MB</p>
          </div>
        )}
      </div>

      {dropError && (
        <p className="mt-3 text-red-400 text-xs flex items-center gap-1.5">
          <span className="shrink-0">⚠</span>
          {dropError}
        </p>
      )}
    </div>
  );
}
