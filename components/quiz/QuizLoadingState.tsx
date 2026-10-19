'use client';

import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const QuizLoadingState: React.FC = () => {
  return (
    <div className="mx-auto my-8 w-full max-w-2xl space-y-6 rounded-2xl border border-card-border bg-surface p-8 text-center sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent-strong">
        <BrainCircuit aria-hidden="true" className="h-8 w-8 stroke-[2]" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Gemini AI Processing</span>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Creating your quiz...
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          You&apos;ll be testing yourself in just a moment. Generating multiple-choice questions from your study materials.
        </p>
      </div>

      <div className="w-full space-y-3 rounded-2xl border border-card-border bg-surface-raised p-4">
        <div className="mx-auto mb-4 h-5 w-3/4 rounded-full bg-card-border" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex h-12 w-full items-center rounded-xl border border-card-border bg-surface px-4"
          >
            <div className="mr-3 h-6 w-6 rounded-lg bg-card-border" />
            <div className="h-3 w-1/2 rounded-full bg-card-border" />
          </div>
        ))}
      </div>
    </div>
  );
};
