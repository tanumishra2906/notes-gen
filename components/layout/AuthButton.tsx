'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AuthButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <User className="w-4 h-4 stroke-[2.5]" />
        <span>Login / Sign Up</span>
      </Link>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-yellow-400 dark:hover:bg-yellow-300 rounded-full shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
    >
      <LogOut className="w-4 h-4 stroke-[2.5]" />
      <span>Logout</span>
    </button>
  );
}
