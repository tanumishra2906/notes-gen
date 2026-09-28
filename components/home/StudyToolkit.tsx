'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, MessageSquare, Layers, BrainCircuit, ArrowUpRight } from 'lucide-react';

const TOOLKIT_CARDS = [
  {
    title: 'Summarize',
    description: 'Get the important points instantly.',
    icon: FileText,
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    accentColor: 'group-hover:border-purple-400/50',
    glowColor: 'group-hover:shadow-purple-500/10',
    href: '/notes',
    tag: 'Active',
  },
  {
    title: 'Chat with AI',
    description: 'Revise the essentials at a glance.',
    icon: MessageSquare,
    iconBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    accentColor: 'group-hover:border-pink-400/50',
    glowColor: 'group-hover:shadow-pink-500/10',
    href: '/chat',
    tag: 'Preview',
  },
  {
    title: 'Flashcards',
    description: 'Turn concepts into quick revision.',
    icon: Layers,
    iconBg: 'bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border-yellow-400/20',
    accentColor: 'group-hover:border-yellow-400/50',
    glowColor: 'group-hover:shadow-yellow-500/10',
    href: '/flashcards',
    tag: 'Preview',
  },
  {
    title: 'Quiz Mode',
    description: 'Test yourself and track your score.',
    icon: BrainCircuit,
    iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    accentColor: 'group-hover:border-teal-400/50',
    glowColor: 'group-hover:shadow-teal-500/10',
    href: '/quiz',
    tag: 'Preview',
  },
];

export const StudyToolkit: React.FC = () => {
  return (
    <section id="instant-study-toolkit" className="py-12 scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-black tracking-widest uppercase text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
          INSTANT STUDY TOOLKIT
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything you need to master your subject
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Transform any textbook chapter or notes document into interactive AI study tools.
        </p>
      </div>

      {/* 4 Toolkit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {TOOLKIT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${card.accentColor} ${card.glowColor}`}
            >
              <div className="space-y-4">
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.iconBg}`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {card.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors flex items-center gap-1">
                    <span>{card.title}</span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Hint */}
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                <span>Explore tool</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-yellow-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
