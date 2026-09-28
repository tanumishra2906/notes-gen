import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface FactsListProps {
  facts: string[];
}

export function FactsList({ facts }: FactsListProps) {
  if (facts.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500">
        No important facts extracted.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <ul className="space-y-4">
        {facts.map((fact, index) => (
          <li key={index} className="flex items-start gap-3.5">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-200 text-base leading-relaxed">{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
