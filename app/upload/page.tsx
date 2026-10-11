'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStudy } from '@/context/StudyContext';
import { FileUploader } from '@/components/upload/FileUploader';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { ErrorAlert } from '@/components/shared/ErrorAlert';

export default function UploadPage() {
  const router = useRouter();
  const { status, errorMessage, handleProcessPdf, handleReset } = useStudy();
  const previousStatus = useRef(status);

  useEffect(() => {
    const wasProcessing =
      previousStatus.current === 'extracting' ||
      previousStatus.current === 'analyzing';
    previousStatus.current = status;

    if (status === 'success' && wasProcessing) {
      router.replace('/notes');
    }
  }, [router, status]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in-50 duration-300">
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Upload a PDF
        </h1>
      </div>

      {/* Dynamic Upload Views */}
      <div className="flex flex-col items-center justify-center py-2 sm:py-4">
        {(status === 'idle' || status === 'success') && (
          <div className="w-full">
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
      </div>
    </div>
  );
}
