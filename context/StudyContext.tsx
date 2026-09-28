'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudyContent, ProcessingStatus } from '@/types/study';
import { Flashcard, FlashcardStatus } from '@/types/flashcards';
import { QuizQuestion, QuizStatus } from '@/types/quiz';

interface StudyContextType {
  status: ProcessingStatus;
  studyData: StudyContent | null;
  errorMessage: string | null;
  flashcards: Flashcard[] | null;
  flashcardStatus: FlashcardStatus;
  flashcardError: string | null;
  quizQuestions: QuizQuestion[] | null;
  quizStatus: QuizStatus;
  quizError: string | null;
  handleProcessPdf: (file: File) => Promise<void>;
  handleGenerateFlashcards: () => Promise<boolean>;
  handleGenerateQuiz: () => Promise<boolean>;
  handleReset: () => void;
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[] | null>>;
  setQuizQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[] | null>>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'studydesk_current_notes';
const SESSION_STORAGE_FLASHCARDS_KEY = 'studydesk_current_flashcards';
const SESSION_STORAGE_QUIZ_KEY = 'studydesk_current_quiz';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [studyData, setStudyData] = useState<StudyContent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [flashcardStatus, setFlashcardStatus] = useState<FlashcardStatus>('idle');
  const [flashcardError, setFlashcardError] = useState<string | null>(null);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('idle');
  const [quizError, setQuizError] = useState<string | null>(null);

  // Restore studyData, flashcards, and quiz from sessionStorage on initial mount
  useEffect(() => {
    try {
      const savedNotes = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (parsed && typeof parsed === 'object' && parsed.summary) {
          setStudyData(parsed);
          setStatus('success');
        }
      }

      const savedCards = sessionStorage.getItem(SESSION_STORAGE_FLASHCARDS_KEY);
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        if (Array.isArray(parsedCards) && parsedCards.length > 0) {
          setFlashcards(parsedCards);
          setFlashcardStatus('success');
        }
      }

      const savedQuiz = sessionStorage.getItem(SESSION_STORAGE_QUIZ_KEY);
      if (savedQuiz) {
        const parsedQuiz = JSON.parse(savedQuiz);
        if (Array.isArray(parsedQuiz) && parsedQuiz.length > 0) {
          setQuizQuestions(parsedQuiz);
          setQuizStatus('success');
        }
      }
    } catch {
      // Ignore session storage parse errors
    }
  }, []);

  const handleProcessPdf = async (file: File) => {
    setStatus('extracting');
    setErrorMessage(null);
    setFlashcards(null);
    setFlashcardStatus('idle');
    setQuizQuestions(null);
    setQuizStatus('idle');

    const formData = new FormData();
    formData.append('file', file);

    const statusTimer = setTimeout(() => {
      setStatus('analyzing');
    }, 1500);

    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(statusTimer);

      const contentType = response.headers.get('content-type') || '';
      let result: any = null;

      if (contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch {
          result = null;
        }
      }

      if (!result) {
        setStatus('error');
        setErrorMessage('Server returned an invalid response. Please try again later.');
        return;
      }

      if (!response.ok || !result.success) {
        setStatus('error');
        setErrorMessage(
          result.error || 'Failed to process document. Please ensure your PDF contains readable text.'
        );
        return;
      }

      setStudyData(result.data);
      setStatus('success');

      // Persist to session storage
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(result.data));
        sessionStorage.removeItem(SESSION_STORAGE_FLASHCARDS_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_QUIZ_KEY);
      } catch {
        // Ignore quota/session storage errors
      }
    } catch (error: any) {
      clearTimeout(statusTimer);
      setStatus('error');
      const msg = error?.message || '';
      if (msg.includes('Unexpected token') || msg.includes('JSON')) {
        setErrorMessage('Unable to process document. Server returned an invalid response.');
      } else {
        setErrorMessage(
          msg || 'Network error occurred while connecting to the server. Please try again.'
        );
      }
    }
  };

  const handleGenerateFlashcards = async (): Promise<boolean> => {
    if (!studyData) {
      setFlashcardStatus('error');
      setFlashcardError('No study notes available. Please upload a PDF first.');
      return false;
    }

    setFlashcardStatus('loading');
    setFlashcardError(null);

    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studyContent: studyData }),
      });

      const contentType = response.headers.get('content-type') || '';
      let result: any = null;

      if (contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch {
          result = null;
        }
      }

      if (!response.ok || !result || !result.success) {
        setFlashcardStatus('error');
        const userMsg =
          result?.error || 'Couldn\'t generate flashcards. Please try again.';
        setFlashcardError(userMsg);
        return false;
      }

      const generatedCards: Flashcard[] = result.data.flashcards;
      setFlashcards(generatedCards);
      setFlashcardStatus('success');

      try {
        sessionStorage.setItem(
          SESSION_STORAGE_FLASHCARDS_KEY,
          JSON.stringify(generatedCards)
        );
      } catch {
        // Ignore quota errors
      }

      return true;
    } catch (error: any) {
      setFlashcardStatus('error');
      setFlashcardError('Couldn\'t generate flashcards. Please check your connection and try again.');
      return false;
    }
  };

  const handleGenerateQuiz = async (): Promise<boolean> => {
    if (!studyData) {
      setQuizStatus('error');
      setQuizError('No study notes available. Please upload a PDF first.');
      return false;
    }

    setQuizStatus('loading');
    setQuizError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studyContent: studyData }),
      });

      const contentType = response.headers.get('content-type') || '';
      let result: any = null;

      if (contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch {
          result = null;
        }
      }

      if (!response.ok || !result || !result.success) {
        setQuizStatus('error');
        const userMsg =
          result?.error || 'Couldn\'t generate your quiz. Please try again.';
        setQuizError(userMsg);
        return false;
      }

      const generatedQuestions: QuizQuestion[] = result.data.questions;
      setQuizQuestions(generatedQuestions);
      setQuizStatus('success');

      try {
        sessionStorage.setItem(
          SESSION_STORAGE_QUIZ_KEY,
          JSON.stringify(generatedQuestions)
        );
      } catch {
        // Ignore quota errors
      }

      return true;
    } catch (error: any) {
      setQuizStatus('error');
      setQuizError('Couldn\'t generate your quiz. Please check your connection and try again.');
      return false;
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setStudyData(null);
    setErrorMessage(null);
    setFlashcards(null);
    setFlashcardStatus('idle');
    setFlashcardError(null);
    setQuizQuestions(null);
    setQuizStatus('idle');
    setQuizError(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_FLASHCARDS_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_QUIZ_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <StudyContext.Provider
      value={{
        status,
        studyData,
        errorMessage,
        flashcards,
        flashcardStatus,
        flashcardError,
        quizQuestions,
        quizStatus,
        quizError,
        handleProcessPdf,
        handleGenerateFlashcards,
        handleGenerateQuiz,
        handleReset,
        setFlashcards,
        setQuizQuestions,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = (): StudyContextType => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
