'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { QuizQuestion } from './QuizQuestion';
import { QuizOption } from './QuizOption';
import { QuizProgress } from './QuizProgress';
import { QuizResults } from './QuizResults';
import { BrainCircuit, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 mb-2">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI Quiz Laboratory</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Quiz Time! 🧠
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Let's see how much you really remember from your study notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Generate New Quiz</span>
          </button>
        </div>
      </div>

      {/* Progress & Sidebar Metrics */}
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
      />

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xl shadow-yellow-500/5 space-y-6">
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Answer Options */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((optionText, idx) => {
            const letter = OPTION_LETTERS[idx] || `${idx + 1}`;
            const isSelected = currentSelectedOption === idx;
            const isCorrectAnswer = idx === currentQuestion.correctAnswer;

            return (
              <QuizOption
                key={idx}
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

        {/* Answer Explanation Box (Revealed after submission) */}
        {isCurrentSubmitted && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <span className="text-lg">💡</span>
              <span>Explanation</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {!isCurrentSubmitted
              ? 'Select an option and submit your answer'
              : isLastQuestion
              ? 'Final question completed'
              : 'Proceed to next question'}
          </span>

          {!isCurrentSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={currentSelectedOption === undefined}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 transition-all cursor-pointer active:scale-95"
            >
              <span>{isLastQuestion ? 'View Final Results 🎉' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
