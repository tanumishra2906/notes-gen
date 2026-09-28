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
  let containerStyles =
    'border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 hover:border-yellow-400/60 dark:hover:border-yellow-400/50 hover:bg-slate-50 dark:hover:bg-slate-800/60';
  let badgeStyles =
    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

  if (!isSubmitted) {
    if (isSelected) {
      containerStyles =
        'border-yellow-400 dark:border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/15 text-slate-900 dark:text-white shadow-[0_0_15px_rgba(250,204,21,0.2)] font-bold';
      badgeStyles = 'bg-yellow-400 text-slate-950 border-yellow-400 font-extrabold';
    }
  } else {
    if (isCorrectAnswer) {
      // Always highlight the right answer green after submission
      containerStyles =
        'border-emerald-500/80 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold shadow-md shadow-emerald-500/10';
      badgeStyles = 'bg-emerald-500 text-white border-emerald-500 font-extrabold';
    } else if (isUserSelection && !isCorrectAnswer) {
      // Highlight wrong choice red
      containerStyles =
        'border-rose-500/80 bg-rose-500/10 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 font-bold shadow-md shadow-rose-500/10';
      badgeStyles = 'bg-rose-500 text-white border-rose-500 font-extrabold';
    } else {
      // Other unselected, incorrect options
      containerStyles =
        'border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed';
      badgeStyles =
        'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800';
    }
  }

  return (
    <button
      onClick={onSelect}
      disabled={isSubmitted}
      className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer ${containerStyles}`}
      aria-label={`Option ${optionLetter}: ${optionText}`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        <span
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center text-xs sm:text-sm shrink-0 transition-colors ${badgeStyles}`}
        >
          {optionLetter}
        </span>
        <span className="text-sm sm:text-base leading-relaxed break-words">
          {optionText}
        </span>
      </div>

      {isSubmitted && isCorrectAnswer && (
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
            Correct
          </span>
        </div>
      )}

      {isSubmitted && isUserSelection && !isCorrectAnswer && (
        <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 shrink-0">
          <XCircle className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
            Incorrect
          </span>
        </div>
      )}
    </button>
  );
};
