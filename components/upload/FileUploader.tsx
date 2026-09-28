'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Sparkles, AlertCircle } from 'lucide-react';
import { validatePdfFile } from '@/utils/validation';

interface FileUploaderProps {
  onProcessPdf: (file: File) => void;
  disabled?: boolean;
}

export function FileUploader({ onProcessPdf, disabled = false }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setValidationError(null);
    if (!selectedFile) return;

    const validation = validatePdfFile(selectedFile);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid PDF file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && !disabled) {
      onProcessPdf(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
          disabled={disabled}
        />

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-yellow-400 bg-yellow-400/10 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/60 hover:border-yellow-400/70 dark:hover:border-yellow-400/70 hover:bg-yellow-400/5'
            } backdrop-blur-md shadow-sm group`}
          >
            <div className="w-16 h-16 mb-4 rounded-2xl bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center group-hover:scale-110 border border-yellow-400/20 transition-transform duration-300">
              <Upload className="w-8 h-8 stroke-[2]" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
              Drag & Drop your PDF study notes here
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center">
              or <span className="text-yellow-600 dark:text-yellow-400 font-bold underline underline-offset-4">browse files</span> from your computer
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                PDF format only
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Max file size: 10MB
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Max ~30,000 characters
              </span>
            </div>
          </div>
        ) : (
          <div className="relative p-5 rounded-2xl border border-yellow-400/50 bg-white/90 dark:bg-slate-900/90 shadow-md backdrop-blur-md flex items-center justify-between gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0 border border-yellow-400/20">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={disabled}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {validationError && (
          <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 px-2 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {file && (
          <button
            type="submit"
            disabled={disabled}
            className="w-full py-4 px-6 rounded-full bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 text-slate-950 font-bold text-base shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
            <span>Generate Study Guide</span>
          </button>
        )}
      </form>
    </div>
  );
}
