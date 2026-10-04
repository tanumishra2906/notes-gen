'use client';

import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ProcessingStatus } from '@/types/study';
import { FileText, Cpu, CheckCircle2 } from 'lucide-react';

interface UploadProgressProps {
  status: ProcessingStatus;
}

export function UploadProgress({ status }: UploadProgressProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (status === 'extracting') {
      setCurrentStep(1);
    } else if (status === 'analyzing') {
      setCurrentStep(2);
    } else if (status === 'success') {
      setCurrentStep(3);
    }
  }, [status]);

  const steps = [
    { id: 1, name: 'Preparing PDF for Gemini', icon: FileText },
    { id: 2, name: 'Reading PDF and generating notes with Gemini AI', icon: Cpu },
    { id: 3, name: 'Generating Study Dashboard', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-2xl backdrop-blur-md text-center animate-in fade-in-50 zoom-in-95">
      <div className="mb-6 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Processing Study Material
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
        Gemini is reading the PDF, including its text and visual content...
      </p>

      {/* Steps List */}
      <div className="space-y-4 text-left">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                isCurrent
                  ? 'border-yellow-400/80 bg-yellow-400/10 text-slate-900 dark:text-yellow-400 font-semibold shadow-sm'
                  : isCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div
                className={`p-2 rounded-xl ${
                  isCurrent
                    ? 'bg-yellow-400 text-slate-950 animate-pulse'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>

              <span className="text-sm font-medium flex-1">{step.name}</span>

              {isCompleted && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Done</span>
              )}
              {isCurrent && (
                <span className="text-xs font-bold text-amber-600 dark:text-yellow-400 animate-pulse">
                  In progress...
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
