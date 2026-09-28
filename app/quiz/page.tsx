'use client';

import React from 'react';
import { useStudy } from '@/context/StudyContext';
import { QuizLab } from '@/components/quiz/QuizLab';
import { QuizEmptyState } from '@/components/quiz/QuizEmptyState';
import { QuizLoadingState } from '@/components/quiz/QuizLoadingState';
import { ErrorAlert } from '@/components/shared/ErrorAlert';

export default function QuizPage() {
  const {
    studyData,
    quizQuestions,
    quizStatus,
    quizError,
    handleGenerateQuiz,
  } = useStudy();

  const isGenerating = quizStatus === 'loading';

  if (isGenerating) {
    return <QuizLoadingState />;
  }

  if (quizStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
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
    );
  }

  if (quizQuestions && quizQuestions.length > 0) {
    return (
      <QuizLab
        initialQuestions={quizQuestions}
        onRegenerate={handleGenerateQuiz}
        isRegenerating={isGenerating}
      />
    );
  }

  return (
    <QuizEmptyState
      hasNotes={Boolean(studyData)}
      onGenerate={handleGenerateQuiz}
      isLoading={isGenerating}
    />
  );
}
