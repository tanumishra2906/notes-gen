import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="w-full rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/40 p-5 shadow-sm backdrop-blur-sm transition-all animate-in fade-in-50 slide-in-from-bottom-2">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-2 text-red-600 dark:text-red-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-red-900 dark:text-red-200">Unable to Process Document</h4>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm shrink-0 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
