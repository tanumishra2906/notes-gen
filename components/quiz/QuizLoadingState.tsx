'use client';

import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const QuizLoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-8 sm:p-12 text-center rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-6 shadow-xl shadow-teal-500/5">
      {/* Animated Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-teal-500/20 dark:bg-teal-500/10 animate-ping opacity-75" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/20 z-10">
          <BrainCircuit className="w-8 h-8 stroke-[2] animate-pulse" />
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Gemini AI Processing</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Creating your quiz...
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          You'll be testing yourself in just a moment. Generating multiple-choice questions from your study materials.
        </p>
      </div>

      {/* Question Options Skeleton */}
      <div className="w-full space-y-3 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="w-3/4 h-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-12 rounded-xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse flex items-center px-4"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-300 dark:bg-slate-700 mr-3" />
            <div className="w-1/2 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
};
