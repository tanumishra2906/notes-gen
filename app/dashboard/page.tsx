'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, FileText, LoaderCircle, Sparkles } from 'lucide-react';
import { useStudy } from '@/context/StudyContext';

export default function DashboardPage() {
  const {
    studyData,
    documentId,
    savedDocuments,
    documentsLoading,
    selectingDocumentId,
    selectDocument,
  } = useStudy();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border border-yellow-400/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Study Overview
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Study Desk Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of your active study materials and progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Document</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {studyData ? '1 PDF Loaded' : 'None'}
          </div>
          <p className="text-xs text-slate-500">
            {studyData ? 'Ready for study and revision' : 'Upload a PDF to get started'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Concepts</span>
          <div className="text-xl font-black text-purple-500 dark:text-purple-400">
            {studyData ? `${studyData.keyConcepts.length} Extracted` : '0'}
          </div>
          <p className="text-xs text-slate-500">Core study topics identified</p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Definitions & Formulas</span>
          <div className="text-xl font-black text-teal-500 dark:text-teal-400">
            {studyData ? `${studyData.definitions.length + studyData.formulas.length} Available` : '0'}
          </div>
          <p className="text-xs text-slate-500">Vocabulary & rules extracted</p>
        </div>
      </div>

      <section className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Saved Documents
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose a document to continue studying.
            </p>
          </div>
          {documentsLoading && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          )}
        </div>

        {savedDocuments.length > 0 ? (
          <div className="space-y-2">
            {savedDocuments.map((document) => {
              const isActive = document.id === documentId;
              const isLoading = document.id === selectingDocumentId;

              return (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => void selectDocument(document.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`w-full flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-colors ${
                    isActive
                      ? 'border-yellow-400 bg-yellow-400/10 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/30 hover:border-yellow-400/60 hover:bg-yellow-400/5'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                        {document.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(document.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </span>
                  </span>

                  <span className="shrink-0">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Loading
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Active
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        ) : documentsLoading ? (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading your saved study materials...
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              No saved documents yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload a PDF to create your first study guide.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 text-xs font-bold text-slate-950 transition-colors hover:bg-yellow-300"
            >
              <FileText className="h-4 w-4" />
              Upload Study Material
            </Link>
          </div>
        )}
      </section>

      <div className="p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/upload"
            className="px-6 py-3 text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 transition-all"
          >
            Upload New Material
          </Link>
          <Link
            href="/notes"
            className="px-6 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
          >
            View Study Notes
          </Link>
        </div>
      </div>
    </div>
  );
}
