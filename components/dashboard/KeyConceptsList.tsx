import React from 'react';
import { KeyConcept } from '@/types/study';
import { Lightbulb } from 'lucide-react';

interface KeyConceptsListProps {
  concepts: KeyConcept[];
}

export function KeyConceptsList({ concepts }: KeyConceptsListProps) {
  if (concepts.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500">
        No key concepts identified in this text.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {concepts.map((concept, index) => (
        <div
          key={index}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{concept.title}</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{concept.explanation}</p>
        </div>
      ))}
    </div>
  );
}
