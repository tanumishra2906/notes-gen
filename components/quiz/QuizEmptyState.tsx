'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Upload, ArrowRight } from 'lucide-react';

interface QuizEmptyStateProps {
  hasNotes: boolean;
  onGenerate: () => void;
  isLoading?: boolean;
}

export const QuizEmptyState: React.FC<QuizEmptyStateProps> = ({
  hasNotes,
  onGenerate,
  isLoading = false,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-8 sm:p-12 text-center rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-6 shadow-xl shadow-teal-500/5">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center border border-teal-500/20 shadow-inner">
        <BrainCircuit className="w-8 h-8 stroke-[1.5]" />
      </div>

      {/* Main Copy */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Quiz Mode</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {hasNotes ? 'Ready to test yourself?' : 'Your quiz will appear here.'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {hasNotes
            ? 'Generate an interactive multiple-choice quiz based directly on your uploaded study materials.'
            : 'Upload your lecture slides or textbook PDF first to automatically generate custom quizzes.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        {hasNotes ? (
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <BrainCircuit className="w-4 h-4 stroke-[2.5]" />
            <span>Generate Quiz</span>
          </button>
        ) : (
          <Link
            href="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Notes First</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        )}
      </div>
    </div>
  );
};
