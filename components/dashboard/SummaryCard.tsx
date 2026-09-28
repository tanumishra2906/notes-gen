import React from 'react';
import { BookOpen } from 'lucide-react';

interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Executive Summary</h3>
      </div>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
        {summary}
      </p>
    </div>
  );
}
