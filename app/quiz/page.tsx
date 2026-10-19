'use client';

import React from 'react';
import { useStudy } from '@/context/StudyContext';
import { QuizLab } from '@/components/quiz/QuizLab';
import { QuizEmptyState } from '@/components/quiz/QuizEmptyState';
import { QuizLoadingState } from '@/components/quiz/QuizLoadingState';
import { QuizBackdrop } from '@/components/quiz/QuizBackdrop';
import { ErrorAlert } from '@/components/shared/ErrorAlert';

export default function QuizPage() {
  const {
    studyData,
    documentId,
    savedDocuments,
    quizQuestions,
    quizStatus,
    quizError,
    handleGenerateQuiz,
  } = useStudy();

  const isGenerating = quizStatus === 'loading';
  const documentTitle = savedDocuments.find((document) => document.id === documentId)?.title;

  return (
    <div className="relative isolate mx-auto w-full max-w-6xl py-6 sm:py-8">
      <QuizBackdrop />
      <div className="relative z-10">
        {isGenerating ? (
          <QuizLoadingState />
        ) : quizStatus === 'error' ? (
          <div className="mx-auto max-w-2xl space-y-6 py-4">
            <ErrorAlert
              message={quizError || "Couldn't generate your quiz. Please try again."}
              onRetry={handleGenerateQuiz}
            />
            <QuizEmptyState
              hasNotes={Boolean(studyData)}
              onGenerate={handleGenerateQuiz}
              isLoading={isGenerating}
            />
          </div>
        ) : quizQuestions && quizQuestions.length > 0 ? (
          <QuizLab
            initialQuestions={quizQuestions}
            documentTitle={documentTitle}
            onRegenerate={handleGenerateQuiz}
            isRegenerating={isGenerating}
          />
        ) : (
          <QuizEmptyState
            hasNotes={Boolean(studyData)}
            onGenerate={handleGenerateQuiz}
            isLoading={isGenerating}
          />
        )}
      </div>
    </div>
  );
}
