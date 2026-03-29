import { useState, useCallback, useRef, useEffect } from 'react';

export default function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentResult = '';
      for (let i = 0; i < event.results.length; i++) {
        currentResult += event.results[i][0].transcript;
      }
      setTranscript(currentResult);
    };

    recognition.onend = () => {
      // Auto-restart logic: if we are supposed to be listening but the browser
      // terminated the session (e.g. long silence in non-continuous mode), restart it.
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error('[Speech] Failed to auto-restart:', e);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Use a ref for isListening to access current value in the onend callback
  const isListeningRef = useRef(isListening);
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setTranscript('');
    setIsListening(true);
    startTimeRef.current = Date.now();
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('[Speech] Start failed (likely already active):', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return { transcript: '', durationSeconds: 0 };

    recognitionRef.current.stop();
    setIsListening(false);
    
    const durationSeconds = startTimeRef.current 
      ? (Date.now() - startTimeRef.current) / 1000 
      : 0;
      
    return { 
      transcript, 
      durationSeconds: Math.max(1, durationSeconds) 
    };
  }, [transcript]);

  return { 
    startListening, 
    stopListening, 
    transcript, 
    isListening, 
    isSupported 
  };
}
