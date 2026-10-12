'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AnimatedBackground } from './AnimatedBackground';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-accent/30">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
