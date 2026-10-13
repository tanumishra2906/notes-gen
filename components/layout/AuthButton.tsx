'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStudy } from '@/context/StudyContext';

export function AuthButton() {
  const router = useRouter();
  const { isAuthenticated, authLoaded } = useStudy();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogout = async () => {
    setAuthError(null);
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(error.message);
        return;
      }

      router.replace('/login');
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : 'Unable to log out. Please try again.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!authLoaded) {
    return (
      <div className="flex flex-col items-end gap-1" aria-hidden="true">
        <div className="h-8 w-[168px] rounded-full bg-slate-200 dark:bg-slate-800 sm:h-9" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-900/10 transition-all duration-200 hover:bg-accent-hover active:scale-95 sm:text-sm"
        >
          <User className="w-4 h-4 stroke-[2.5]" />
          <span>Login / Sign Up</span>
        </Link>
        {authError && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {authError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-900/10 transition-all duration-200 hover:bg-accent-hover active:scale-95 disabled:opacity-50 sm:text-sm"
      >
        <LogOut className="w-4 h-4 stroke-[2.5]" />
        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
      </button>
      {authError && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {authError}
        </p>
      )}
    </div>
  );
}
