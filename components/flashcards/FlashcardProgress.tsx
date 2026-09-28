'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

interface FlashcardProgressProps {
  currentIndex: number;
  totalCards: number;
  masteredCount: number;
}

export const FlashcardProgress: React.FC<FlashcardProgressProps> = ({
  currentIndex,
  totalCards,
  masteredCount,
}) => {
  if (totalCards === 0) return null;

  const currentCardNumber = currentIndex + 1;
  const progressPercent = Math.round((currentCardNumber / totalCards) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      {/* Label Row */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-900 dark:text-white font-extrabold text-base">
            Card {currentCardNumber}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            / {totalCards}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs">
          <Trophy className="w-3.5 h-3.5" />
          <span>
            {masteredCount} of {totalCards} Mastered
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
