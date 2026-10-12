'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpenText,
  BrainCircuit,
  Check,
  FileText,
  Layers,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

const TOOLKIT_CARDS = [
  {
    title: 'Summarize',
    description: 'A quick overview of the key ideas in your notes.',
    href: '/notes',
    kind: 'summary',
    icon: FileText,
    cardStyle: 'bg-tint-lavender text-foreground',
    iconStyle: 'bg-white/70 text-violet-700',
  },
  {
    title: 'Chat with AI',
    description: 'A new way to explore your study materials.',
    kind: 'chat',
    icon: MessageCircle,
    cardStyle: 'bg-tint-blue text-foreground',
    iconStyle: 'bg-white/70 text-blue-700',
  },
  {
    title: 'Flashcards',
    description: 'Review important concepts with flashcards.',
    href: '/flashcards',
    kind: 'flashcards',
    icon: Layers,
    cardStyle: 'bg-gradient-to-br from-amber-500 via-amber-500 to-orange-600 text-white',
    iconStyle: 'bg-white/20 text-white',
    featured: true,
  },
  {
    title: 'Quiz Mode',
    description: 'Check your understanding with a quiz.',
    href: '/quiz',
    kind: 'quiz',
    icon: BrainCircuit,
    cardStyle: 'bg-tint-mint text-foreground',
    iconStyle: 'bg-white/70 text-emerald-700',
  },
] as const;

type PreviewKind = (typeof TOOLKIT_CARDS)[number]['kind'];

function Preview({ kind }: { kind: PreviewKind }) {
  if (kind === 'summary') {
    return (
      <div className="h-full p-4 text-left" aria-hidden="true">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
            <FileText className="h-4 w-4" />
          </span>
          <h4 className="text-xs font-bold text-slate-800">Photosynthesis</h4>
        </div>
        <p className="mb-2 text-[10px] font-semibold text-slate-600">Key notes</p>
        <div className="space-y-2">
          <p className="text-[10px] leading-snug text-slate-600">Plants use sunlight to make their own food.</p>
          <p className="text-[10px] leading-snug text-slate-600">Leaves take in carbon dioxide and release oxygen.</p>
          <p className="text-[10px] leading-snug text-slate-600">Chlorophyll captures light energy.</p>
        </div>
      </div>
    );
  }

  if (kind === 'flashcards') {
    return (
      <div className="toolkit-card__flip h-full w-full p-4" aria-hidden="true">
        <div className="toolkit-card__flip-inner">
          <div className="toolkit-card__flip-face rounded-2xl border border-amber-100 bg-white p-4 text-slate-800 shadow-sm">
            <span className="font-label text-[9px] font-semibold uppercase tracking-widest text-amber-700">
              Photosynthesis
            </span>
            <p className="mt-3 text-sm font-bold">What does chlorophyll do?</p>
            <span className="mt-auto pt-3 text-[9px] text-slate-400">Hover or focus to flip</span>
          </div>
          <div className="toolkit-card__flip-face toolkit-card__flip-back rounded-2xl border border-amber-100 bg-white p-4 text-slate-800 shadow-sm">
            <span className="font-label text-[9px] font-semibold uppercase tracking-widest text-amber-700">
              Answer
            </span>
            <p className="mt-3 text-xs leading-relaxed">It absorbs light energy that plants use to make food.</p>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'quiz') {
    return (
      <div className="h-full p-4 text-left" aria-hidden="true">
        <div className="mb-3 flex items-start gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <BookOpenText className="h-4 w-4" />
          </span>
          <p className="pt-0.5 text-[10px] font-semibold leading-snug text-slate-700">
            Which pigment absorbs light for photosynthesis?
          </p>
        </div>
        <div className="space-y-1.5 text-[9px]">
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 font-medium text-emerald-800">
            <Check className="h-3 w-3" /> Chlorophyll
          </div>
          <div className="rounded-lg border border-slate-100 px-2 py-1.5 text-slate-500">Hemoglobin</div>
          <div className="rounded-lg border border-slate-100 px-2 py-1.5 text-slate-500">Keratin</div>
          <div className="rounded-lg border border-slate-100 px-2 py-1.5 text-slate-500">Melanin</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-3 p-4" aria-hidden="true">
      <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-blue-600 px-3 py-2 text-[9px] leading-snug text-white">
        What is photosynthesis?
      </div>
      <div className="max-w-[90%] rounded-xl rounded-bl-sm bg-slate-100 px-3 py-2 text-[9px] leading-snug text-slate-600">
        A process plants use to turn light into chemical energy.
      </div>
    </div>
  );
}

export const StudyToolkit: React.FC = () => (
  <section id="instant-study-toolkit" className="scroll-mt-28 space-y-8 py-8 sm:py-12">
    <div className="mx-auto max-w-2xl space-y-3 text-center">
      <span className="font-label text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">
        Your study toolkit
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        A clearer way to study
      </h2>
      <p className="text-muted">
        Choose a tool to explore your study materials in a different way.
      </p>
    </div>

    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
      {TOOLKIT_CARDS.map((card, index) => {
        const Icon = card.icon;
        const isComingSoon = card.kind === 'chat';
        const cardContent = (
          <div
            className={`toolkit-card relative h-[22rem] overflow-hidden rounded-[30px] p-5 ${
              'featured' in card && card.featured ? 'sm:h-[23.5rem]' : ''
            } ${card.cardStyle} ${
              isComingSoon
                ? 'cursor-default opacity-80'
                : 'cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            } w-[min(82vw,19rem)] shrink-0 snap-start sm:w-auto`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">{card.title}</h3>
                <p
                  className={`mt-1 max-w-[14rem] text-xs leading-relaxed ${
                    'featured' in card && card.featured ? 'text-white/85' : 'text-slate-600'
                  }`}
                >
                  {card.description}
                </p>
              </div>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconStyle}`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
            {isComingSoon && (
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-wider text-blue-800">
                <Sparkles className="h-3 w-3" />
                Coming soon
              </span>
            )}
            <div className="toolkit-card__preview absolute -bottom-4 left-3 right-3 h-[13.5rem] overflow-hidden rounded-t-[22px] bg-white shadow-[0_-5px_22px_rgba(40,35,25,0.1)]">
              <Preview kind={card.kind} />
            </div>
          </div>
        );

        return (
          <ScrollReveal
            key={`${card.title}-${index}`}
            delay={index * 100}
            className="shrink-0 sm:shrink"
          >
            {isComingSoon ? (
              <div tabIndex={0} className="rounded-[30px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                {cardContent}
              </div>
            ) : (
              <Link href={card.href} aria-label={`Open ${card.title}`} className="block rounded-[30px]">
                {cardContent}
                <span className="sr-only">Open {card.title}</span>
              </Link>
            )}
          </ScrollReveal>
        );
      })}
    </div>
  </section>
);
