'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBanner } from '@/components/home/CtaBanner';
import { FaqSection } from '@/components/home/FaqSection';
import { Hero } from '@/components/home/Hero';
import { HomeDoodles } from '@/components/home/HomeDoodles';
import { StudyToolkit } from '@/components/home/StudyToolkit';

export default function Home() {
  return (
    <div className="relative isolate">
      <HomeDoodles />
      <div className="relative z-10 space-y-10 sm:space-y-16">
        <Hero />
        <StudyToolkit />
        <section className="overflow-hidden rounded-[2rem] border border-card-border bg-surface/80 px-6 py-10 text-center shadow-sm sm:px-12 sm:py-14">
          <div className="mx-auto max-w-2xl space-y-5">
            <span className="font-label text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">
              Ready when you are
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Make your notes your next study session.
            </h2>
            <p className="text-muted">
              Upload your notes and choose the study tools that work for you.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-zinc-950 transition-colors hover:bg-accent-hover"
            >
              Upload Your Notes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <FaqSection />
        <CtaBanner />
      </div>
    </div>
  );
}
