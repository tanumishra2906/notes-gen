'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-[#0B0F19]/60 backdrop-blur-md py-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
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

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/upload" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
            Upload Notes
          </Link>
          <Link href="/notes" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
            My Notes
          </Link>
          <Link href="/quiz" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
            Quiz Mode
          </Link>
          <Link href="/flashcards" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
            Flashcards
          </Link>
        </div>

        {/* Free Tier Notice */}
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/60 font-medium">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Gemini AI Free Tier (10MB / ~30k chars max)</span>
        </div>
      </div>
    </footer>
  );
};
