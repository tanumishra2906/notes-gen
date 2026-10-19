'use client';

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  FileText,
  Grid2X2,
  Layers,
  List,
  LoaderCircle,
  Search,
  Trash2,
} from 'lucide-react';
import { useStudy } from '@/context/StudyContext';
import { downloadStudyNotesPdf } from '@/utils/exportNotesPdf';
import type { StudyContent } from '@/types/study';
import { DashboardBackdrop } from '@/components/dashboard/DashboardBackdrop';

type SortOrder = 'newest' | 'oldest' | 'name';
type LibraryView = 'grid' | 'list';

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function formatDate(date: string): string {
  return DATE_FORMATTER.format(new Date(date));
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function subscribeToClock(onChange: () => void): () => void {
  const intervalId = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(intervalId);
}

function getClientGreeting(): string {
  return getGreeting(new Date().getHours());
}

function getServerGreeting(): string {
  return 'Good morning';
}

export default function DashboardPage() {
  const router = useRouter();
  const greeting = useSyncExternalStore(
    subscribeToClock,
    getClientGreeting,
    getServerGreeting
  );
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [libraryView, setLibraryView] = useState<LibraryView>('grid');
  const [downloadingDocumentIds, setDownloadingDocumentIds] = useState<string[]>([]);
  const [downloadErrors, setDownloadErrors] = useState<Record<string, string>>({});
  const [selectionErrors, setSelectionErrors] = useState<Record<string, string>>({});
  const [deleteErrors, setDeleteErrors] = useState<Record<string, string>>({});
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<string[]>([]);
  const [deletingDocumentIds, setDeletingDocumentIds] = useState<string[]>([]);
  const {
    studyData,
    documentId,
    savedDocuments,
    documentsLoading,
    selectingDocumentId,
    flashcards,
    quizQuestions,
    selectDocument,
    deleteDocument,
  } = useStudy();

  const activeDocument = savedDocuments.find((document) => document.id === documentId);
  const hasActiveContent = Boolean(activeDocument && studyData);
  const filteredDocuments = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const documents = savedDocuments.filter((document) =>
      document.title.toLowerCase().includes(searchTerm)
    );

    return documents.sort((first, second) => {
      if (sortOrder === 'name') return first.title.localeCompare(second.title);
      const dateDifference =
        new Date(first.created_at).getTime() - new Date(second.created_at).getTime();
      return sortOrder === 'newest' ? -dateDifference : dateDifference;
    });
  }, [savedDocuments, search, sortOrder]);

  const isDeletingDocument = (id: string) => deletingDocumentIds.includes(id);

  const handleOpenDocument = async (id: string, destination = '/notes') => {
    if (isDeletingDocument(id)) return;

    setSelectionErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    if (await selectDocument(id)) {
      router.push(destination);
    } else {
      setSelectionErrors((current) => ({
        ...current,
        [id]: 'Could not open this document. Please try again.',
      }));
    }
  };

  const handleDownloadDocument = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    title: string
  ) => {
    event.stopPropagation();
    if (isDeletingDocument(id)) return;

    setDownloadingDocumentIds((current) =>
      current.includes(id) ? current : [...current, id]
    );
    setDownloadErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    try {
      const response = await fetch(`/api/documents/${encodeURIComponent(id)}`);
      const result = await response.json();
      const studyContent = result?.data?.study_content as StudyContent | undefined;
      if (!response.ok || !result?.success || !studyContent) {
        throw new Error('Could not download this document. Please try again.');
      }

      await downloadStudyNotesPdf(studyContent, title);
    } catch {
      setDownloadErrors((current) => ({
        ...current,
        [id]: 'Could not download this document. Please try again.',
      }));
    } finally {
      setDownloadingDocumentIds((current) => current.filter((itemId) => itemId !== id));
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setDeleteErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setConfirmDeleteIds((current) => current.filter((documentId) => documentId !== id));
    setDeletingDocumentIds((current) =>
      current.includes(id) ? current : [...current, id]
    );

    try {
      if (!(await deleteDocument(id))) {
        setDeleteErrors((current) => ({
          ...current,
          [id]: 'Could not delete this document. Please try again.',
        }));
      }
    } finally {
      setDeletingDocumentIds((current) =>
        current.filter((documentId) => documentId !== id)
      );
    }
  };

  const latestUpload = savedDocuments.reduce<string | null>(
    (latest, document) =>
      !latest || new Date(document.created_at).getTime() > new Date(latest).getTime()
        ? document.created_at
        : latest,
    null
  );

  return (
    <div className="relative isolate mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <DashboardBackdrop />
      <div className="relative z-10 space-y-8">
        <header className="space-y-5 border-b border-card-border pb-6">
          <div className="animate-dashboard-heading">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {greeting}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {savedDocuments.length} documents saved
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search documents by title</span>
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search documents..."
                className="h-11 w-full rounded-xl border border-card-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
              />
            </label>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <label className="relative">
                <span className="sr-only">Sort documents</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                  className="h-11 appearance-none rounded-xl border border-card-border bg-surface py-2 pl-3 pr-9 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">Name (A-Z)</option>
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                />
              </label>

              <div
                aria-label="Document layout"
                className="inline-flex rounded-xl border border-card-border bg-surface p-1"
                role="group"
              >
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={libraryView === 'grid'}
                  onClick={() => setLibraryView('grid')}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
                    libraryView === 'grid'
                      ? 'bg-accent/20 text-foreground'
                      : 'text-muted hover:bg-surface-raised'
                  }`}
                >
                  <Grid2X2 aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={libraryView === 'list'}
                  onClick={() => setLibraryView('list')}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong ${
                    libraryView === 'list'
                      ? 'bg-accent/20 text-foreground'
                      : 'text-muted hover:bg-surface-raised'
                  }`}
                >
                  <List aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Study summary" className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-card-border bg-surface p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Documents</h2>
            <p className="mt-2 text-2xl font-extrabold text-foreground">
              {savedDocuments.length}
            </p>
            <p className="mt-1 text-xs text-muted">
              {latestUpload ? `Latest upload ${formatDate(latestUpload)}` : 'No uploads yet'}
            </p>
          </article>
          <article className="rounded-2xl border border-card-border bg-surface p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Notes</h2>
            {hasActiveContent && studyData ? (
              <p className="mt-2 text-sm leading-6 text-foreground">
                {studyData.keyConcepts?.length ?? 0} key concepts
                <span className="text-muted"> · </span>
                {studyData.definitions?.length ?? 0} definitions
                <span className="text-muted"> · </span>
                {studyData.importantFacts?.length ?? 0} facts
                <span className="text-muted"> · </span>
                {studyData.formulas?.length ?? 0} formulas
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">Open a document to see its notes.</p>
            )}
            {hasActiveContent && <p className="mt-1 text-xs text-muted">Active document</p>}
          </article>
          <article className="rounded-2xl border border-card-border bg-surface p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              Study material
            </h2>
            {hasActiveContent ? (
              <p className="mt-2 text-sm leading-6 text-foreground">
                {flashcards?.length ?? 0} flashcards
                <span className="text-muted"> · </span>
                {quizQuestions?.length ?? 0} quiz questions
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">
                Open a document to see its study material.
              </p>
            )}
            {hasActiveContent && <p className="mt-1 text-xs text-muted">Active document</p>}
          </article>
        </section>

        {activeDocument && (
          <section
            aria-labelledby="currently-open-heading"
            className="overflow-hidden rounded-2xl border border-card-border bg-surface"
          >
            <div className="grid gap-5 p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_12rem] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-strong">
                  Currently open
                </p>
                <h2
                  id="currently-open-heading"
                  className="mt-2 break-words text-xl font-extrabold text-foreground sm:text-2xl"
                >
                  {activeDocument.title}
                </h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  Added {formatDate(activeDocument.created_at)}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                  <span>{studyData?.keyConcepts?.length ?? 0} key concepts</span>
                  <span>{flashcards?.length ?? 0} flashcards</span>
                  <span>{quizQuestions?.length ?? 0} quiz questions</span>
                </div>

                <nav aria-label="Currently open document actions" className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/notes"
                    className="rounded-lg bg-accent px-3.5 py-2 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    Open Notes
                  </Link>
                  <Link
                    href="/flashcards"
                    className="rounded-lg border border-card-border px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    Flashcards
                  </Link>
                  <Link
                    href="/quiz"
                    className="rounded-lg border border-card-border px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    Take Quiz
                  </Link>
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 rounded-lg border border-card-border px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    Chat with AI
                    <span className="rounded-full bg-surface-raised px-1.5 py-0.5 text-[10px] font-bold text-muted">
                      Soon
                    </span>
                  </Link>
                </nav>
              </div>

              <StudyIllustration />
            </div>
          </section>
        )}

        <section aria-labelledby="documents-heading" className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="documents-heading" className="text-xl font-extrabold text-foreground">
              Your documents
            </h2>
            <span className="text-sm text-muted">
              {savedDocuments.length} {savedDocuments.length === 1 ? 'document' : 'documents'}
            </span>
          </div>

          {documentsLoading ? (
            <div
              aria-label="Loading saved documents"
              className={`grid gap-4 ${
                libraryView === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : ''
              }`}
            >
              {[0, 1, 2].map((placeholder) => (
                <div
                  key={`document-skeleton-${placeholder}`}
                  className="h-36 rounded-2xl border border-card-border bg-surface/70"
                />
              ))}
            </div>
          ) : (
            <>
              {savedDocuments.length === 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <UploadTile />
                </div>
              ) : (
                <>
                  {filteredDocuments.length === 0 && (
                    <p className="rounded-2xl border border-card-border bg-surface p-6 text-center text-sm text-muted">
                      No documents match “{search.trim()}”.
                    </p>
                  )}
                  <div
                    className={`grid gap-4 ${
                      libraryView === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : ''
                    }`}
                  >
                    {filteredDocuments.map((document) => {
                      const isActive = document.id === documentId;
                      const isLoading = document.id === selectingDocumentId;
                      const isDownloading = downloadingDocumentIds.includes(document.id);
                      const isDeleting = isDeletingDocument(document.id);
                      const isBusy = isDeleting || isLoading || isDownloading;

                      return (
                        <article
                          key={document.id}
                          className={`min-w-0 rounded-2xl border bg-surface p-4 transition-colors ${
                            libraryView === 'list'
                              ? 'sm:flex sm:items-center sm:gap-5'
                              : 'flex flex-col'
                          } ${
                            isActive
                              ? 'border-accent bg-accent/5'
                              : 'border-card-border hover:border-accent/50'
                          }`}
                        >
                          <div
                            className={`min-w-0 ${
                              libraryView === 'list'
                                ? 'flex flex-1 items-center gap-4'
                                : 'flex items-start gap-3'
                            }`}
                          >
                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
                              <FileText aria-hidden="true" className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => void handleOpenDocument(document.id)}
                                  disabled={isBusy}
                                  aria-label={`Open ${document.title} in notes`}
                                  className="max-w-full truncate text-left text-sm font-bold text-foreground hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-60"
                                >
                                  {document.title}
                                </button>
                                {isActive && (
                                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-foreground">
                                    <Check aria-hidden="true" className="h-3 w-3" />
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted">
                                <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                                Added {formatDate(document.created_at)}
                              </p>
                            </div>
                            {isLoading && (
                              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-muted">
                                <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                                Opening
                              </span>
                            )}
                          </div>

                          <div
                            className={`mt-4 flex flex-wrap items-center justify-between gap-3 ${
                              libraryView === 'list' ? 'sm:mt-0 sm:justify-end' : ''
                            }`}
                          >
                            <nav
                              aria-label={`Study actions for ${document.title}`}
                              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold"
                            >
                              {[
                                { label: 'Notes', href: '/notes' },
                                { label: 'Cards', href: '/flashcards' },
                                { label: 'Quiz', href: '/quiz' },
                              ].map(({ label, href }) => (
                                <button
                                  key={`${document.id}-${label}`}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    void handleOpenDocument(document.id, href);
                                  }}
                                  disabled={isBusy}
                                  className="rounded-sm text-muted underline-offset-4 hover:text-accent-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-50"
                                >
                                  {label}
                                </button>
                              ))}
                            </nav>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(event) =>
                                  void handleDownloadDocument(event, document.id, document.title)
                                }
                                disabled={isBusy}
                                aria-label={`Download PDF for ${document.title}`}
                                title="Download PDF"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-card-border text-muted transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isDownloading ? (
                                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download aria-hidden="true" className="h-4 w-4" />
                                )}
                              </button>

                              {confirmDeleteIds.includes(document.id) ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-muted">Delete?</span>
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteDocument(document.id)}
                                    disabled={isBusy}
                                    className="rounded-lg bg-red-600 px-2.5 py-2 text-xs font-bold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setConfirmDeleteIds((current) =>
                                        current.filter((id) => id !== document.id)
                                      )
                                    }
                                    disabled={isBusy}
                                    className="rounded-lg border border-card-border px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setConfirmDeleteIds((current) =>
                                      current.includes(document.id)
                                        ? current
                                        : [...current, document.id]
                                    );
                                  }}
                                  disabled={isBusy}
                                  aria-label={`Delete ${document.title}`}
                                  title="Delete document"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-card-border text-muted transition-colors hover:bg-surface-raised hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isDeleting ? (
                                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {(selectionErrors[document.id] ||
                            downloadErrors[document.id] ||
                            deleteErrors[document.id]) && (
                            <p role="alert" className="mt-3 text-xs text-red-600 dark:text-red-400">
                              {selectionErrors[document.id] ||
                                downloadErrors[document.id] ||
                                deleteErrors[document.id]}
                            </p>
                          )}
                        </article>
                      );
                    })}
                    <UploadTile />
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </div>
      <style jsx>{`
        .animate-dashboard-heading {
          animation: dashboard-heading-reveal 420ms ease-out both;
        }

        @keyframes dashboard-heading-reveal {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-dashboard-heading {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function UploadTile() {
  return (
    <Link
      href="/upload"
      className="flex min-h-36 flex-col justify-center rounded-2xl border border-dashed border-card-border bg-surface/60 p-5 transition-colors hover:border-accent hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
        <Layers aria-hidden="true" className="h-4 w-4" />
      </span>
      <span className="mt-3 text-sm font-bold text-foreground">Upload New Document</span>
      <span className="mt-1 text-xs leading-relaxed text-muted">
        Upload a PDF to create notes, flashcards and a quiz.
      </span>
    </Link>
  );
}

function StudyIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="mx-auto h-36 w-48 text-accent-strong/70"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 192 144"
    >
      <path d="M26 104h74v10H26zM32 91h68v13H32zM39 78h61v13H39z" />
      <path d="M42 84h34m-27 13h41m-49 13h45" />
      <path d="m116 104 35-58 9 5-35 58-12 6 3-11Z" />
      <path d="m148 52 9 5" />
      <path d="M139 41c0-9 7-16 16-16s16 7 16 16c0 6-3 10-7 14-2 2-3 5-3 8h-12c0-3-1-6-3-8-4-4-7-8-7-14Z" />
      <path d="M150 68h10m-8 5h6m-3-51v-6m-21 13-4-4m42 4 4-4m-45 22h-6m52 0h-6" />
      <path d="M19 121h151" strokeDasharray="3 5" />
    </svg>
  );
}
