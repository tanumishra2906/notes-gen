'use client';

import React from 'react';
import { FlashcardDifficulty } from '@/types/flashcards';
import { Check, ChevronLeft, ChevronRight, Frown, Meh, Smile } from 'lucide-react';

interface FlashcardControlsProps {
  currentIndex: number;
  totalCards: number;
  masteredCount: number;
  masteredCardIds: Set<string>;
  cardIds: string[];
  isMastered: boolean;
  currentDifficulty: FlashcardDifficulty;
  onPrevious: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  onGotIt: () => void;
  onStillLearning: () => void;
  onToggleMastered: () => void;
  onSetDifficulty: (difficulty: FlashcardDifficulty) => void;
}

export const FlashcardControls: React.FC<FlashcardControlsProps> = ({
  currentIndex,
  totalCards,
  masteredCount,
  masteredCardIds,
  cardIds,
  isMastered,
  currentDifficulty,
  onPrevious,
  onNext,
  onJump,
  onGotIt,
  onStillLearning,
  onToggleMastered,
  onSetDifficulty,
}) => {
  const progress = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  return (
    <section aria-label="Flashcard study controls" className="space-y-4 rounded-2xl border border-card-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentIndex <= 0}
          aria-label="Previous card"
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Prev
        </button>
        <span className="text-sm font-bold text-foreground">
          Card {totalCards > 0 ? currentIndex + 1 : 0} / {totalCards} of the filtered deck
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next card"
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onStillLearning}
          aria-pressed={!isMastered}
          className={`rounded-xl border px-4 py-2.5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
            !isMastered
              ? 'border-accent/40 bg-accent/10 text-foreground'
              : 'border-card-border text-muted hover:bg-surface-raised'
          }`}
        >
          Still learning
        </button>
        <button
          type="button"
          onClick={onGotIt}
          aria-pressed={isMastered}
          className="rounded-xl border border-emerald-600/25 bg-emerald-600/10 px-4 py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-600/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-300"
        >
          Got it
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-card-border pt-4">
        <button
          type="button"
          onClick={onToggleMastered}
          aria-pressed={isMastered}
          className={`rounded-lg border px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
            isMastered
              ? 'border-emerald-600/30 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300'
              : 'border-card-border text-muted hover:bg-surface-raised'
          }`}
        >
          {isMastered ? 'Mastered' : 'Mark Mastered'}
        </button>

        <div className="flex items-center gap-1" role="group" aria-label="Set card difficulty">
          <span className="mr-1 text-xs font-semibold text-muted">Difficulty</span>
          {([
            ['easy', 'Easy', Smile],
            ['medium', 'Medium', Meh],
            ['hard', 'Hard', Frown],
          ] as const).map(([difficulty, label, Icon]) => (
            <button
              key={difficulty}
              type="button"
              onClick={() => onSetDifficulty(difficulty)}
              aria-label={`Set difficulty to ${label}`}
              aria-pressed={currentDifficulty === difficulty}
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
                currentDifficulty === difficulty
                  ? 'border-accent/40 bg-accent/15 text-foreground'
                  : 'border-transparent text-muted hover:bg-surface-raised'
              }`}
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 border-t border-card-border pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-muted">Deck progress</span>
          <span className="font-bold text-foreground">
            {masteredCount} / {totalCards} mastered · {progress}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-surface-raised"
          role="progressbar"
          aria-label="Mastered cards"
          aria-valuenow={masteredCount}
          aria-valuemin={0}
          aria-valuemax={totalCards}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-2" aria-label="Jump to card">
          {cardIds.map((id, index) => {
            const isCurrent = index === currentIndex;
            const isDone = masteredCardIds.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onJump(index)}
                aria-label={`Go to card ${index + 1}${isDone ? ', mastered' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                className={`inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-full border px-2.5 text-xs font-bold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
                  isCurrent
                    ? 'scale-110 border-accent bg-accent text-zinc-950'
                    : isDone
                      ? 'border-emerald-600/30 bg-emerald-600/10 text-emerald-800 dark:text-emerald-300'
                      : 'border-[#F2E2A0] bg-[#FFF7D1] text-stone-800 hover:scale-105'
                }`}
              >
                {isDone && <Check aria-hidden="true" className="h-3 w-3" />}
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
