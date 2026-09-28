'use client';

import React from 'react';
import Link from 'next/link';
import { useStudy } from '@/context/StudyContext';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { FileText, ArrowRight, Upload, BrainCircuit } from 'lucide-react';

export default function NotesPage() {
  const { studyData, handleReset } = useStudy();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Notes Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Structured Study Guide</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Material & Notes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive breakdown of key concepts, formulas, definitions, and takeaways.
          </p>
        </div>

        {studyData && (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 transition-all"
            >
              <BrainCircuit className="w-4 h-4 stroke-[2.5]" />
              <span>Quiz Mode</span>
            </Link>
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Flashcards Lab</span>
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Upload Another PDF</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Content View */}
      {studyData ? (
        <DashboardTabs data={studyData} onReset={handleReset} />
      ) : (
        <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 text-center rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 mx-auto flex items-center justify-center border border-purple-500/20 shadow-inner">
            <FileText className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              No Study Notes Generated Yet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Upload your textbook chapters or lecture PDFs to automatically generate structured summaries, key concepts, vocabulary, and formulas.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all cursor-pointer"
            >
              <span>Upload Notes Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
