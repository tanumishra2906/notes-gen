'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStudy } from '@/context/StudyContext';

export function CtaBanner() {
  const { isAuthenticated, authLoaded } = useStudy();

  return (
    <section
      aria-labelledby="home-cta-heading"
      className="relative isolate mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] bg-[#7C3AED] px-6 py-10 text-center shadow-lg sm:px-12 sm:py-14"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.72) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
        backgroundSize: '16px 16px, 32px 32px, 32px 32px',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#FACC15] opacity-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#06D6A0] opacity-20"
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2
          id="home-cta-heading"
          className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl"
        >
          Ready to structure your study workflow?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-purple-100 sm:text-base">
          Upload a PDF and get notes, flashcards and a quiz.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FACC15] px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-sm transition-colors hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#7C3AED]"
          >
            Upload Your Notes
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          {authLoaded && !isAuthenticated && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#7C3AED]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
