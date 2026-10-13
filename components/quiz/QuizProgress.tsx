'use client';

import React from 'react';
import { CheckCircle2, Target, XCircle } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';

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
  const currentStep = currentIndex + 1;
  const progressPercent = totalQuestions > 0
    ? Math.round((currentStep / totalQuestions) * 100)
    : 0;
  const answeredTotal = correctCount + incorrectCount;
  const accuracy = answeredTotal > 0 ? Math.round((correctCount / answeredTotal) * 100) : 0;
  const circumference = 2 * Math.PI * 42;
  const reducedMotion = usePrefersReducedMotion();
  const animatedCurrentStep = useAnimatedNumber(currentStep, { reducedMotion });
  const animatedCorrectCount = useAnimatedNumber(correctCount, { reducedMotion });
  const animatedIncorrectCount = useAnimatedNumber(incorrectCount, { reducedMotion });
  const animatedAccuracy = useAnimatedNumber(accuracy, { reducedMotion });

  if (totalQuestions === 0) return null;

  return (
    <aside className="h-fit rounded-[2rem] border border-card-border bg-card p-6 shadow-lg shadow-black/5 lg:sticky lg:top-28 lg:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-44 w-44 items-center justify-center">
          <div key={currentStep} className="quiz-ring-pop absolute inset-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--card-border)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progressPercent / 100)}
              />
            </svg>
          </div>
          <div>
            <span className="block text-4xl font-extrabold tracking-tight text-foreground">
              {animatedCurrentStep}/{totalQuestions}
            </span>
            <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Progress
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 border-t border-card-border pt-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
          <Target className="h-4 w-4 text-accent-strong" />
          Your progress
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-surface/80 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-muted">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Correct Answers
            </span>
            <span className="text-lg font-extrabold text-foreground">{animatedCorrectCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-surface/80 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-muted">
              <XCircle className="h-4 w-4 text-rose-500" />
              Incorrect
            </span>
            <span className="text-lg font-extrabold text-foreground">{animatedIncorrectCount}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-surface/80 px-4 py-3">
            <span className="text-sm font-medium text-muted">Accuracy</span>
            <span className="text-lg font-extrabold text-foreground">{animatedAccuracy}%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
