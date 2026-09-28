'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-slate-200/70 dark:border-slate-800/80 bg-white/50 dark:bg-[#0B0F19]/60 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-md shadow-yellow-500/20 group-hover:scale-105 transition-transform duration-200">
            <Lightbulb className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight">
            <span className="text-slate-900 dark:text-white transition-colors">Study</span>
            <span className="text-yellow-500 dark:text-yellow-400">Desk</span>
          </div>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Login / Sign Up CTA (Visual placeholder) */}
          <button
            onClick={() => alert('Authentication will be available in a future update!')}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <User className="w-4 h-4 stroke-[2.5]" />
            <span>Login / Sign Up</span>
          </button>
        </div>
      </div>
    </header>
  );
};
