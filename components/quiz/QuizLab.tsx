'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { QuizQuestion } from './QuizQuestion';
import { QuizOption } from './QuizOption';
import { QuizProgress } from './QuizProgress';
import { QuizResults } from './QuizResults';
import { BrainCircuit, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { PageDoodles } from '@/components/shared/PageDoodles';

interface QuizLabProps {
  initialQuestions: QuizQuestionType[];
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export const QuizLab: React.FC<QuizLabProps> = ({
  initialQuestions,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [questions, setQuestions] = useState<QuizQuestionType[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sync questions when props update
  useEffect(() => {
    setQuestions(initialQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setSubmittedQuestions(new Set());
    setIsCompleted(false);
  }, [initialQuestions]);

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

  const handleSelectOption = (optionIndex: number) => {
    if (isCurrentSubmitted || !currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

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
    handleSubmitAnswer,
    handleNextQuestion,
  ]);

  if (isCompleted) {
    return (
      <QuizResults
        questions={questions}
        userAnswers={userAnswers}
        onRetry={handleRetry}
        onGenerateNew={onRegenerate}
        isGeneratingNew={isRegenerating}
      />
    );
  }

  if (!currentQuestion) return null;

  const isLastQuestion = currentIndex === questions.length - 1;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="study-page animate-in fade-in-50 duration-300">
      <PageDoodles />
      <header className="study-page__content flex flex-col justify-between gap-5 border-b border-card-border pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-label text-xs font-bold text-accent-strong">
            <BrainCircuit className="h-3.5 w-3.5" />
            Quiz
          </div>
          <h1 className="study-page__title font-extrabold tracking-tight text-foreground">Quiz Mode</h1>
          <p className="study-page__subtitle mt-2 text-muted">
            Answer each question and review your progress as you go.
          </p>
        </div>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-card-border bg-surface/80 px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-raised disabled:opacity-50"
        >
          <RotateCcw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Generate New Quiz</span>
        </button>
      </header>

      <div className="study-page__content grid flex-1 items-stretch gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(19rem,0.9fr)] xl:gap-7">
        <section className="flex min-h-[min(68svh,48rem)] flex-col rounded-[2rem] border border-card-border bg-card p-5 shadow-xl shadow-black/5 sm:p-8 xl:p-10">
          <div className="mb-7 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-muted">
              <span>Question progress</span>
              <span className="text-foreground">{currentIndex + 1} / {questions.length}</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-card-border"
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={questions.length}
            >
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />

          <div className="mt-7 grid gap-3 xl:mt-9 xl:grid-cols-2 xl:gap-4">
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
            <div className="mt-6 space-y-2 rounded-2xl border border-card-border bg-surface/80 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                {currentSelectedOption === currentQuestion.correctAnswer
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  : <span className="text-rose-500">×</span>}
                <span>{currentSelectedOption === currentQuestion.correctAnswer ? 'Correct answer' : 'Not quite'}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-4 border-t border-card-border pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
            <span className="text-sm font-medium text-muted">
              {!isCurrentSubmitted
                ? 'Select an option, then submit your answer.'
                : isLastQuestion
                  ? 'You have completed the final question.'
                  : 'Your answer is saved. Continue when ready.'}
            </span>
            {!isCurrentSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={currentSelectedOption === undefined}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-md shadow-amber-900/10 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit Answer</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-md shadow-amber-900/10 transition-colors hover:bg-accent-hover"
              >
                <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        <QuizProgress
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
        />
      </div>
    </div>
  );
};
