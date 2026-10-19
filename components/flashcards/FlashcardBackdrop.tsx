import React from 'react';

const CIRCLES = [
  'left-0 top-[5%] h-16 w-16 bg-amber-300/10 dark:bg-yellow-300/10',
  'right-0 top-[19%] h-16 w-16 bg-violet-300/10 dark:bg-violet-300/10',
  'left-0 top-[40%] h-16 w-16 bg-amber-300/10 dark:bg-yellow-300/10',
  'right-0 top-[59%] h-16 w-16 bg-emerald-300/10 dark:bg-emerald-300/10',
  'left-0 bottom-[5%] h-16 w-16 bg-violet-300/10 dark:bg-violet-300/10',
  'right-0 bottom-[7%] h-16 w-16 bg-amber-300/10 dark:bg-yellow-300/10',
];

export function FlashcardBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-screen -translate-x-1/2 select-none xl:block"
    >
      {CIRCLES.map((className, index) => (
        <span
          key={`flashcard-circle-${index}`}
          className={`flashcard-backdrop-drift absolute rounded-full ${className}`}
          style={{ animationDuration: `${10 + index % 5}s`, animationDelay: `${-index * 1.5}s` }}
        />
      ))}
      <svg
        className="flashcard-backdrop-drift absolute left-2 top-[12%] h-11 w-12 text-slate-500 opacity-[0.16] dark:text-slate-300"
        style={{ animationDuration: '11s', animationDelay: '-2s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        viewBox="0 0 100 70"
      >
        <path d="M50 20c-10-6-25-6-40-2v40c15-4 30-4 40 2 10-6 25-6 40-2V18c-15-4-30-4-40 2Z" />
        <path d="M50 20v40M20 28h22m16 0h22M20 38h20m18 0h20" />
      </svg>
      <svg
        className="flashcard-backdrop-drift absolute right-2 top-[8%] h-11 w-11 text-slate-500 opacity-[0.18] dark:text-slate-300"
        style={{ animationDuration: '13s', animationDelay: '-5s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 80 80"
      >
        <path d="M40 16c-12 0-18 10-16 21 1 7 8 12 8 18h16c0-6 7-11 8-18 2-11-4-21-16-21Z" />
        <path d="M33 59h14m-11 5h8m-4-53V7m-23 9-4-4m54 4 4-4M9 37h7m48 0h7" />
      </svg>
      <svg
        className="flashcard-backdrop-drift absolute left-2 top-[30%] h-10 w-12 text-slate-500 opacity-[0.17] dark:text-slate-300"
        style={{ animationDuration: '12s', animationDelay: '-7s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 80 80"
      >
        <path d="m19 60 35-43 7 6-35 43-11 5 4-11Z" />
        <path d="m51 21 7 6M19 60l7 6" />
      </svg>
      <svg
        className="flashcard-backdrop-drift absolute right-2 top-[34%] h-12 w-12 text-slate-500 opacity-[0.16] dark:text-slate-300"
        style={{ animationDuration: '14s', animationDelay: '-3s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
        viewBox="0 0 90 90"
      >
        <rect x="18" y="12" width="54" height="66" rx="3" />
        <path d="M29 12v66M38 30h24M38 42h20M38 54h24M38 66h16M8 26q5-8 10 0t10 0" />
      </svg>
      <svg
        className="flashcard-backdrop-drift absolute left-2 top-[54%] h-10 w-10 text-slate-500 opacity-[0.17] dark:text-slate-300"
        style={{ animationDuration: '10s', animationDelay: '-4s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 80 80"
      >
        <path d="M60 18H22l21 22-21 22h38" />
        <text x="39" y="14" fill="currentColor" stroke="none" fontSize="8">n=1</text>
        <text x="39" y="74" fill="currentColor" stroke="none" fontSize="9">∞</text>
      </svg>
      <svg
        className="flashcard-backdrop-drift absolute right-2 top-[66%] h-11 w-11 text-slate-500 opacity-[0.16] dark:text-slate-300"
        style={{ animationDuration: '13s', animationDelay: '-8s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
        viewBox="0 0 80 80"
      >
        <path d="M14 65h52L40 15 14 65Z" />
        <path d="M28 65a13 13 0 0 0 10-10M40 15v50" strokeDasharray="3 4" />
        <circle cx="40" cy="42" r="1.5" fill="currentColor" stroke="none" />
      </svg>
      <svg
        className="flashcard-backdrop-drift absolute left-2 bottom-[8%] h-10 w-12 text-slate-500 opacity-[0.17] dark:text-slate-300"
        style={{ animationDuration: '14s', animationDelay: '-6s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 90 60"
      >
        <path d="M8 32q9-18 18 0t18 0 18 0 18 0" />
      </svg>
      <style jsx>{`
        .flashcard-backdrop-drift {
          animation-name: flashcard-backdrop-drift;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes flashcard-backdrop-drift {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flashcard-backdrop-drift {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
