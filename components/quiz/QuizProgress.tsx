'use client';

import React from 'react';
import { Trophy, CheckCircle2, XCircle, Target } from 'lucide-react';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  correctCount,
  incorrectCount,
}) => {
  if (totalQuestions === 0) return null;

  const currentStep = currentIndex + 1;
  const progressPercent = Math.round((currentStep / totalQuestions) * 100);
  const answeredTotal = correctCount + incorrectCount;
  const accuracy = answeredTotal > 0 ? Math.round((correctCount / answeredTotal) * 100) : 0;

  return (
    <div className="w-full space-y-4">
      {/* Top Question Progress Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-900 dark:text-white font-extrabold text-base">
            Question {currentStep}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            / {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 text-amber-700 dark:text-yellow-400 border border-yellow-400/20 text-xs">
          <Target className="w-3.5 h-3.5" />
          <span>Accuracy: {accuracy}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-center">
        <div className="flex flex-col items-center justify-center p-1.5">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Correct</span>
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {correctCount}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-1.5 border-x border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-0.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Incorrect</span>
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {incorrectCount}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-1.5">
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-semibold mb-0.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Accuracy</span>
          </div>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {accuracy}%
          </span>
        </div>
      </div>
    </div>
  );
};
