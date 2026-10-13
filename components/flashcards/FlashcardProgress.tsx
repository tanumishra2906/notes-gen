'use client';

import React from 'react';

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
  const reviewCount = Math.max(0, totalCards - masteredCount);

  return (
    <div className="study-page__content w-full space-y-3 rounded-2xl border border-card-border bg-card/75 px-5 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-bold text-foreground">
          {totalCards} cards total <span className="px-1 text-muted">·</span>
          {masteredCount} mastered <span className="px-1 text-muted">·</span>
          {reviewCount} to review
        </span>
        <span className="text-xs font-semibold text-muted">Study progress</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-card-border"
        role="progressbar"
        aria-label="Study progress"
        aria-valuenow={currentCardNumber}
        aria-valuemin={1}
        aria-valuemax={totalCards}
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
