'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Upload', href: '/upload' },
  { name: 'Notes', href: '/notes' },
  { name: 'Quiz', href: '/quiz' },
  { name: 'Flashcards', href: '/flashcards' },
  { name: 'Chat with AI', href: '/chat' },
  { name: 'Dashboard', href: '/dashboard' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-[#0B0F19]/40 backdrop-blur-sm z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-center py-2.5 space-x-1 sm:space-x-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  isActive
                    ? 'border border-yellow-400 dark:border-yellow-400 text-slate-900 dark:text-yellow-400 bg-yellow-400/15 dark:bg-yellow-400/10 font-bold shadow-[0_0_12px_rgba(250,204,21,0.2)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/40 font-medium'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Navbar Header */}
        <div className="md:hidden flex items-center justify-between py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Navigation
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1.5 border-t border-slate-200 dark:border-slate-800 animate-in fade-in-50 duration-200">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm rounded-xl font-medium transition-all ${
                    isActive
                      ? 'border border-yellow-400 text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};
