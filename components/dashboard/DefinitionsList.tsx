import React from 'react';
import { Definition } from '@/types/study';
import { Type } from 'lucide-react';

interface DefinitionsListProps {
  definitions: Definition[];
}

export function DefinitionsList({ definitions }: DefinitionsListProps) {
  if (definitions.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500">
        No key definitions found in this text.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {definitions.map((item, index) => (
        <div
          key={index}
          className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
        >
          <div className="flex items-center gap-2 sm:w-1/3 shrink-0">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Type className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{item.term}</span>
          </div>
          <div className="sm:w-2/3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-6">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.definition}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
