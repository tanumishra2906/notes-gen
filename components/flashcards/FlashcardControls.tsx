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
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Primary Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-md">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            isFirst
              ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer active:scale-95'
          }`}
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Center Flip CTA */}
        <button
          onClick={onFlip}
          className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 shadow-md shadow-yellow-500/20 transition-all duration-200 active:scale-95 cursor-pointer"
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
              ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer active:scale-95'
          }`}
          aria-label="Next card"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Secondary Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm text-xs">
        {/* Left: Shuffle & Mastered */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
            title="Shuffle cards order"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-500" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={onToggleMastered}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              isMastered
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
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
