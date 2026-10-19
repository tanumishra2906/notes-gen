'use client';

import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const FlashcardLoadingState: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="mx-auto my-8 w-full max-w-2xl space-y-6 rounded-2xl border border-card-border bg-surface p-8 text-center sm:p-12"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent-strong">
        <BrainCircuit className="w-8 h-8 stroke-[2]" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-foreground">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Processing</span>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Creating your flashcards...
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          Extracting key definitions, concepts, and formulas from your study material into structured flashcards.
        </p>
      </div>

      <div className="flex h-48 w-full flex-col items-center justify-center space-y-3 rounded-2xl border border-card-border bg-surface-raised p-6">
        <div className="h-4 w-3/4 rounded-full bg-card-border" />
        <div className="h-4 w-1/2 rounded-full bg-card-border" />
        <div className="mt-2 h-3 w-1/4 rounded-full bg-accent/30" />
      </div>
    </div>
  );
};
