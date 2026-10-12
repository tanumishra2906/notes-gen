'use client';

import React from 'react';
import { FlashcardDifficulty } from '@/types/flashcards';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';

interface FlashcardControlsProps {
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  onFlip: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  isMastered: boolean;
  onToggleMastered: () => void;
  currentDifficulty: FlashcardDifficulty;
  onSetDifficulty: (diff: FlashcardDifficulty) => void;
}

export const FlashcardControls: React.FC<FlashcardControlsProps> = ({
  currentIndex,
  totalCards,
  isFlipped,
  onFlip,
  onPrevious,
  onNext,
  onShuffle,
  isMastered,
  onToggleMastered,
  currentDifficulty,
  onSetDifficulty,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCards - 1;

  return (
    <div className="w-full space-y-4">
      {/* Primary Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-2 rounded-3xl border border-card-border bg-card p-3 shadow-md sm:p-4">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            isFirst
              ? 'cursor-not-allowed opacity-40 text-muted'
              : 'cursor-pointer text-foreground hover:bg-surface active:scale-95'
          }`}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Center Flip CTA */}
        <button
          onClick={onFlip}
          className="flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-xs font-bold text-zinc-950 shadow-md shadow-amber-900/10 transition-colors duration-200 hover:bg-accent-hover active:scale-95 sm:px-8 sm:text-sm"
        >
          <RotateCw className={`w-4 h-4 stroke-[2.5] ${isFlipped ? 'rotate-180' : ''}`} />
          <span>{isFlipped ? 'Show Question' : 'Flip Card'}</span>
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={isLast}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            isLast
              ? 'cursor-not-allowed opacity-40 text-muted'
              : 'cursor-pointer text-foreground hover:bg-surface active:scale-95'
          }`}
          aria-label="Next card"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Secondary Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-card-border bg-surface/75 px-4 py-3 text-xs">
        {/* Left: Shuffle & Mastered */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShuffle}
            className="flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 font-bold text-muted transition-all hover:border-card-border hover:bg-surface-raised cursor-pointer"
            title="Shuffle cards order"
          >
            <Shuffle className="w-3.5 h-3.5 text-accent-purple" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={onToggleMastered}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              isMastered
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-muted hover:bg-surface-raised border border-transparent hover:border-card-border'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
          </button>
        </div>

        {/* Right: Difficulty Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
            Difficulty:
          </span>
          <button
            onClick={() => onSetDifficulty('easy')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
              currentDifficulty === 'easy'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Easy</span>
          </button>

          <button
            onClick={() => onSetDifficulty('medium')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
              currentDifficulty === 'medium'
                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
                : 'text-slate-500 hover:text-yellow-500 hover:bg-yellow-500/10'
            }`}
          >
            <Meh className="w-3.5 h-3.5" />
            <span>Med</span>
          </button>

          <button
            onClick={() => onSetDifficulty('hard')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
              currentDifficulty === 'hard'
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                : 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10'
            }`}
          >
            <Frown className="w-3.5 h-3.5" />
            <span>Hard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
