'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lightbulb, Menu, Moon, Sun, X } from 'lucide-react';
import { useStudy } from '@/context/StudyContext';
import { useTheme } from '@/context/ThemeContext';
import { AuthButton } from './AuthButton';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, authLoaded } = useStudy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    ...(isAuthenticated
      ? [
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Upload', href: '/upload' },
          { name: 'Notes', href: '/notes' },
          { name: 'Quiz', href: '/quiz' },
          { name: 'Flashcards', href: '/flashcards' },
        ]
      : authLoaded
        ? [{ name: 'Login', href: '/login' }]
        : []),
  ];

  const navigation = (mobile = false) =>
    navItems.map((item) => {
      const isActive =
        item.href === '/'
          ? pathname === '/'
          : pathname.startsWith(item.href);

      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isActive ? 'page' : undefined}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            isActive
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-muted hover:bg-white/60 hover:text-foreground dark:hover:bg-slate-800/70'
          } ${mobile ? 'block w-full text-left' : ''}`}
        >
          {item.name}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-background/95">
      <div className="mx-auto grid min-h-[76px] max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" className="flex w-fit items-center gap-2.5" aria-label="StudyDesk home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-zinc-950 shadow-sm">
            <Lightbulb className="h-5 w-5 stroke-[2.5]" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Study<span className="text-accent-strong">Desk</span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-card-border bg-surface/75 p-1.5 shadow-sm lg:flex"
        >
          {navigation()}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-surface/75 text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="hidden sm:block">
            <AuthButton />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-surface/75 text-foreground lg:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-card-border bg-background/95 px-4 py-4 sm:px-6 lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col gap-1 rounded-2xl border border-card-border bg-surface/75 p-2"
          >
            {navigation(true)}
          </nav>
          <div className="mx-auto mt-3 max-w-7xl sm:hidden">
            <AuthButton />
          </div>
        </div>
      )}
    </header>
  );
};
