'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Sparkles, Upload, ArrowRight } from 'lucide-react';

interface FlashcardEmptyStateProps {
  hasNotes: boolean;
  onGenerate: () => void;
  isLoading?: boolean;
}

export const FlashcardEmptyState: React.FC<FlashcardEmptyStateProps> = ({
  hasNotes,
  onGenerate,
  isLoading = false,
}) => {
  return (
    <div className="flashcard-empty-enter mx-auto my-8 w-full max-w-2xl space-y-6 rounded-2xl border border-card-border bg-surface p-8 text-center sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent-strong">
        <Layers className="w-8 h-8 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-foreground">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Study Mode</span>
        </span>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Your flashcards will appear here.
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          {hasNotes
            ? 'Turn your generated study notes into interactive flashcards for focused review.'
            : 'Upload a PDF to create notes first, then turn those notes into flashcards.'}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        {hasNotes ? (
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Generate Flashcards</span>
          </button>
        ) : (
          <Link
            href="/upload"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong sm:w-auto"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Notes First</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        )}
      </div>
      <style jsx>{`
        .flashcard-empty-enter {
          animation: flashcard-empty-fade-up 400ms ease-out both;
        }
        @keyframes flashcard-empty-fade-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flashcard-empty-enter {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
