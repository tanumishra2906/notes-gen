'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full border-t border-card-border bg-surface/55 py-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className="font-extrabold tracking-tight text-foreground">
          Study<span className="text-accent-strong">Desk</span>
        </Link>
        <span>© {new Date().getFullYear()} StudyDesk</span>
      </div>
    </footer>
  );
};
