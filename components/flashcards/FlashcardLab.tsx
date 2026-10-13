'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard as FlashcardType, FlashcardDifficulty } from '@/types/flashcards';
import { Flashcard } from './Flashcard';
import { FlashcardControls } from './FlashcardControls';
import { FlashcardProgress } from './FlashcardProgress';
import { Layers, RotateCcw } from 'lucide-react';
import { PageDoodles } from '@/components/shared/PageDoodles';
import { ConfettiBurst } from '@/components/shared/ConfettiBurst';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface FlashcardLabProps {
  initialCards: FlashcardType[];
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export const FlashcardLab: React.FC<FlashcardLabProps> = ({
  initialCards,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [cards, setCards] = useState<FlashcardType[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [cardDifficulties, setCardDifficulties] = useState<Record<string, FlashcardDifficulty>>({});
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'previous'>('next');
  const [showConfetti, setShowConfetti] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  const currentCard = cards[currentIndex] || cards[0];

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setTransitionDirection('next');
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setTransitionDirection('previous');
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setTransitionDirection('next');
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const handleToggleMastered = useCallback(() => {
    if (!currentCard) return;
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
        if (cards.length > 0 && next.size === cards.length && !prefersReducedMotion) {
          setShowConfetti(true);
        }
      }
      return next;
    });
  }, [cards.length, currentCard, prefersReducedMotion]);

  const handleSetDifficulty = useCallback((diff: FlashcardDifficulty) => {
    if (!currentCard) return;
    setCardDifficulties((prev) => ({
      ...prev,
      [currentCard.id]: diff,
    }));
  }, [currentCard]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.closest('input, textarea, select, button, a, [contenteditable="true"]') ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, handleFlip]);

  if (!currentCard) return null;

  const isCurrentMastered = masteredIds.has(currentCard.id);
  const currentDifficulty = cardDifficulties[currentCard.id] || currentCard.difficulty || 'medium';

  return (
    <div className="study-page animate-in fade-in-50 duration-300">
      <PageDoodles />
      <header className="study-page__content flex flex-col justify-between gap-5 border-b border-card-border pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-label text-xs font-bold text-accent-strong">
            <Layers className="h-3.5 w-3.5" />
            Flashcards
          </div>
          <h1 className="study-page__title font-extrabold tracking-tight text-foreground">Flashcards</h1>
          <p className="study-page__subtitle mt-2 text-muted">
            Review each prompt, reveal the answer, and track the cards you have mastered.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-card-border bg-card px-4 py-2.5 text-sm font-bold text-foreground">
            Card {currentIndex + 1} / {cards.length}
          </span>
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/80 px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-raised disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Cards</span>
          </button>
        </div>
      </header>

      <FlashcardProgress
        currentIndex={currentIndex}
        totalCards={cards.length}
        masteredCount={masteredIds.size}
      />

      {masteredIds.size === cards.length && cards.length > 0 && (
        <div className="study-page__content flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-4 text-sm font-bold text-emerald-700 dark:text-emerald-300" role="status">
          <span>All cards mastered — you crushed it! {prefersReducedMotion ? '🎉 Take a victory lap!' : '🎉'}</span>
          {!prefersReducedMotion && showConfetti && (
            <ConfettiBurst onComplete={handleConfettiComplete} />
          )}
        </div>
      )}

      <Flashcard
        key={`${currentCard.id}-${currentIndex}`}
        card={currentCard}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        isMastered={isCurrentMastered}
        overrideDifficulty={currentDifficulty}
        transitionDirection={transitionDirection}
      />

      <div className="study-page__content">
        <FlashcardControls
          currentIndex={currentIndex}
          totalCards={cards.length}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onShuffle={handleShuffle}
          isMastered={isCurrentMastered}
          onToggleMastered={handleToggleMastered}
          currentDifficulty={currentDifficulty}
          onSetDifficulty={handleSetDifficulty}
        />
      </div>
    </div>
  );
};
