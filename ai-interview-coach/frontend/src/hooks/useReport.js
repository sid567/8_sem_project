import { useState, useEffect } from 'react';
import api from '../services/api';

export default function useReport(sessionId) {
  const [report, setReport] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!sessionId) return;
      
      setLoading(true);
      try {
        const [reportRes, questionsRes] = await Promise.all([
          api.get(`/api/session/${sessionId}/report`),
          api.get(`/api/session/${sessionId}/questions`)
        ]);
        
        setReport(reportRes.data);
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error('Failed to fetch report data', err);
        setError(err.response?.data?.error || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sessionId]);

  return { report, questions, loading, error };
}
