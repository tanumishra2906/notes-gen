'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
      {/* Top Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-yellow-400/10 dark:bg-yellow-400/10 text-amber-700 dark:text-yellow-400 border border-yellow-400/40 dark:border-yellow-400/30 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Sparkles className="w-4 h-4 text-yellow-500 stroke-[2.5]" />
        <span>AI-Powered Intelligent Learning Assistant</span>
      </div>

      {/* Main Title Heading */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1]">
          <span className="block text-slate-900 dark:text-white">
            Turn your notes into your
          </span>
          <span className="inline-block bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 dark:from-yellow-400 dark:via-amber-300 dark:to-yellow-200 bg-clip-text text-transparent underline decoration-yellow-400/30 decoration-wavy underline-offset-8">
            smart study desk.
          </span>
        </h1>
      </div>

      {/* Supporting Text */}
      <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
        Upload your PDFs and notes. Study Desk turns them into summaries, cheat sheets, flashcards, and quizzes — in seconds.
      </p>

      {/* CTA Button Group */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
        {/* Primary CTA */}
        <Link
          href="/upload"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
        >
          <span>Upload Your Notes</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </Link>

        {/* Secondary CTA */}
        <a
          href="#instant-study-toolkit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          <span>Explore Study Desk</span>
        </a>
      </div>
    </section>
  );
};
