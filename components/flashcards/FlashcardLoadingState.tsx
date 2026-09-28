'use client';

import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const FlashcardLoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-8 sm:p-12 text-center rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-6 shadow-xl shadow-yellow-500/5">
      {/* Animated Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 dark:bg-yellow-400/10 animate-ping opacity-75" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-yellow-500/20 z-10">
          <BrainCircuit className="w-8 h-8 stroke-[2] animate-pulse" />
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border border-yellow-400/20">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Gemini AI Processing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Creating your flashcards...
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Extracting key definitions, concepts, and formulas from your study material into structured flashcards.
        </p>
      </div>

      {/* Card Skeleton Pulse */}
      <div className="w-full h-48 rounded-2xl border-2 border-dashed border-yellow-400/30 dark:border-yellow-400/20 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-3/4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-1/2 h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-1/4 h-3 rounded-full bg-yellow-400/30 animate-pulse mt-2" />
      </div>
    </div>
  );
};
