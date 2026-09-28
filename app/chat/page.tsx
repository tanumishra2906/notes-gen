'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, Sparkles } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 text-center space-y-8 animate-in fade-in-50 duration-300">
      <div className="p-8 sm:p-12 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-6 shadow-xl shadow-pink-500/5">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-500 dark:text-pink-400 mx-auto flex items-center justify-center border border-pink-500/20">
          <MessageSquare className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Module 2 Preview
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Chat with AI
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Ask targeted questions, clarify tricky concepts, and request practice problems based strictly on your uploaded document context.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 transition-all"
          >
            <span>Upload Notes First</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
