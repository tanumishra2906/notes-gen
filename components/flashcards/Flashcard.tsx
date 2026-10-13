'use client';

import React from 'react';
import { Flashcard as FlashcardType, FlashcardDifficulty } from '@/types/flashcards';
import { CheckCircle2, RotateCw, Sparkles } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  isMastered?: boolean;
  overrideDifficulty?: FlashcardDifficulty;
  transitionDirection?: 'next' | 'previous';
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  isMastered = false,
  overrideDifficulty,
  transitionDirection = 'next',
}) => {
  const difficulty = overrideDifficulty || card.difficulty || 'medium';

  const getDifficultyBadge = (diff: FlashcardDifficulty) => {
    switch (diff) {
      case 'easy':
        return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'medium':
        return 'border-accent/25 bg-accent/10 text-accent-strong';
      case 'hard':
        return 'border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400';
      default:
        return 'border-card-border bg-surface text-muted';
    }
  };

  return (
    <div className={`study-page__content flashcard-scene card-swap-${transitionDirection}`}>
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? 'Flip card to show the question' : 'Flip card to reveal the answer'}
        className="flashcard-flip-trigger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
      >
        <span className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
          <span className="flashcard-face flashcard-face--front">
            <span className="flex flex-wrap items-center justify-between gap-3">
              <span className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-label text-xs font-bold text-accent-strong">
                  {card.topic || 'General'}
                </span>
                <span className={`rounded-full border px-3 py-1 font-label text-xs font-bold capitalize ${getDifficultyBadge(difficulty)}`}>
                  {difficulty}
                </span>
              </span>
              {isMastered && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Mastered
                </span>
              )}
            </span>
            <span className="my-auto flex flex-col items-center py-10 text-center">
              <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-accent-strong">
                Question
              </span>
              <span className="mt-6 max-w-3xl text-[clamp(1.5rem,3.1vw,3.25rem)] font-extrabold leading-tight tracking-tight text-foreground">
                {card.question}
              </span>
            </span>
            <span className="flex items-center justify-center gap-2 border-t border-card-border pt-5 text-sm font-semibold text-muted">
              <RotateCw className="h-4 w-4 text-accent-strong" />
              Click or press Flip Card to reveal
            </span>
          </span>

          <span className="flashcard-face flashcard-face--back">
            <span className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-accent-purple/25 bg-accent-purple/10 px-3 py-1 font-label text-xs font-bold text-accent-purple">
                Answer
              </span>
              {isMastered && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Mastered
                </span>
              )}
            </span>
            <span className="my-auto flex min-h-48 flex-col items-center justify-center py-10 text-center">
              <Sparkles className="h-7 w-7 text-accent-purple" />
              <span className="mt-5 max-w-3xl text-[clamp(1.2rem,2.4vw,2.25rem)] font-semibold leading-relaxed text-foreground">
                {card.answer}
              </span>
            </span>
            <span className="flex items-center justify-center gap-2 border-t border-card-border pt-5 text-sm font-semibold text-muted">
              Click or press Flip Card to hide the answer
            </span>
          </span>
        </span>
      </button>
    </div>
  );
};
