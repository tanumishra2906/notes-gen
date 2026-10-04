'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudyContent } from '@/types/study';
import { useStudy } from '@/context/StudyContext';
import { SummaryCard } from './SummaryCard';
import { KeyConceptsList } from './KeyConceptsList';
import { DefinitionsList } from './DefinitionsList';
import { FactsList } from './FactsList';
import { FormulasList } from './FormulasList';
import { BookOpen, Lightbulb, Type, ListChecks, Binary, ArrowLeft, Download, Layers, Sparkles, BrainCircuit } from 'lucide-react';
import { downloadStudyNotesPdf } from '@/utils/exportNotesPdf';

interface DashboardTabsProps {
  data: StudyContent;
  onReset: () => void;
}

export function DashboardTabs({ data, onReset }: DashboardTabsProps) {
  const router = useRouter();
  const {
    documentId,
    savedDocuments,
    flashcards,
    quizQuestions,
    handleGenerateFlashcards,
    handleGenerateQuiz,
  } = useStudy();
  const [activeTab, setActiveTab] = useState<'summary' | 'concepts' | 'definitions' | 'facts' | 'formulas'>('summary');
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const documentTitle = savedDocuments.find((document) => document.id === documentId)?.title;

  const handleCreateFlashcards = async () => {
    if (flashcards && flashcards.length > 0) {
      router.push('/flashcards');
      return;
    }
    setIsGeneratingFlashcards(true);
    await handleGenerateFlashcards();
    setIsGeneratingFlashcards(false);
    router.push('/flashcards');
  };

  const handleCreateQuiz = async () => {
    if (quizQuestions && quizQuestions.length > 0) {
      router.push('/quiz');
      return;
    }
    setIsGeneratingQuiz(true);
    await handleGenerateQuiz();
    setIsGeneratingQuiz(false);
    router.push('/quiz');
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpen, count: null },
    { id: 'concepts', label: 'Key Concepts', icon: Lightbulb, count: data.keyConcepts?.length || 0 },
    { id: 'definitions', label: 'Definitions', icon: Type, count: data.definitions?.length || 0 },
    { id: 'facts', label: 'Important Facts', icon: ListChecks, count: data.importantFacts?.length || 0 },
    { id: 'formulas', label: 'Formulas', icon: Binary, count: data.formulas?.length || 0 },
  ] as const;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in-50 duration-500">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-slate-200 dark:border-slate-800/80 backdrop-blur-md">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload another PDF</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateQuiz}
            disabled={isGeneratingQuiz}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 text-slate-950 transition-all shadow-md shadow-yellow-500/20 cursor-pointer disabled:opacity-50"
          >
            <BrainCircuit className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isGeneratingQuiz
                ? 'Generating Quiz...'
                : quizQuestions && quizQuestions.length > 0
                ? 'Take Quiz'
                : 'Generate Quiz'}
            </span>
          </button>

          <button
            onClick={handleCreateFlashcards}
            disabled={isGeneratingFlashcards}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span>
              {isGeneratingFlashcards
                ? 'Generating Cards...'
                : flashcards && flashcards.length > 0
                ? 'Study Flashcards'
                : 'Generate Flashcards'}
            </span>
          </button>

          <button
            onClick={() => downloadStudyNotesPdf(data, documentTitle)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-2 overflow-x-auto rounded-3xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border border-yellow-400 text-slate-900 dark:text-yellow-400 bg-yellow-400/15 dark:bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.15)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-yellow-400/20 text-yellow-700 dark:text-yellow-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[350px]">
        {activeTab === 'summary' && <SummaryCard summary={data.summary} />}
        {activeTab === 'concepts' && <KeyConceptsList concepts={data.keyConcepts || []} />}
        {activeTab === 'definitions' && <DefinitionsList definitions={data.definitions || []} />}
        {activeTab === 'facts' && <FactsList facts={data.importantFacts || []} />}
        {activeTab === 'formulas' && <FormulasList formulas={data.formulas || []} />}
      </div>
    </div>
  );
}
