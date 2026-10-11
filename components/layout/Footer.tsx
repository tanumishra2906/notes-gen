'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-[#0B0F19]/60 backdrop-blur-md py-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {/* Footer Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-yellow-500 to-amber-400 flex items-center justify-center shadow-sm">
            <Lightbulb className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-sm font-extrabold tracking-tight">
            <span className="text-slate-900 dark:text-white">Study</span>
            <span className="text-yellow-500 dark:text-yellow-400">Desk</span>
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
            © {new Date().getFullYear()} Intelligent Study Assistant
          </span>
        </div>

      </div>
    </footer>
  );
};
