'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard as FlashcardType, FlashcardDifficulty } from '@/types/flashcards';
import { Flashcard } from './Flashcard';
import { FlashcardControls } from './FlashcardControls';
import { FlashcardProgress } from './FlashcardProgress';
import { Layers, RotateCcw, Sparkles } from 'lucide-react';

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

  // Sync cards when initialCards changes
  useEffect(() => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [initialCards]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
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
      }
      return next;
    });
  }, [currentCard]);

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
      // Don't intercept keyboard shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

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
    <div className="w-full space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-amber-700 dark:text-yellow-400 border border-yellow-400/20 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Spaced Repetition</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Flashcard Lab
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generated from your uploaded study material. Flip cards to test your retention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Cards</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Counters */}
      <FlashcardProgress
        currentIndex={currentIndex}
        totalCards={cards.length}
        masteredCount={masteredIds.size}
      />

      {/* The Flashcard View */}
      <div className="py-2">
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          isMastered={isCurrentMastered}
          overrideDifficulty={currentDifficulty}
        />
      </div>

      {/* Interaction Controls Toolbar */}
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
  );
};
