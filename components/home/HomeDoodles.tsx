import React from 'react';

export function HomeDoodles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden select-none overflow-hidden md:block"
    >
      <svg
        className="home-doodle absolute left-[3%] top-[8%] h-16 w-16 text-slate-500 opacity-[0.18] dark:text-slate-300"
        style={{ animationDuration: '9s', animationDelay: '-1s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
        viewBox="0 0 100 100"
        focusable="false"
      >
        <path d="M50 20c-15 0-22 12-20 25 2 9 10 15 10 23h20c0-8 8-14 10-23 2-13-5-25-20-25Z" />
        <path d="M42 74h16m-13 6h10m-7 6h4M50 10v4M24 22l4 3m48-3-4 3m-56 20h5m63 0h-5M45 48c0-6 10-6 10-12" />
      </svg>

      <svg
        className="home-doodle absolute right-[4%] top-[28%] h-[4.5rem] w-[4.5rem] text-slate-500 opacity-[0.16] dark:text-slate-300"
        style={{ animationDuration: '11s', animationDelay: '-4s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        viewBox="0 0 120 120"
        focusable="false"
      >
        <rect x="25" y="15" width="70" height="90" rx="3" />
        <line x1="38" y1="15" x2="38" y2="105" strokeDasharray="2 3" />
        <line x1="48" y1="35" x2="80" y2="35" />
        <line x1="48" y1="50" x2="75" y2="50" />
        <line x1="48" y1="65" x2="82" y2="65" />
        <line x1="48" y1="80" x2="68" y2="80" />
        <path d="M8 75q6-10 12 0t12 0" />
      </svg>

      <svg
        className="home-doodle absolute left-[5%] top-[52%] h-16 w-16 text-slate-500 opacity-[0.16] dark:text-slate-300"
        style={{ animationDuration: '10s', animationDelay: '-6s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        viewBox="0 0 100 100"
        focusable="false"
      >
        <polygon points="20,80 80,80 50,20" />
        <path d="M35 80a15 15 0 0 0 10-10" />
        <circle cx="50" cy="50" r="1.5" fill="currentColor" stroke="none" />
        <line x1="50" y1="20" x2="50" y2="80" strokeDasharray="3 3" />
      </svg>

      <svg
        className="home-doodle absolute right-[5%] top-[70%] h-16 w-16 text-slate-500 opacity-[0.18] dark:text-slate-300"
        style={{ animationDuration: '12s', animationDelay: '-3s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
        viewBox="0 0 80 80"
        focusable="false"
      >
        <path d="M60 20H25l20 20-20 20h35" />
        <text x="38" y="15" fill="currentColor" stroke="none" fontSize="10">
          n=1
        </text>
        <text x="38" y="74" fill="currentColor" stroke="none" fontSize="10">
          ∞
        </text>
      </svg>

      <svg
        className="home-doodle absolute bottom-[4%] left-[4%] h-14 w-20 text-slate-500 opacity-[0.16] dark:text-slate-300"
        style={{ animationDuration: '8s', animationDelay: '-2s' }}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        viewBox="0 0 100 70"
        focusable="false"
      >
        <path d="M50 20c-10-6-25-6-40-2v40c15-4 30-4 40 2 10-6 25-6 40-2V18c-15-4-30-4-40 2Z" />
        <line x1="50" y1="20" x2="50" y2="60" />
        <line x1="20" y1="28" x2="42" y2="28" />
        <line x1="20" y1="38" x2="40" y2="38" />
        <line x1="58" y1="28" x2="80" y2="28" />
        <line x1="58" y1="38" x2="78" y2="38" />
      </svg>
      <style jsx>{`
        .home-doodle {
          animation-name: home-doodle-float;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @keyframes home-doodle-float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(2deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-doodle {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
