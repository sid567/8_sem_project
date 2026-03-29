import { useState, useCallback } from 'react';
import api from '../services/api';
import { STAGES } from '../utils/constants';

export default function useInterview() {
  const [currentStage, setCurrentStage] = useState('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Helper to determine next stage
  const getNextStageInfo = (currentIndex) => {
    let count = 0;
    for (const stage of STAGES) {
      count += stage.questionCount;
      if (currentIndex < count) return stage.id;
    }
    return null;
  };

  const fetchNextQuestion = useCallback(async (sessionId) => {
    setIsLoading(true);
    try {
      const stage = getNextStageInfo(questionIndex);
      if (!stage) {
        setIsComplete(true);
        return;
      }

      setCurrentStage(stage);

      const response = await api.post(`/api/session/${sessionId}/question`, {
        stage,
        conversationHistory
      });

      setCurrentQuestion(response.data.questionText);
      setCurrentQuestionId(response.data.questionId);
      
      // Add interviewer turn to history
      setConversationHistory(prev => [...prev, { 
        role: 'interviewer', 
        text: response.data.questionText 
      }]);
    } catch (err) {
      console.error('Failed to fetch next question', err);
    } finally {
      setIsLoading(false);
    }
  }, [questionIndex, conversationHistory]);

  const submitAnswer = useCallback(async (sessionId, transcript, voiceMetrics) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/api/session/${sessionId}/answer`, {
        questionId: currentQuestionId,
        transcriptText: transcript,
        voiceMetrics
      });

      // Add candidate turn to history
      setConversationHistory(prev => [...prev, { 
        role: 'candidate', 
        text: transcript 
      }]);

      setQuestionIndex(prev => prev + 1);
      
      return response.data; // Return scores and feedback
    } catch (err) {
      console.error('Failed to submit answer', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestionId]);

  const completeInterview = useCallback(async (sessionId) => {
    try {
      await api.post(`/api/session/${sessionId}/complete`);
    } catch (err) {
      console.error('Failed to complete interview', err);
    }
  }, []);

  return {
    currentStage,
    questionIndex,
    currentQuestion,
    currentQuestionId,
    conversationHistory,
    isLoading,
    isComplete,
    fetchNextQuestion,
    submitAnswer,
    completeInterview
  };
}
