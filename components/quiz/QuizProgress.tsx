'use client';

import React from 'react';
import { CheckCircle2, Target, XCircle } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';

interface QuizProgressProps {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  totalQuestions,
  correctCount,
  incorrectCount,
}) => {
  const answeredTotal = correctCount + incorrectCount;
  const accuracy = answeredTotal > 0 ? Math.round((correctCount / answeredTotal) * 100) : 0;
  const circumference = 2 * Math.PI * 42;
  const reducedMotion = usePrefersReducedMotion();
  const animatedAccuracy = useAnimatedNumber(accuracy, {
    duration: 450,
    reducedMotion,
  });

  if (totalQuestions === 0) return null;

  return (
    <aside className="h-fit rounded-2xl border border-card-border bg-surface p-5 lg:sticky lg:top-28">
      <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
        <Target aria-hidden="true" className="h-4 w-4 text-accent-strong" />
        Live performance
      </h2>

      <div className="mt-5 flex flex-col items-center text-center">
        <div className="relative h-36 w-36" role="img" aria-label={`Accuracy ${accuracy}%`}>
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--card-border)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - accuracy / 100)}
              className="transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {animatedAccuracy}%
            </span>
            <span className="text-xs font-medium text-muted">accuracy</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-bold text-foreground">
          {correctCount} / {answeredTotal} correct
        </p>
        <p className="mt-1 text-xs text-muted">
          Answered {answeredTotal} of {totalQuestions}
        </p>
      </div>

      <div className="mt-5 space-y-2 border-t border-card-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-500" />
            Correct
          </span>
          <span className="font-bold text-foreground">{correctCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted">
            <XCircle aria-hidden="true" className="h-4 w-4 text-rose-500" />
            Incorrect
          </span>
          <span className="font-bold text-foreground">{incorrectCount}</span>
        </div>
      </div>
    </aside>
  );
};
