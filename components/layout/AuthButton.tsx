'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          setAuthError(error.message);
          return;
        }

        setUser(user);
      } catch (error: unknown) {
        setAuthError(
          error instanceof Error
            ? error.message
            : 'Unable to check your sign-in status.'
        );
      }
    };

    void getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setAuthError(null);
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(error.message);
        return;
      }

      window.location.href = '/login';
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : 'Unable to log out. Please try again.'
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
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
        className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
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
