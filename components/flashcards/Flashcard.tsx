'use client';

import React, { useRef } from 'react';
import { Flashcard as FlashcardType, FlashcardDifficulty } from '@/types/flashcards';
import { Check, Star } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  isMastered: boolean;
  isStarred: boolean;
  onToggleStar: () => void;
  overrideDifficulty: FlashcardDifficulty;
  cardNumber: number;
  totalCards: number;
  dualView: boolean;
  answerRevealed: boolean;
  onRevealAnswer: () => void;
  answerFirst: boolean;
  onListen: (text: string) => void;
  speechSupported: boolean;
  onSwipe: (direction: 'next' | 'previous') => void;
  reducedMotion: boolean;
}

const DIFFICULTY_CLASSES: Record<FlashcardDifficulty, string> = {
  easy: 'border-emerald-700/20 bg-emerald-700/10 text-emerald-900',
  medium: 'border-amber-800/20 bg-amber-800/10 text-amber-950',
  hard: 'border-rose-800/20 bg-rose-800/10 text-rose-900',
};

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  isMastered,
  isStarred,
  onToggleStar,
  overrideDifficulty,
  cardNumber,
  totalCards,
  dualView,
  answerRevealed,
  onRevealAnswer,
  answerFirst,
  onListen,
  speechSupported,
  onSwipe,
  reducedMotion,
}) => {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const hasSwiped = useRef(false);
  const question = (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-900/15 bg-amber-900/5 px-3 py-1 text-xs font-bold text-stone-800">
          Question {cardNumber} of {totalCards}
        </span>
        {card.topic && (
          <span className="max-w-full truncate rounded-full border border-amber-900/15 bg-white/50 px-3 py-1 text-xs font-semibold text-stone-800">
            {card.topic}
          </span>
        )}
        {card.difficulty && (
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${DIFFICULTY_CLASSES[overrideDifficulty]}`}
          >
            {overrideDifficulty}
          </span>
        )}
      </div>
      <p className="my-auto px-2 py-10 text-center text-[clamp(1.5rem,3.2vw,2.75rem)] font-extrabold leading-tight text-[#1C1917]">
        {card.question}
      </p>
    </div>
  );
  const answer = (
    <div className="flex h-full flex-col">
      <span className="inline-flex w-fit rounded-full border border-emerald-800/15 bg-emerald-800/5 px-3 py-1 text-xs font-bold text-emerald-950">
        Answer
      </span>
      <p className="my-auto px-2 py-10 text-center text-[clamp(1.25rem,2.6vw,2.25rem)] font-semibold leading-relaxed text-[#1C1917]">
        {card.answer}
      </p>
    </div>
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    hasSwiped.current = false;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || event.pointerType === 'mouse') return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      hasSwiped.current = true;
      onSwipe(deltaX < 0 ? 'next' : 'previous');
    } else if (
      dualView &&
      Math.abs(deltaX) < 10 &&
      Math.abs(deltaY) < 10 &&
      !(event.target as HTMLElement).closest('button')
    ) {
      onFlip();
    }
  };

  const handlePointerCancel = () => {
    pointerStart.current = null;
  };

  return (
    <div
      className={`relative min-w-0 touch-pan-y ${reducedMotion ? '' : 'flashcard-card-enter'}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={(event) => {
        if (!hasSwiped.current) return;
        event.preventDefault();
        event.stopPropagation();
        hasSwiped.current = false;
      }}
    >
      {dualView ? (
        <div
          className={`grid gap-4 md:grid-cols-2 ${
            answerFirst ? 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1' : ''
          }`}
        >
          <article
            className="relative min-h-[26rem] overflow-hidden rounded-3xl border border-[#F2E2A0] bg-[#FFF7D1] p-5 shadow-[0_10px_28px_-20px_rgba(92,65,0,0.45)] sm:p-7"
            style={{ borderTopWidth: 4, borderTopColor: '#F59E0B' }}
          >
            {question}
            {speechSupported && (
              <button
                type="button"
                onClick={() => onListen(card.question)}
                aria-label="Listen to the question"
                className="absolute bottom-4 left-4 rounded-lg border border-amber-900/15 px-3 py-2 text-xs font-bold text-stone-800 transition-colors hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              >
                Listen
              </button>
            )}
            <CardBadges
              isMastered={isMastered}
              isStarred={isStarred}
              onToggleStar={onToggleStar}
              reducedMotion={reducedMotion}
            />
          </article>
          <article
            className="relative min-h-[26rem] overflow-hidden rounded-3xl border border-[#F2E2A0] bg-[#FFFBE6] p-5 shadow-[0_10px_28px_-20px_rgba(92,65,0,0.45)] sm:p-7"
            style={{ borderTopWidth: 4, borderTopColor: '#16A34A' }}
          >
            {answer}
            {answerRevealed ? (
              speechSupported && (
                <button
                  type="button"
                  onClick={() => onListen(card.answer)}
                  aria-label="Listen to the answer"
                  className="absolute bottom-4 left-4 rounded-lg border border-emerald-900/15 px-3 py-2 text-xs font-bold text-stone-800 transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  Listen
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={onRevealAnswer}
                className="absolute inset-0 flex items-center justify-center bg-[#FFFBE6] text-lg font-bold text-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-600"
              >
                Click to reveal
              </button>
            )}
          </article>
        </div>
      ) : (
        <div className="flashcard-perspective relative mx-auto w-full max-w-5xl">
          <button
            type="button"
            onClick={onFlip}
            aria-pressed={isFlipped}
            aria-label={isFlipped ? 'Show question side' : 'Flip card to reveal the answer'}
            className="block w-full rounded-3xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-600/50"
          >
            {reducedMotion ? (
              <span
                className={`flashcard-face-static relative block min-h-[min(70svh,30rem)] rounded-3xl border border-[#F2E2A0] p-6 shadow-[0_12px_32px_-22px_rgba(92,65,0,0.5)] sm:p-9 ${
                  isFlipped ? 'bg-[#FFFBE6]' : 'bg-[#FFF7D1]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1.5 rounded-t-3xl ${
                    isFlipped ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                />
                {isFlipped ? answer : question}
              </span>
            ) : (
              <span className="flashcard-flip-inner relative block min-h-[min(70svh,30rem)]">
                <span
                  className={`flashcard-flip-face absolute inset-0 rounded-3xl border border-[#F2E2A0] bg-[#FFF7D1] p-6 shadow-[0_12px_32px_-22px_rgba(92,65,0,0.5)] sm:p-9 ${
                    isFlipped ? 'flashcard-face-hidden' : 'flashcard-face-visible'
                  }`}
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-amber-500" />
                  {question}
                </span>
                <span
                  className={`flashcard-flip-face flashcard-flip-back absolute inset-0 rounded-3xl border border-[#F2E2A0] bg-[#FFFBE6] p-6 shadow-[0_12px_32px_-22px_rgba(92,65,0,0.5)] sm:p-9 ${
                    isFlipped ? 'flashcard-face-visible' : 'flashcard-face-hidden'
                  }`}
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-emerald-600" />
                  {answer}
                </span>
              </span>
            )}
          </button>
          <CardBadges
            isMastered={isMastered}
            isStarred={isStarred}
            onToggleStar={onToggleStar}
            reducedMotion={reducedMotion}
          />
          {speechSupported && (
            <div className="absolute bottom-4 left-4 z-20">
              <button
                type="button"
                onClick={() => onListen(isFlipped ? card.answer : card.question)}
                aria-label={`Listen to the ${isFlipped ? 'answer' : 'question'}`}
                className="rounded-lg border border-amber-900/15 bg-white/60 px-3 py-2 text-xs font-bold text-stone-800 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              >
                Listen
              </button>
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        .flashcard-perspective {
          perspective: 1400px;
        }
        .flashcard-card-enter {
          animation: flashcard-card-enter 240ms ease-out both;
        }
        @keyframes flashcard-card-enter {
          from {
            opacity: 0.72;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .flashcard-flip-inner {
          transform-style: preserve-3d;
        }
        .flashcard-flip-face {
          backface-visibility: hidden;
          transform-style: preserve-3d;
          transition: transform 600ms ease;
        }
        .flashcard-face-visible {
          transform: rotateY(0deg);
        }
        .flashcard-face-hidden {
          transform: rotateY(-180deg);
        }
        .flashcard-flip-back.flashcard-face-visible {
          transform: rotateY(0deg);
        }
        .flashcard-flip-back.flashcard-face-hidden {
          transform: rotateY(180deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .flashcard-flip-face {
            transition: none;
          }
          .flashcard-card-enter {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

function CardBadges({
  isMastered,
  isStarred,
  onToggleStar,
  reducedMotion,
}: {
  isMastered: boolean;
  isStarred: boolean;
  onToggleStar: () => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-30 flex items-center gap-2">
      {isMastered && (
        <span className={`inline-flex items-center gap-1 rounded-full border border-emerald-700/20 bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900 ${reducedMotion ? '' : 'mastered-pop'}`}>
          <Check aria-hidden="true" className="h-3.5 w-3.5" />
          Mastered
        </span>
      )}
      <button
        type="button"
        onClick={onToggleStar}
        aria-label={isStarred ? 'Remove bookmark' : 'Bookmark this card'}
        aria-pressed={isStarred}
        className={`pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-900/15 bg-white/70 text-amber-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
          isStarred ? 'bg-amber-200 text-amber-900' : ''
        }`}
      >
        <Star aria-hidden="true" className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
      </button>
      <style jsx>{`
        .mastered-pop {
          animation: mastered-card-pop 320ms ease-out both;
        }
        @keyframes mastered-card-pop {
          50% {
            transform: scale(1.08);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mastered-pop {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
