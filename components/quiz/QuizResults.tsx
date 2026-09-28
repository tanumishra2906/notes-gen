'use client';

import React from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { Trophy, CheckCircle2, XCircle, RotateCcw, Sparkles, BookOpen } from 'lucide-react';

interface QuizResultsProps {
  questions: QuizQuestionType[];
  userAnswers: Record<string, number>;
  onRetry: () => void;
  onGenerateNew: () => void;
  isGeneratingNew?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  onRetry,
  onGenerateNew,
  isGeneratingNew = false,
}) => {
  const totalQuestions = questions.length;
  let correctCount = 0;
  const incorrectQuestions: { question: QuizQuestionType; chosenOption: number }[] = [];

  questions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (selected === q.correctAnswer) {
      correctCount += 1;
    } else {
      incorrectQuestions.push({
        question: q,
        chosenOption: selected !== undefined ? selected : -1,
      });
    }
  });

  const incorrectCount = totalQuestions - correctCount;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const getScoreMessage = () => {
    if (accuracy >= 90) return 'Mastery Achieved! Exceptional performance! 🎉';
    if (accuracy >= 70) return 'Great Job! Solid understanding of the material. 👍';
    if (accuracy >= 50) return 'Good Effort! Review misanswered concepts for better retention. 💡';
    return 'Keep Practicing! Review your notes and try again. 📚';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in-50 duration-500">
      {/* Header Result Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md text-center space-y-6 shadow-xl shadow-yellow-500/5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <Trophy className="w-10 h-10 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-yellow-400/10 text-amber-700 dark:text-yellow-400 border border-yellow-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quiz Complete</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Results
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto">
            {getScoreMessage()}
          </p>
        </div>

        {/* Score Cards Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {correctCount} / {totalQuestions}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Final Score
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span className="text-2xl sm:text-3xl font-black">{correctCount}</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mt-1">
              Correct
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-yellow-400">
              {accuracy}%
            </span>
            <span className="text-[11px] font-semibold text-amber-800 dark:text-yellow-300 uppercase tracking-wider mt-1">
              Accuracy
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={onGenerateNew}
            disabled={isGeneratingNew}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-purple-500 ${isGeneratingNew ? 'animate-spin' : ''}`} />
            <span>Generate New Quiz</span>
          </button>
        </div>
      </div>

      {/* Review Areas (If any incorrect answers) */}
      {incorrectQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <h3>Areas for Review ({incorrectQuestions.length})</h3>
          </div>

          <div className="space-y-4">
            {incorrectQuestions.map(({ question: q, chosenOption }, idx) => (
              <div
                key={q.id || idx}
                className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-rose-500/20 backdrop-blur-md space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    Topic: {q.topic || 'General'}
                  </span>
                </div>

                <p className="font-bold text-slate-900 dark:text-white text-base">
                  {q.question}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  {chosenOption >= 0 && (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Your answer: <strong>{q.options[chosenOption]}</strong>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Correct answer: <strong>{q.options[q.correctAnswer]}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 leading-relaxed">
                  💡 <strong>Explanation:</strong> {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
