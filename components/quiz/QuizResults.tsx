'use client';

import React, { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { CheckCircle2, ChevronDown, RotateCcw, Sparkles, Trophy, XCircle } from 'lucide-react';
import { Confetti } from '@/components/shared/Confetti';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';

interface QuizResultsProps {
  questions: QuizQuestionType[];
  userAnswers: Record<string, number>;
  documentTitle?: string;
  onRetry: () => void;
  onGenerateNew: () => void;
  isGeneratingNew?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  documentTitle,
  onRetry,
  onGenerateNew,
  isGeneratingNew = false,
}) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  const totalQuestions = questions.length;
  const correctCount = questions.reduce(
    (count, question) =>
      count + (userAnswers[question.id] === question.correctAnswer ? 1 : 0),
    0
  );
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const prefersReducedMotion = usePrefersReducedMotion();
  const animatedCorrectCount = useAnimatedNumber(correctCount, {
    duration: 800,
    reducedMotion: prefersReducedMotion,
  });

  const scoreMessage =
    accuracy >= 80
      ? 'Excellent work. You have a strong grasp of this material.'
      : accuracy >= 60
        ? 'Nice work. You are building a solid understanding.'
        : 'Keep going. Reviewing these answers is a great next step.';

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 py-6 sm:py-8">
      {!prefersReducedMotion && accuracy >= 60 && (
        <Confetti burst={accuracy === 100 ? 'large' : 'standard'} />
      )}
      <section className="relative z-10 rounded-2xl border border-card-border bg-surface p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent-strong">
          <Trophy aria-hidden="true" className="h-7 w-7" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-accent-strong">
          Quiz complete
        </p>
        <h1 className="quiz-results-heading mt-2 break-words text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {documentTitle || 'Your results'}
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
          {scoreMessage}
        </p>

        <div className="mx-auto mt-7 flex max-w-sm flex-col items-center rounded-2xl border border-card-border bg-surface-raised p-5">
          <span className="text-4xl font-extrabold tracking-tight text-foreground">
            {animatedCorrectCount} of {totalQuestions}
          </span>
          <span className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">
            Correct
          </span>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Retry quiz
          </button>
          <button
            type="button"
            onClick={onGenerateNew}
            disabled={isGeneratingNew}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-card-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Generate new quiz
          </button>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden rounded-2xl border border-card-border bg-surface">
        <button
          type="button"
          aria-expanded={reviewOpen}
          aria-controls="quiz-review-list"
          onClick={() => setReviewOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-strong sm:p-6"
        >
          <span>
            <span className="block text-base font-bold text-foreground">Review answers</span>
            <span className="mt-1 block text-xs text-muted">
              Revisit each question, your answer, and the explanation.
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 text-muted transition-transform ${
              reviewOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          id="quiz-review-list"
          hidden={!reviewOpen}
          className="space-y-3 border-t border-card-border p-4 sm:p-5"
        >
          {questions.map((question, index) => {
            const chosenOption = userAnswers[question.id];
            const isCorrect = chosenOption === question.correctAnswer;

            return (
              <article
                key={question.id}
                className="rounded-xl border border-card-border bg-surface-raised p-4"
              >
                <h3 className="text-sm font-bold leading-relaxed text-foreground">
                  {index + 1}. {question.question}
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <p
                    className={`flex items-start gap-2 ${
                      isCorrect
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <span>
                      Your answer:{' '}
                      <strong>
                        {chosenOption === undefined
                          ? 'Not answered'
                          : question.options[chosenOption] || 'Unknown option'}
                      </strong>
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Correct answer:{' '}
                      <strong>{question.options[question.correctAnswer]}</strong>
                    </span>
                  </p>
                </div>
                <p className="mt-3 border-t border-card-border pt-3 text-sm leading-relaxed text-muted">
                  {question.explanation}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <style jsx>{`
        .quiz-results-heading {
          animation: quiz-results-fade-up 400ms ease-out both;
        }
        @keyframes quiz-results-fade-up {
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
          .quiz-results-heading {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
