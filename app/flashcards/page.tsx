'use client';

import React from 'react';
import { useStudy } from '@/context/StudyContext';
import { FlashcardLab } from '@/components/flashcards/FlashcardLab';
import { FlashcardEmptyState } from '@/components/flashcards/FlashcardEmptyState';
import { FlashcardLoadingState } from '@/components/flashcards/FlashcardLoadingState';
import { FlashcardBackdrop } from '@/components/flashcards/FlashcardBackdrop';
import { ErrorAlert } from '@/components/shared/ErrorAlert';

export default function FlashcardsPage() {
  const {
    studyData,
    documentId,
    savedDocuments,
    flashcards,
    flashcardStatus,
    flashcardError,
    handleGenerateFlashcards,
  } = useStudy();

  const isGenerating = flashcardStatus === 'loading';
  const documentTitle = savedDocuments.find((document) => document.id === documentId)?.title;

  return (
    <div className="relative isolate mx-auto w-full max-w-6xl py-6 sm:py-8">
      <FlashcardBackdrop />
      <div className="relative z-10">
        {isGenerating ? (
          <FlashcardLoadingState />
        ) : flashcardStatus === 'error' ? (
          <div className="mx-auto max-w-2xl space-y-6">
            <ErrorAlert
              message={flashcardError || "Couldn't generate flashcards. Please try again."}
              onRetry={handleGenerateFlashcards}
            />
            <FlashcardEmptyState
              hasNotes={Boolean(studyData)}
              onGenerate={handleGenerateFlashcards}
              isLoading={isGenerating}
            />
          </div>
        ) : flashcards && flashcards.length > 0 ? (
          <FlashcardLab
            initialCards={flashcards}
            documentTitle={documentTitle}
            onRegenerate={handleGenerateFlashcards}
            isRegenerating={isGenerating}
          />
        ) : (
          <FlashcardEmptyState
            hasNotes={Boolean(studyData)}
            onGenerate={handleGenerateFlashcards}
            isLoading={isGenerating}
          />
        )}
      </div>
    </div>
  );
}
