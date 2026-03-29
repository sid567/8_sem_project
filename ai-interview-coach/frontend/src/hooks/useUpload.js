import { useState } from 'react';
import api from '../services/api';

/**
 * Manages CV file selection and backend upload lifecycle.
 *
 * @returns {{
 *   file: File|null,
 *   uploading: boolean,
 *   success: boolean,
 *   error: string,
 *   sessionId: string,
 *   candidateName: string,
 *   handleFileAccepted: (file: File) => void,
 *   handleUpload: () => Promise<void>
 * }}
 */
export default function useUpload() {
  const [file,          setFile]          = useState(null);
  const [uploading,     setUploading]     = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [error,         setError]         = useState('');
  const [sessionId,     setSessionId]     = useState('');
  const [candidateName, setCandidateName] = useState('');

  /** Called by DropZone when a valid file is selected. */
  function handleFileAccepted(selectedFile) {
    setFile(selectedFile);
    // Reset previous upload state whenever a new file is picked
    setSuccess(false);
    setError('');
    setSessionId('');
    setCandidateName('');
  }

  /** Uploads the file to the backend and parses the session response. */
  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSessionId(data.sessionId);
      setCandidateName(data.candidateName || '');
      setSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Upload failed. Please try again.';
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  return {
    file,
    uploading,
    success,
    error,
    sessionId,
    candidateName,
    handleFileAccepted,
    handleUpload,
  };
}
