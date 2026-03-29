import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

/**
 * @param {{ onFileAccepted: (file: File) => void }} props
 */
export default function DropZone({ onFileAccepted }) {
  const [dropError, setDropError] = useState('');
  const [acceptedFile, setAcceptedFile] = useState(null);

  const onDrop = useCallback(
    (accepted, rejected) => {
      setDropError('');

      if (rejected.length > 0) {
        const reason = rejected[0].errors[0];
        if (reason.code === 'file-too-large') {
          setDropError('File exceeds the 5 MB limit. Please upload a smaller file.');
        } else if (reason.code === 'file-invalid-type') {
          setDropError('Unsupported file type. Please upload a PDF or DOCX file.');
        } else {
          setDropError(reason.message);
        }
        setAcceptedFile(null);
        return;
      }

      if (accepted.length > 0) {
        const file = accepted[0];
        setAcceptedFile(file);
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        id="cv-dropzone"
        className={[
          'relative flex flex-col items-center justify-center gap-3',
          'rounded-2xl border-2 border-dashed px-6 py-12 cursor-pointer',
          'transition-all duration-200 select-none outline-none',
          isDragActive
            ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
            : acceptedFile
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50',
        ].join(' ')}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        <div
          className={[
            'flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-200',
            acceptedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-500',
          ].join(' ')}
        >
          {acceptedFile ? (
            /* document-check icon */
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5H7z" />
            </svg>
          ) : (
            /* upload-cloud icon */
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>

        {/* Label */}
        {acceptedFile ? (
          <p className="text-sm font-medium text-emerald-700 text-center">
            {acceptedFile.name}
            <span className="block text-xs text-emerald-500 font-normal mt-0.5">
              {(acceptedFile.size / 1024).toFixed(1)} KB · Click to change
            </span>
          </p>
        ) : (
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            {isDragActive ? (
              <span className="text-indigo-600 font-medium">Release to upload</span>
            ) : (
              <>
                <span className="text-indigo-600 font-medium">Drop your CV here</span>
                {' '}or click to browse
                <span className="block text-xs text-slate-400 mt-1">PDF or DOCX · max 5 MB</span>
              </>
            )}
          </p>
        )}
      </div>

      {/* Validation error */}
      {dropError && (
        <p className="mt-2.5 flex items-center gap-1.5 text-sm text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {dropError}
        </p>
      )}
    </div>
  );
}
