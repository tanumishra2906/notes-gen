import React from 'react';
import { Formula } from '@/types/study';
import { Binary } from 'lucide-react';

interface FormulasListProps {
  formulas: Formula[];
}

export function FormulasList({ formulas }: FormulasListProps) {
  if (!formulas || formulas.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500">
        No formulas or equations found in this study material.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {formulas.map((item, index) => (
        <div
          key={index}
          className="p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md flex flex-col justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                <Binary className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-lg text-slate-100">{item.name}</h4>
            </div>

            {/* Monospace Formula Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-violet-300 font-mono text-base md:text-lg tracking-wide shadow-inner overflow-x-auto my-2">
              <code>{item.formula}</code>
            </div>
          </div>

          {item.description && (
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
