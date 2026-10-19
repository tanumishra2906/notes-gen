'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { QuizQuestion } from './QuizQuestion';
import { QuizOption } from './QuizOption';
import { QuizProgress } from './QuizProgress';
import { QuizResults } from './QuizResults';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuizLabProps {
  initialQuestions: QuizQuestionType[];
  documentTitle?: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export const QuizLab: React.FC<QuizLabProps> = ({
  initialQuestions,
  documentTitle,
  onRegenerate,
  isRegenerating = false,
}) => {
  const questions = initialQuestions;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const currentQuestion = questions[currentIndex] || questions[0];
  const isCurrentSubmitted = currentQuestion ? submittedQuestions.has(currentQuestion.id) : false;
  const currentSelectedOption = currentQuestion ? userAnswers[currentQuestion.id] : undefined;

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  // Count metrics
  let correctCount = 0;
  let incorrectCount = 0;
  submittedQuestions.forEach((qId) => {
    const q = questions.find((item) => item.id === qId);
    if (q) {
      if (userAnswers[qId] === q.correctAnswer) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    }
  });

  let currentStreak = 0;
  for (let index = currentIndex; index >= 0; index -= 1) {
    const question = questions[index];
    if (!question || !submittedQuestions.has(question.id)) continue;
    if (userAnswers[question.id] !== question.correctAnswer) break;
    currentStreak += 1;
  }

  const handleSelectOption = useCallback((optionIndex: number) => {
    if (isCurrentSubmitted || !currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  }, [currentQuestion, isCurrentSubmitted]);

  const handleSubmitAnswer = useCallback(() => {
    if (!currentQuestion || currentSelectedOption === undefined || isCurrentSubmitted) return;
    setSubmittedQuestions((prev) => new Set(prev).add(currentQuestion.id));
  }, [currentQuestion, currentSelectedOption, isCurrentSubmitted]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentIndex, questions.length]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setUserAnswers({});
    setSubmittedQuestions(new Set());
    setIsCompleted(false);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (isCompleted || !currentQuestion) return;

      if (!isCurrentSubmitted) {
        if (['1', 'a', 'A'].includes(e.key) && currentQuestion.options.length > 0) {
          handleSelectOption(0);
        } else if (['2', 'b', 'B'].includes(e.key) && currentQuestion.options.length > 1) {
          handleSelectOption(1);
        } else if (['3', 'c', 'C'].includes(e.key) && currentQuestion.options.length > 2) {
          handleSelectOption(2);
        } else if (['4', 'd', 'D'].includes(e.key) && currentQuestion.options.length > 3) {
          handleSelectOption(3);
        } else if (e.key === 'Enter' && currentSelectedOption !== undefined) {
          e.preventDefault();
          handleSubmitAnswer();
        }
      } else {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCompleted,
    currentQuestion,
    isCurrentSubmitted,
    currentSelectedOption,
    handleSelectOption,
    handleSubmitAnswer,
    handleNextQuestion,
  ]);

  if (isCompleted) {
    return (
      <QuizResults
        questions={questions}
        userAnswers={userAnswers}
        documentTitle={documentTitle}
        onRetry={handleRetry}
        onGenerateNew={onRegenerate}
        isGeneratingNew={isRegenerating}
      />
    );
  }

  if (!currentQuestion) return null;

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 border-b border-card-border pb-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="quiz-heading-reveal text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {documentTitle || 'Your study quiz'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Test your understanding and review each answer as you go.
          </p>
        </div>
      </header>

      <div className="space-y-5">
        <section
          aria-label="Question progress"
          className="rounded-2xl border border-card-border bg-surface p-4 sm:p-5"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-bold text-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-medium text-muted">{correctCount} correct so far</span>
          </div>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(1.6rem,1fr))] gap-1.5 sm:gap-2"
            role="list"
            aria-label="Question answer status"
          >
            {questions.map((question, index) => {
              const wasAnswered = submittedQuestions.has(question.id);
              const isCorrect =
                wasAnswered && userAnswers[question.id] === question.correctAnswer;
              const isCurrent = index === currentIndex;
              const stateClass = wasAnswered
                ? isCorrect
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
                : isCurrent
                  ? 'bg-accent'
                  : 'bg-surface-raised';

              return (
                <span
                  key={question.id}
                  role="listitem"
                  aria-label={`Question ${index + 1}: ${
                    wasAnswered ? (isCorrect ? 'correct' : 'incorrect') : isCurrent ? 'current' : 'upcoming'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`h-2.5 min-w-0 rounded-full ${stateClass}`}
                />
              );
            })}
          </div>
        </section>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)] xl:gap-7">
          <div className="space-y-4">
            <section className="flex min-h-[min(68svh,46rem)] flex-col rounded-2xl border border-card-border bg-surface p-5 sm:p-7">
              <div className="mb-6">
                <QuizQuestion
                  question={currentQuestion}
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                />
              </div>

              <div className="grid gap-3">
                {currentQuestion.options.map((optionText, idx) => {
                  const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
                  const isSelected = currentSelectedOption === idx;
                  const isCorrectAnswer = idx === currentQuestion.correctAnswer;
                  return (
                    <QuizOption
                      key={`${currentQuestion.id}-${optionText}-${idx}`}
                      optionLetter={letter}
                      optionText={optionText}
                      isSelected={isSelected}
                      isSubmitted={isCurrentSubmitted}
                      isCorrectAnswer={isCorrectAnswer}
                      isUserSelection={isSelected}
                      onSelect={() => handleSelectOption(idx)}
                    />
                  );
                })}
              </div>

              {isCurrentSubmitted && (
                <div
                  role="status"
                  className={`mt-5 space-y-2 rounded-xl border p-4 ${
                    currentSelectedOption === currentQuestion.correctAnswer
                      ? 'border-emerald-500/25 bg-emerald-500/10'
                      : 'border-rose-500/25 bg-rose-500/10'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm font-bold ${
                      currentSelectedOption === currentQuestion.correctAnswer
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {currentSelectedOption === currentQuestion.correctAnswer ? (
                      <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                    ) : (
                      <span aria-hidden="true" className="text-lg leading-none">×</span>
                    )}
                    <span>
                      {currentSelectedOption === currentQuestion.correctAnswer
                        ? 'Correct answer'
                        : 'Not quite'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              <div className="mt-auto flex flex-col gap-4 border-t border-card-border pt-5 sm:flex-row sm:items-center sm:justify-end sm:pt-6">
                {!isCurrentSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={currentSelectedOption === undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-zinc-950 transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  >
                    <span>{isLastQuestion ? 'See results' : 'Next Question'}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </section>

            {currentStreak >= 2 && (
              <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {currentStreak} in a row
              </p>
            )}
          </div>

          <QuizProgress
            totalQuestions={questions.length}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
          />
        </div>
      </div>
      <style jsx>{`
        .quiz-heading-reveal {
          animation: quiz-heading-fade-up 400ms ease-out both;
        }

        @keyframes quiz-heading-fade-up {
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
          .quiz-heading-reveal {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
