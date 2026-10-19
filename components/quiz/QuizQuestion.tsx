'use client';

import React from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
}) => {
  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case 'easy':
        return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
      case 'medium':
        return 'border-accent/30 bg-accent/10 text-accent-strong';
      case 'hard':
        return 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300';
      default:
        return 'border-card-border bg-surface-raised text-muted';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Category & Topic Header */}
      <div className="flex flex-wrap items-center gap-2">
        {question.topic && (
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
            {question.topic}
          </span>
        )}
        {question.difficulty && (
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${getDifficultyBadge(
              question.difficulty
            )}`}
          >
            {question.difficulty}
          </span>
        )}
        <span className="sr-only">Question {questionNumber} of {totalQuestions}</span>
      </div>

      {/* Main Question Text */}
      <h2 className="max-w-5xl text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-[1.16] tracking-tight text-foreground">
        {question.question}
      </h2>
    </div>
  );
};
