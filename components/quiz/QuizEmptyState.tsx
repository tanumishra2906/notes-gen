'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Upload, ArrowRight } from 'lucide-react';

interface QuizEmptyStateProps {
  hasNotes: boolean;
  onGenerate: () => void;
  isLoading?: boolean;
}

export const QuizEmptyState: React.FC<QuizEmptyStateProps> = ({
  hasNotes,
  onGenerate,
  isLoading = false,
}) => {
  return (
    <div className="mx-auto my-8 w-full max-w-2xl space-y-6 rounded-2xl border border-card-border bg-surface p-8 text-center sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent-strong">
        <BrainCircuit aria-hidden="true" className="h-8 w-8 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Interactive Quiz Mode</span>
        </span>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          {hasNotes ? 'Ready to test yourself?' : 'Your quiz will appear here.'}
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          {hasNotes
            ? 'Generate an interactive multiple-choice quiz based directly on your uploaded study materials.'
            : 'Upload a PDF to generate a quiz from your study materials.'}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
        {hasNotes ? (
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-50 sm:w-auto"
          >
            <BrainCircuit aria-hidden="true" className="h-4 w-4 stroke-[2.5]" />
            <span>Generate Quiz</span>
          </button>
        ) : (
          <Link
            href="/upload"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong sm:w-auto"
          >
            <Upload aria-hidden="true" className="h-4 w-4 stroke-[2.5]" />
            <span>Upload Notes First</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4 stroke-[2.5]" />
          </Link>
        )}
      </div>
    </div>
  );
};
