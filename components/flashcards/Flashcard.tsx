'use client';

import React from 'react';
import { Flashcard as FlashcardType, FlashcardDifficulty } from '@/types/flashcards';
import { RotateCw, CheckCircle2, Sparkles } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  isMastered?: boolean;
  overrideDifficulty?: FlashcardDifficulty;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  isMastered = false,
  overrideDifficulty,
}) => {
  const difficulty = overrideDifficulty || card.difficulty || 'medium';

  const getDifficultyBadge = (diff: FlashcardDifficulty) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'hard':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div
      onClick={onFlip}
      className="w-full max-w-2xl mx-auto h-[360px] sm:h-[400px] perspective-1000 cursor-pointer select-none group"
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT SIDE (Question) */}
        <div className="absolute inset-0 w-full h-full rounded-3xl studydesk-card p-6 sm:p-10 flex flex-col justify-between backface-hidden shadow-xl shadow-yellow-500/5 group-hover:border-yellow-400/50 transition-colors">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-amber-700 dark:text-yellow-400 border border-yellow-400/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{card.topic || 'General'}</span>
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getDifficultyBadge(
                  difficulty
                )}`}
              >
                {difficulty}
              </span>
            </div>

            {isMastered && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastered</span>
              </span>
            )}
          </div>

          {/* Question Text */}
          <div className="my-auto py-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
              Question
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {card.question}
            </h2>
          </div>

          {/* Bottom Hint */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Click or press Flip to reveal answer</span>
          </div>
        </div>

        {/* BACK SIDE (Answer) */}
        <div className="absolute inset-0 w-full h-full rounded-3xl studydesk-card p-6 sm:p-10 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl border-yellow-400/40 dark:border-yellow-400/30">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Answer
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {card.topic}
              </span>
            </div>

            {isMastered && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastered</span>
              </span>
            )}
          </div>

          {/* Answer Text */}
          <div className="my-auto py-4 text-center overflow-y-auto max-h-[220px] custom-scrollbar px-2">
            <p className="text-base sm:text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              {card.answer}
            </p>
          </div>

          {/* Bottom Hint */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to flip back to question</span>
          </div>
        </div>
      </div>
    </div>
  );
};
