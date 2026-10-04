'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { StudyContent, ProcessingStatus } from '@/types/study';
import { Flashcard, FlashcardStatus } from '@/types/flashcards';
import { QuizQuestion, QuizStatus } from '@/types/quiz';
import { supabase } from '@/lib/supabase';

interface SavedDocument {
  id: string;
  title: string;
  source_filename: string | null;
  created_at: string;
}

interface StudyContextType {
  status: ProcessingStatus;
  studyData: StudyContent | null;
  pageCount: number | null;
  documentId: string | null;
  savedDocuments: SavedDocument[];
  documentsLoading: boolean;
  selectingDocumentId: string | null;
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
  selectDocument: (id: string) => Promise<boolean>;
  handleReset: () => void;
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[] | null>>;
  setQuizQuestions: React.Dispatch<React.SetStateAction<QuizQuestion[] | null>>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'studydesk_current_notes';
const SESSION_STORAGE_FLASHCARDS_KEY = 'studydesk_current_flashcards';
const SESSION_STORAGE_QUIZ_KEY = 'studydesk_current_quiz';
const SESSION_STORAGE_DOCUMENT_ID_KEY = 'studydesk_current_document_id';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [studyData, setStudyData] = useState<StudyContent | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [selectingDocumentId, setSelectingDocumentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [flashcardStatus, setFlashcardStatus] = useState<FlashcardStatus>('idle');
  const [flashcardError, setFlashcardError] = useState<string | null>(null);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('idle');
  const [quizError, setQuizError] = useState<string | null>(null);
  const authVersionRef = useRef(0);
  const documentsRequestVersionRef = useRef(0);
  const selectionRequestVersionRef = useRef(0);

  const refreshSavedDocuments = useCallback(async (authVersion: number) => {
    const requestVersion = ++documentsRequestVersionRef.current;
    const isCurrentRequest = () =>
      authVersion === authVersionRef.current &&
      requestVersion === documentsRequestVersionRef.current;

    setDocumentsLoading(true);
    try {
      const response = await fetch('/api/documents');
      const result = await response.json();
      if (!isCurrentRequest()) return null;

      const documents = result?.data?.documents;
      if (!response.ok || !result?.success || !Array.isArray(documents)) {
        setSavedDocuments([]);
        return null;
      }

      setSavedDocuments(documents);
      return documents as SavedDocument[];
    } catch {
      if (isCurrentRequest()) {
        setSavedDocuments([]);
      }
      return null;
    } finally {
      if (isCurrentRequest()) {
        setDocumentsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    let activeUserId: string | null = null;

    const clearStudyState = () => {
      setStatus('idle');
      setStudyData(null);
      setPageCount(null);
      setDocumentId(null);
      setErrorMessage(null);
      setFlashcards(null);
      setFlashcardStatus('idle');
      setFlashcardError(null);
      setQuizQuestions(null);
      setQuizStatus('idle');
      setQuizError(null);
      setSavedDocuments([]);
      setDocumentsLoading(false);
      setSelectingDocumentId(null);
      selectionRequestVersionRef.current += 1;
      documentsRequestVersionRef.current += 1;

      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_DOCUMENT_ID_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_FLASHCARDS_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_QUIZ_KEY);
      } catch {
        // Ignore storage access errors.
      }
    };

    const loadMostRecentDocument = async (userId: string, version: number) => {
      const selectionVersion = ++selectionRequestVersionRef.current;
      const isCurrentRequest = () =>
        active &&
        activeUserId === userId &&
        authVersionRef.current === version &&
        selectionRequestVersionRef.current === selectionVersion;

      try {
        const documents = await refreshSavedDocuments(version);
        if (!isCurrentRequest()) return;
        const mostRecent = Array.isArray(documents) ? documents[0] : null;
        if (!mostRecent || typeof mostRecent.id !== 'string') {
          setStatus('idle');
          setStudyData(null);
          setPageCount(null);
          setDocumentId(null);
          setFlashcards(null);
          setFlashcardStatus('idle');
          setQuizQuestions(null);
          setQuizStatus('idle');
          return;
        }

        setSelectingDocumentId(mostRecent.id);
        const detailResponse = await fetch(
          `/api/documents/${encodeURIComponent(mostRecent.id)}`
        );
        const detailResult = await detailResponse.json();

        if (!isCurrentRequest()) return;
        const document = detailResult?.data;
        if (
          !detailResponse.ok ||
          !detailResult?.success ||
          !document ||
          typeof document.id !== 'string' ||
          !document.study_content
        ) {
          setStatus('idle');
          setStudyData(null);
          setPageCount(null);
          setDocumentId(null);
          setFlashcards(null);
          setFlashcardStatus('idle');
          setQuizQuestions(null);
          setQuizStatus('idle');
          return;
        }

        const loadedFlashcards: Flashcard[] = Array.isArray(document.flashcards)
          ? document.flashcards
          : [];
        const loadedQuizQuestions: QuizQuestion[] = Array.isArray(document.quizQuestions)
          ? document.quizQuestions
          : [];

        setStudyData(document.study_content);
        setPageCount(null);
        setDocumentId(document.id);
        setStatus('success');
        setErrorMessage(null);
        setFlashcards(loadedFlashcards.length > 0 ? loadedFlashcards : null);
        setFlashcardStatus(loadedFlashcards.length > 0 ? 'success' : 'idle');
        setFlashcardError(null);
        setQuizQuestions(loadedQuizQuestions.length > 0 ? loadedQuizQuestions : null);
        setQuizStatus(loadedQuizQuestions.length > 0 ? 'success' : 'idle');
        setQuizError(null);
      } catch {
        // Keep the dashboard in its empty state if loading fails.
      } finally {
        if (isCurrentRequest()) {
          setSelectingDocumentId(null);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUserId = session?.user.id ?? null;
      if (nextUserId !== activeUserId) {
        activeUserId = nextUserId;
        authVersionRef.current += 1;
        clearStudyState();

        if (nextUserId) {
          void loadMostRecentDocument(nextUserId, authVersionRef.current);
        }
      } else if (!nextUserId) {
        clearStudyState();
      }
    });

    return () => {
      active = false;
      selectionRequestVersionRef.current += 1;
      documentsRequestVersionRef.current += 1;
      subscription.unsubscribe();
    };
  }, [refreshSavedDocuments]);

  const handleProcessPdf = async (file: File) => {
    const authVersion = authVersionRef.current;
    selectionRequestVersionRef.current += 1;
    setSelectingDocumentId(null);
    setStatus('extracting');
    setDocumentId(null);
    setPageCount(null);
    setErrorMessage(null);
    setFlashcards(null);
    setFlashcardStatus('idle');
    setQuizQuestions(null);
    setQuizStatus('idle');

    const formData = new FormData();
    formData.append('file', file);

    const statusTimer = setTimeout(() => {
      if (authVersion === authVersionRef.current) {
        setStatus('analyzing');
      }
    }, 1500);

    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(statusTimer);
      if (authVersion !== authVersionRef.current) return;

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
        setPageCount(typeof result.pageCount === 'number' ? result.pageCount : null);
        setErrorMessage(
          result.error || 'Failed to process the PDF. Please check the file and try again.'
        );
        return;
      }

      if (typeof result.documentId !== 'string' || !result.documentId) {
        setStatus('error');
        setErrorMessage('The processed document was not saved correctly. Please try uploading it again.');
        return;
      }

      setStudyData(result.data);
      setDocumentId(result.documentId);
      setPageCount(typeof result.pageCount === 'number' ? result.pageCount : null);
      setStatus('success');
      void refreshSavedDocuments(authVersion);

      // Persist to session storage
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(result.data));
        sessionStorage.setItem(SESSION_STORAGE_DOCUMENT_ID_KEY, result.documentId);
        sessionStorage.removeItem(SESSION_STORAGE_FLASHCARDS_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_QUIZ_KEY);
      } catch {
        // Ignore quota/session storage errors
      }
    } catch (error: any) {
      clearTimeout(statusTimer);
      if (authVersion !== authVersionRef.current) return;
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

  const selectDocument = async (id: string) => {
    const authVersion = authVersionRef.current;
    const selectionVersion = ++selectionRequestVersionRef.current;
    const isCurrentRequest = () =>
      authVersion === authVersionRef.current &&
      selectionVersion === selectionRequestVersionRef.current;

    setSelectingDocumentId(id);

    try {
      const response = await fetch(`/api/documents/${encodeURIComponent(id)}`);
      const result = await response.json();
      if (!isCurrentRequest()) return false;

      const document = result?.data;
      if (
        !response.ok ||
        !result?.success ||
        !document ||
        document.id !== id ||
        !document.study_content
      ) {
        return false;
      }

      const loadedFlashcards: Flashcard[] = Array.isArray(document.flashcards)
        ? document.flashcards
        : [];
      const loadedQuizQuestions: QuizQuestion[] = Array.isArray(document.quizQuestions)
        ? document.quizQuestions
        : [];

      setStudyData(document.study_content);
      setPageCount(null);
      setDocumentId(document.id);
      setStatus('success');
      setErrorMessage(null);
      setFlashcards(loadedFlashcards);
      setFlashcardStatus(loadedFlashcards.length > 0 ? 'success' : 'idle');
      setFlashcardError(null);
      setQuizQuestions(loadedQuizQuestions);
      setQuizStatus(loadedQuizQuestions.length > 0 ? 'success' : 'idle');
      setQuizError(null);

      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(document.study_content));
        sessionStorage.setItem(SESSION_STORAGE_DOCUMENT_ID_KEY, document.id);
        sessionStorage.setItem(
          SESSION_STORAGE_FLASHCARDS_KEY,
          JSON.stringify(loadedFlashcards)
        );
        sessionStorage.setItem(
          SESSION_STORAGE_QUIZ_KEY,
          JSON.stringify(loadedQuizQuestions)
        );
      } catch {
        // Ignore storage access errors.
      }
      return true;
    } catch {
      // Keep the current document active if loading another one fails.
      return false;
    } finally {
      if (isCurrentRequest()) {
        setSelectingDocumentId(null);
      }
    }
  };

  const handleGenerateFlashcards = async (): Promise<boolean> => {
    if (!studyData || !documentId) {
      setFlashcardStatus('error');
      setFlashcardError(
        documentId
          ? 'No study notes available. Please upload a PDF first.'
          : 'No saved study document is selected. Please upload a PDF first.'
      );
      return false;
    }

    const authVersion = authVersionRef.current;
    setFlashcardStatus('loading');
    setFlashcardError(null);

    try {
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });

      if (authVersion !== authVersionRef.current) return false;

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
      if (authVersion !== authVersionRef.current) return false;
      setFlashcardStatus('error');
      setFlashcardError('Couldn\'t generate flashcards. Please check your connection and try again.');
      return false;
    }
  };

  const handleGenerateQuiz = async (): Promise<boolean> => {
    if (!studyData || !documentId) {
      setQuizStatus('error');
      setQuizError(
        documentId
          ? 'No study notes available. Please upload a PDF first.'
          : 'No saved study document is selected. Please upload a PDF first.'
      );
      return false;
    }

    const authVersion = authVersionRef.current;
    setQuizStatus('loading');
    setQuizError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });

      if (authVersion !== authVersionRef.current) return false;

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
      if (authVersion !== authVersionRef.current) return false;
      setQuizStatus('error');
      setQuizError('Couldn\'t generate your quiz. Please check your connection and try again.');
      return false;
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setStudyData(null);
    setPageCount(null);
    setDocumentId(null);
    setErrorMessage(null);
    setFlashcards(null);
    setFlashcardStatus('idle');
    setFlashcardError(null);
    setQuizQuestions(null);
    setQuizStatus('idle');
    setQuizError(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_DOCUMENT_ID_KEY);
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
        pageCount,
        errorMessage,
        documentId,
        savedDocuments,
        documentsLoading,
        selectingDocumentId,
        flashcards,
        flashcardStatus,
        flashcardError,
        quizQuestions,
        quizStatus,
        quizError,
        handleProcessPdf,
        handleGenerateFlashcards,
        handleGenerateQuiz,
        selectDocument,
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
