'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const headlineWords = ['Turn', 'your', 'notes', 'into', 'your'];

export const Hero: React.FC = () => (
  <section className="mx-auto flex max-w-5xl flex-col items-center space-y-7 py-14 text-center sm:py-24">
    <h1 className="text-4xl font-extrabold leading-[1.12] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl">
      <span className="block">
        {headlineWords.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <span className="reveal-word" style={{ animationDelay: `${index * 65}ms` }}>
              {word}
            </span>{' '}
          </React.Fragment>
        ))}
      </span>
      <span
        className="mt-1 inline-block bg-gradient-to-r from-accent-strong via-accent-hover to-accent bg-clip-text text-transparent reveal-up"
        style={{ animationDelay: '350ms' }}
      >
        smart study desk.
      </span>
    </h1>

    <p
      className="max-w-2xl text-base leading-relaxed text-muted reveal-up sm:text-lg"
      style={{ animationDelay: '430ms' }}
    >
      Bring your notes together with summaries, flashcards, and quizzes in one study space.
    </p>

    <div
      className="flex w-full flex-col items-center justify-center gap-3 pt-1 reveal-up sm:w-auto sm:flex-row"
      style={{ animationDelay: '520ms' }}
    >
      <Link
        href="/upload"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-zinc-950 shadow-lg shadow-amber-900/10 transition-colors hover:bg-accent-hover sm:w-auto"
      >
        Upload Your Notes
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        href="#instant-study-toolkit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-card-border bg-surface/75 px-6 py-3.5 font-semibold text-foreground transition-colors hover:bg-surface-raised sm:w-auto"
      >
        <BookOpen className="h-4 w-4 text-accent-strong" />
        Explore Study Desk
      </Link>
    </div>
  </section>
);
