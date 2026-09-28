'use client';

import React from 'react';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#f8fafc] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors selection:bg-yellow-400 selection:text-slate-950">
      {/* Dynamic Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Yellow/Gold Radial Glow */}
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-yellow-500/10 dark:bg-yellow-400/10 rounded-full blur-[100px]" />
        
        {/* Top-Left Lavender/Purple Radial Glow */}
        <div className="absolute top-20 -left-40 w-[32rem] h-[32rem] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px]" />

        {/* Center-Bottom Teal Radial Glow */}
        <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-[110px]" />

        {/* Subtle Overlay Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Shared Application Shell */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
