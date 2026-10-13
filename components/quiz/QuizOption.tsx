'use client';

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizOptionProps {
  optionLetter: string;
  optionText: string;
  isSelected: boolean;
  isSubmitted: boolean;
  isCorrectAnswer: boolean; // True if this option is the right answer
  isUserSelection: boolean; // True if the user selected this option
  onSelect: () => void;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  optionLetter,
  optionText,
  isSelected,
  isSubmitted,
  isCorrectAnswer,
  isUserSelection,
  onSelect,
}) => {
  let containerStyles = '';
  let badgeStyles = 'border-card-border bg-surface text-muted';

  if (!isSubmitted) {
    if (isSelected) {
      containerStyles = 'quiz-option--selected font-bold';
      badgeStyles = 'border-accent bg-accent text-zinc-950 font-extrabold';
    }
  } else {
    if (isCorrectAnswer) {
      containerStyles = `quiz-option--correct font-bold ${
        isUserSelection ? 'quiz-option--correct-pop' : ''
      }`;
      badgeStyles = 'border-emerald-500 bg-emerald-500 text-white font-extrabold';
    } else if (isUserSelection && !isCorrectAnswer) {
      containerStyles = 'quiz-option--wrong quiz-option--shake font-bold';
      badgeStyles = 'border-rose-500 bg-rose-500 text-white font-extrabold';
    } else {
      containerStyles = 'opacity-60 cursor-not-allowed';
      badgeStyles = 'border-card-border bg-surface text-muted';
    }
  }

  return (
    <button
      onClick={onSelect}
      disabled={isSubmitted}
      className={`quiz-option flex w-full items-center justify-between gap-4 text-left ${isSubmitted ? '' : 'cursor-pointer'} ${containerStyles}`}
      aria-label={`Option ${optionLetter}: ${optionText}`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm transition-colors ${badgeStyles}`}
        >
          {optionLetter}
        </span>
        <span className="text-[clamp(0.95rem,1.25vw,1.15rem)] leading-relaxed break-words">
          {optionText}
        </span>
      </div>

      {isSubmitted && isCorrectAnswer && (
        <div className="flex shrink-0 items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
            Correct
          </span>
        </div>
      )}

      {isSubmitted && isUserSelection && !isCorrectAnswer && (
        <div className="flex shrink-0 items-center gap-1 text-rose-600 dark:text-rose-400">
          <XCircle className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
            Incorrect
          </span>
        </div>
      )}
    </button>
  );
};
