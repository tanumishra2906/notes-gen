'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Flashcard as FlashcardType, FlashcardDifficulty } from '@/types/flashcards';
import { Flashcard } from './Flashcard';
import { FlashcardControls } from './FlashcardControls';
import { Confetti } from '@/components/shared/Confetti';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  Expand,
  HelpCircle,
  ListFilter,
  RotateCcw,
  Shuffle,
  Star,
  X,
} from 'lucide-react';

interface FlashcardLabProps {
  initialCards: FlashcardType[];
  documentTitle?: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

type ViewMode = 'flip' | 'dual';

const subscribeToSupport = () => () => {};
const supportsSpeech = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  'SpeechSynthesisUtterance' in window;
const supportsFullscreen = () =>
  typeof document !== 'undefined' &&
  Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);

export const FlashcardLab: React.FC<FlashcardLabProps> = ({
  initialCards,
  documentTitle,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [cards, setCards] = useState<FlashcardType[]>(initialCards);
  const [currentIndexState, setCurrentIndexState] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [cardDifficulties, setCardDifficulties] = useState<
    Record<string, FlashcardDifficulty>
  >({});
  const [viewMode, setViewMode] = useState<ViewMode>('flip');
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [unmasteredOnly, setUnmasteredOnly] = useState(false);
  const [answerFirst, setAnswerFirst] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const speechSupported = useSyncExternalStore(subscribeToSupport, supportsSpeech, () => false);
  const canFullscreen = useSyncExternalStore(
    subscribeToSupport,
    supportsFullscreen,
    () => false
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const helpTriggerRef = useRef<HTMLButtonElement>(null);
  const helpPopoverRef = useRef<HTMLDivElement>(null);
  const confettiStartedRef = useRef(false);
  const currentIndex = Math.min(currentIndexState, cards.length);

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        if (starredOnly && !starredIds.has(card.id)) return false;
        if (unmasteredOnly && masteredIds.has(card.id)) return false;
        return true;
      }),
    [cards, masteredIds, starredIds, starredOnly, unmasteredOnly]
  );

  const displayIndex = Math.min(currentIndex, filteredCards.length);
  const currentCard = filteredCards[displayIndex];
  const currentCardId = currentCard?.id;
  const masteredCount = masteredIds.size;
  const allMastered = cards.length > 0 && masteredCount === cards.length;
  const atEnd = !currentCard;
  const visualFlipped = isFlipped !== answerFirst;
  const currentDifficulty = currentCard
    ? cardDifficulties[currentCard.id] || currentCard.difficulty || 'medium'
    : 'medium';

  useEffect(() => {
    const timer = window.setInterval(() => setSessionSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentCardId || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    return () => window.speechSynthesis.cancel();
  }, [currentCardId]);

  const handleFlip = useCallback(() => {
    if (viewMode === 'dual') {
      setAnswerRevealed((current) => !current);
    } else {
      setIsFlipped((current) => !current);
    }
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setAnswerRevealed(false);
    const nextIndex = displayIndex + 1;
    setCurrentIndexState(Math.min(nextIndex, filteredCards.length));
    if (
      nextIndex >= filteredCards.length &&
      allMastered &&
      !prefersReducedMotion &&
      !confettiStartedRef.current
    ) {
      confettiStartedRef.current = true;
      setShowConfetti(true);
    }
  }, [allMastered, displayIndex, filteredCards.length, prefersReducedMotion]);

  const handlePrevious = useCallback(() => {
    setCurrentIndexState((index) => Math.max(0, Math.min(index, filteredCards.length) - 1));
    setIsFlipped(false);
    setAnswerRevealed(false);
  }, [filteredCards.length]);

  const handleToggleMastered = useCallback(() => {
    if (!currentCard) return;
    const nextMastered = new Set(masteredIds);
    if (nextMastered.has(currentCard.id)) nextMastered.delete(currentCard.id);
    else nextMastered.add(currentCard.id);
    setMasteredIds(nextMastered);
    if (nextMastered.size === cards.length) {
      setCurrentIndexState(filteredCards.length);
      if (!prefersReducedMotion && !confettiStartedRef.current) {
        confettiStartedRef.current = true;
        setShowConfetti(true);
      }
    }
    if (unmasteredOnly) {
      setIsFlipped(false);
      setAnswerRevealed(false);
    }
  }, [
    cards.length,
    currentCard,
    filteredCards.length,
    masteredIds,
    prefersReducedMotion,
    unmasteredOnly,
  ]);

  const handleSelfCheck = useCallback(
    (mastered: boolean) => {
      if (!currentCard) return;
      const nextMastered = new Set(masteredIds);
      if (mastered) nextMastered.add(currentCard.id);
      else nextMastered.delete(currentCard.id);
      setMasteredIds(nextMastered);
      setIsFlipped(false);
      setAnswerRevealed(false);
      const hasMasteredAll = nextMastered.size === cards.length;
      const nextIndex = hasMasteredAll
        ? filteredCards.length
        : unmasteredOnly && mastered
          ? displayIndex
          : displayIndex + 1;
      setCurrentIndexState(Math.min(nextIndex, filteredCards.length));
      if (
        hasMasteredAll &&
        !prefersReducedMotion &&
        !confettiStartedRef.current
      ) {
        confettiStartedRef.current = true;
        setShowConfetti(true);
      }
    },
    [
      cards.length,
      currentCard,
      displayIndex,
      filteredCards.length,
      masteredIds,
      prefersReducedMotion,
      unmasteredOnly,
    ]
  );

  const handleShuffle = useCallback(() => {
    const shuffled = [...cards];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const otherIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
    }
    setCards(shuffled);
    setCurrentIndexState(0);
    setIsFlipped(false);
    setAnswerRevealed(false);
  }, [cards]);

  const handleSetDifficulty = useCallback(
    (difficulty: FlashcardDifficulty) => {
      if (!currentCard) return;
      setCardDifficulties((current) => ({ ...current, [currentCard.id]: difficulty }));
    },
    [currentCard]
  );

  const handleToggleStar = useCallback(() => {
    if (!currentCard) return;
    setStarredIds((current) => {
      const next = new Set(current);
      if (next.has(currentCard.id)) next.delete(currentCard.id);
      else next.add(currentCard.id);
      return next;
    });
    setIsFlipped(false);
    setAnswerRevealed(false);
  }, [currentCard]);

  const resetDeck = useCallback(
    (shuffle: boolean) => {
      const resetCards = [...cards];
      if (shuffle) {
        for (let index = resetCards.length - 1; index > 0; index -= 1) {
          const otherIndex = Math.floor(Math.random() * (index + 1));
          [resetCards[index], resetCards[otherIndex]] = [
            resetCards[otherIndex],
            resetCards[index],
          ];
        }
      }
      setCards(resetCards);
      setMasteredIds(new Set());
      setStarredOnly(false);
      setUnmasteredOnly(false);
      setCurrentIndexState(0);
      setIsFlipped(false);
      setAnswerRevealed(false);
      setShowConfetti(false);
      confettiStartedRef.current = false;
    },
    [cards]
  );

  const handleJump = (index: number) => {
    setCurrentIndexState(index);
    setIsFlipped(false);
    setAnswerRevealed(false);
  };

  const handleListen = (text: string) => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const openHelp = () => {
    setHelpOpen(true);
    window.requestAnimationFrame(() => {
      helpPopoverRef.current?.querySelector<HTMLElement>('button')?.focus();
    });
  };

  const closeHelp = () => {
    setHelpOpen(false);
    helpTriggerRef.current?.focus();
  };

  const handleHelpKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeHelp();
      return;
    }
    if (event.key !== 'Tab' || !helpPopoverRef.current) return;
    const focusable = Array.from(
      helpPopoverRef.current.querySelectorAll<HTMLElement>('button:not(:disabled)')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (helpOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeHelp();
        }
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.closest('input, textarea, select, button, a, [contenteditable="true"]') ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        handleFlip();
      } else if (event.key.toLowerCase() === 'm') {
        handleToggleMastered();
      } else if (event.key.toLowerCase() === 's') {
        handleToggleStar();
      } else if (event.key === '?') {
        openHelp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrevious, handleToggleMastered, handleToggleStar, helpOpen]);

  useEffect(
    () => () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    []
  );

  const elapsed = `${String(Math.floor(sessionSeconds / 60)).padStart(2, '0')}:${String(
    sessionSeconds % 60
  ).padStart(2, '0')}`;
  return (
    <div className="relative isolate space-y-5">
      <header className="relative z-10 space-y-4">
        <div className="flashcard-heading-reveal">
          <h1 className="break-words text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {documentTitle || 'Flashcards'}
          </h1>
          <p className="mt-1 text-sm text-muted">Review your notes one card at a time.</p>
        </div>
        <section aria-label="Flashcard session information" className="rounded-2xl border border-card-border bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-card-border bg-surface-raised px-3 py-1.5 text-xs font-bold text-foreground">
              {cards.length} {cards.length === 1 ? 'card' : 'cards'}
            </span>
            <span className="rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {masteredCount} mastered
            </span>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-bold text-foreground">
              {cards.length - masteredCount} to review
            </span>
            <span className="ml-auto rounded-full border border-card-border px-3 py-1.5 font-mono text-xs font-bold text-muted">
              {elapsed}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-card-border bg-surface-raised p-1" role="group" aria-label="Flashcard view">
              <button
                type="button"
                aria-pressed={viewMode === 'flip'}
                onClick={() => {
                  setViewMode('flip');
                  setIsFlipped(false);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
                  viewMode === 'flip' ? 'bg-accent text-zinc-950' : 'text-muted hover:text-foreground'
                }`}
              >
                Flip card
              </button>
              <button
                type="button"
                aria-pressed={viewMode === 'dual'}
                onClick={() => {
                  setViewMode('dual');
                  setAnswerRevealed(false);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
                  viewMode === 'dual' ? 'bg-accent text-zinc-950' : 'text-muted hover:text-foreground'
                }`}
              >
                Dual view
              </button>
            </div>
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 rounded-xl border border-card-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
            >
              <Shuffle aria-hidden="true" className="h-4 w-4" />
              Shuffle
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 rounded-xl border border-card-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        </section>
      </header>

      {atEnd && filteredCards.length === 0 && !allMastered ? (
        <section
          role="status"
          className="relative z-10 rounded-2xl border border-card-border bg-surface p-6 text-center sm:p-10"
        >
          <h2 className="text-xl font-extrabold text-foreground">No cards match these filters</h2>
          <p className="mt-2 text-sm text-muted">Change your filters to continue studying this deck.</p>
          <button
            type="button"
            onClick={() => {
              setStarredOnly(false);
              setUnmasteredOnly(false);
              setCurrentIndexState(0);
            }}
            className="mt-5 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            Clear filters
          </button>
        </section>
      ) : atEnd ? (
        <section role="status" className="relative z-10 rounded-2xl border border-card-border bg-surface p-6 text-center sm:p-10">
          {allMastered ? (
            <>
              {showConfetti && <Confetti />}
              <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                All {cards.length} cards mastered!
              </h2>
              {!prefersReducedMotion && (
                <p className="mt-2 text-sm text-muted">Wonderful work — your whole deck is mastered.</p>
              )}
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => resetDeck(false)}
                  className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  Study again
                </button>
                <button
                  type="button"
                  onClick={() => resetDeck(true)}
                  className="rounded-xl border border-card-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  Shuffle and restart
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-foreground">You reached the end</h2>
              <p className="mt-2 text-sm text-muted">
                {cards.length - masteredCount} cards still to review.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setStarredOnly(false);
                    setUnmasteredOnly(true);
                    setCurrentIndexState(0);
                    setIsFlipped(false);
                  }}
                  className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  Review unmastered
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndexState(0);
                    setIsFlipped(false);
                    setAnswerRevealed(false);
                  }}
                  className="rounded-xl border border-card-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  Start over
                </button>
              </div>
            </>
          )}
        </section>
      ) : (
        <>
          <main
            ref={stageRef}
            aria-label="Flashcard stage"
            className="relative z-10 rounded-2xl focus:outline-none"
            tabIndex={-1}
          >
            <Flashcard
              key={currentCard.id}
              card={currentCard}
              isFlipped={visualFlipped}
              onFlip={handleFlip}
              isMastered={masteredIds.has(currentCard.id)}
              isStarred={starredIds.has(currentCard.id)}
              onToggleStar={handleToggleStar}
              overrideDifficulty={currentDifficulty}
              cardNumber={displayIndex + 1}
              totalCards={filteredCards.length}
              dualView={viewMode === 'dual'}
              answerRevealed={answerRevealed}
              onRevealAnswer={() => setAnswerRevealed(true)}
              answerFirst={answerFirst}
              onListen={handleListen}
              speechSupported={speechSupported}
              onSwipe={(direction) =>
                direction === 'next' ? handleNext() : handlePrevious()
              }
              reducedMotion={prefersReducedMotion}
            />
          </main>
          <FlashcardControls
            currentIndex={displayIndex}
            totalCards={filteredCards.length}
            masteredCount={masteredCount}
            masteredCardIds={masteredIds}
            cardIds={filteredCards.map((card) => card.id)}
            isMastered={masteredIds.has(currentCard.id)}
            currentDifficulty={currentDifficulty}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onJump={handleJump}
            onGotIt={() => handleSelfCheck(true)}
            onStillLearning={() => handleSelfCheck(false)}
            onToggleMastered={handleToggleMastered}
            onSetDifficulty={handleSetDifficulty}
          />
        </>
      )}

      <section aria-label="Flashcard tools" className="relative z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-card-border bg-surface p-3">
        <button
          type="button"
          aria-pressed={starredOnly}
          disabled={starredIds.size === 0}
          onClick={() => {
            setStarredOnly((current) => !current);
            setCurrentIndexState(0);
            setIsFlipped(false);
            setAnswerRevealed(false);
          }}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-40 ${
            starredOnly ? 'border-accent/40 bg-accent/10 text-foreground' : 'border-card-border text-muted'
          }`}
        >
          <Star aria-hidden="true" className={`h-3.5 w-3.5 ${starredOnly ? 'fill-current' : ''}`} />
          Starred only
        </button>
        <button
          type="button"
          aria-pressed={unmasteredOnly}
          onClick={() => {
            setUnmasteredOnly((current) => !current);
            setCurrentIndexState(0);
            setIsFlipped(false);
            setAnswerRevealed(false);
          }}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
            unmasteredOnly ? 'border-accent/40 bg-accent/10 text-foreground' : 'border-card-border text-muted'
          }`}
        >
          <ListFilter aria-hidden="true" className="h-3.5 w-3.5" />
          Unmastered only
        </button>
        <button
          type="button"
          aria-pressed={answerFirst}
          onClick={() => {
            setAnswerFirst((current) => !current);
            setIsFlipped(false);
            setAnswerRevealed(false);
          }}
          className={`rounded-lg border px-3 py-2 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
            answerFirst ? 'border-accent/40 bg-accent/10 text-foreground' : 'border-card-border text-muted'
          }`}
        >
          Answer first
        </button>
        {canFullscreen && (
          <button
            type="button"
            onClick={() => {
              if (document.fullscreenElement) void document.exitFullscreen();
              else void stageRef.current?.requestFullscreen();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-card-border px-3 py-2 text-xs font-bold text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong hover:bg-surface-raised"
          >
            <Expand aria-hidden="true" className="h-3.5 w-3.5" />
            Fullscreen
          </button>
        )}
        <div className="relative ml-auto">
          <button
            ref={helpTriggerRef}
            type="button"
            aria-label="Keyboard shortcuts"
            aria-expanded={helpOpen}
            aria-haspopup="dialog"
            onClick={helpOpen ? closeHelp : openHelp}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-card-border text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            <HelpCircle aria-hidden="true" className="h-4 w-4" />
          </button>
          {helpOpen && (
            <div
              ref={helpPopoverRef}
              role="dialog"
              aria-label="Keyboard shortcuts"
              onKeyDown={handleHelpKeyDown}
              className="absolute bottom-12 right-0 z-50 w-64 rounded-xl border border-card-border bg-surface p-4 shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Keyboard shortcuts</h2>
                <button
                  type="button"
                  aria-label="Close shortcuts"
                  onClick={closeHelp}
                  className="rounded-md p-1 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <dl className="space-y-2 text-xs text-muted">
                <Shortcut keys="← / →" description="Previous / next card" />
                <Shortcut keys="Space" description="Flip the card" />
                <Shortcut keys="M" description="Toggle mastered" />
                <Shortcut keys="S" description="Toggle bookmark" />
                <Shortcut keys="?" description="Open shortcuts" />
              </dl>
            </div>
          )}
        </div>
      </section>
      <style jsx>{`
        .flashcard-heading-reveal {
          animation: flashcard-heading-fade-up 400ms ease-out both;
        }
        @keyframes flashcard-heading-fade-up {
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
          .flashcard-heading-reveal {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

function Shortcut({ keys, description }: { keys: string; description: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt>{description}</dt>
      <dd className="rounded border border-card-border bg-surface-raised px-1.5 py-0.5 font-mono font-bold text-foreground">
        {keys}
      </dd>
    </div>
  );
}
