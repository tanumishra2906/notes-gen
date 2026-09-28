'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeft, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { useStudy } from '@/context/StudyContext';

export default function DashboardPage() {
  const { studyData } = useStudy();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border border-yellow-400/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Study Overview
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Study Desk Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of your active study materials and progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Document</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {studyData ? '1 PDF Loaded' : 'None'}
          </div>
          <p className="text-xs text-slate-500">
            {studyData ? 'Ready for study and revision' : 'Upload a PDF to get started'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Concepts</span>
          <div className="text-xl font-black text-purple-500 dark:text-purple-400">
            {studyData ? `${studyData.keyConcepts.length} Extracted` : '0'}
          </div>
          <p className="text-xs text-slate-500">Core study topics identified</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Definitions & Formulas</span>
          <div className="text-xl font-black text-teal-500 dark:text-teal-400">
            {studyData ? `${studyData.definitions.length + studyData.formulas.length} Available` : '0'}
          </div>
          <p className="text-xs text-slate-500">Vocabulary & rules extracted</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/upload"
            className="px-6 py-3 text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 transition-all"
          >
            Upload New Material
          </Link>
          <Link
            href="/notes"
            className="px-6 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
          >
            View Study Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
