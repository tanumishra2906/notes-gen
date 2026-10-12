'use client';

import React from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { Sparkles } from 'lucide-react';

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
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'hard':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Category & Topic Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{question.topic || 'General'}</span>
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getDifficultyBadge(
              question.difficulty
            )}`}
          >
            {question.difficulty || 'medium'}
          </span>
        </div>

        <span className="sr-only">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      {/* Main Question Text */}
      <h2 className="max-w-5xl text-[clamp(1.6rem,3.2vw,3.25rem)] font-extrabold leading-[1.16] tracking-tight text-foreground">
        {question.question}
      </h2>
    </div>
  );
};
