'use client';

import React from 'react';
import { useStudy } from '@/context/StudyContext';
import { FlashcardLab } from '@/components/flashcards/FlashcardLab';
import { FlashcardEmptyState } from '@/components/flashcards/FlashcardEmptyState';
import { FlashcardLoadingState } from '@/components/flashcards/FlashcardLoadingState';
import { ErrorAlert } from '@/components/shared/ErrorAlert';

export default function FlashcardsPage() {
  const {
    studyData,
    flashcards,
    flashcardStatus,
    flashcardError,
    handleGenerateFlashcards,
  } = useStudy();

  const isGenerating = flashcardStatus === 'loading';

  if (isGenerating) {
    return <FlashcardLoadingState />;
  }

  if (flashcardStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
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
    );
  }

  if (flashcards && flashcards.length > 0) {
    return (
      <FlashcardLab
        initialCards={flashcards}
        onRegenerate={handleGenerateFlashcards}
        isRegenerating={isGenerating}
      />
    );
  }

  return (
    <FlashcardEmptyState
      hasNotes={Boolean(studyData)}
      onGenerate={handleGenerateFlashcards}
      isLoading={isGenerating}
    />
  );
}
