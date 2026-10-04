'use client';

import React from 'react';
import { useStudy } from '@/context/StudyContext';
import { FileUploader } from '@/components/upload/FileUploader';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
import { Upload, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
  const { status, studyData, pageCount, errorMessage, handleProcessPdf, handleReset } = useStudy();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Upload Page Banner Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-yellow-400/10 dark:bg-yellow-400/10 text-amber-700 dark:text-yellow-400 border border-yellow-400/30">
          <Upload className="w-4 h-4 text-yellow-500" />
          <span>PDF Study Material Processing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Upload Your Notes
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Drop your lecture slides, textbook chapter, or revision guide PDF below. Gemini AI will analyze it in seconds.
        </p>
      </div>

      {/* Dynamic Upload Views */}
      <div className="flex flex-col items-center justify-center py-4">
        {status === 'idle' && (
          <div className="w-full space-y-6">
            <FileUploader onProcessPdf={handleProcessPdf} />
          </div>
        )}

        {(status === 'extracting' || status === 'analyzing') && (
          <div className="w-full flex justify-center py-8">
            <UploadProgress status={status} />
          </div>
        )}

        {status === 'error' && (
          <div className="w-full max-w-2xl space-y-6">
            <ErrorAlert
              message={errorMessage || 'An error occurred while parsing the document.'}
              onRetry={handleReset}
            />
            <FileUploader onProcessPdf={handleProcessPdf} />
          </div>
        )}

        {status === 'success' && studyData && (
          <div className="w-full space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  PDF successfully processed & notes generated!
                  {pageCount !== null && ` (${pageCount} ${pageCount === 1 ? 'page' : 'pages'})`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-sm"
                >
                  <span>View Full Study Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <DashboardTabs data={studyData} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  );
}
