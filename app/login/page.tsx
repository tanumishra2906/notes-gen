'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setMessage('');
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Account created! Check your email to verify your account.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        window.location.href = '/dashboard';
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Notes Gen
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {isSignup
            ? 'Create your account to get started.'
            : 'Login to continue to your study desk.'}
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
          />

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold transition-all disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Create Account'
                : 'Login'}
          </button>

          {message && (
            <p className="text-sm text-center text-slate-500">
              {message}
            </p>
          )}

          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage('');
            }}
            className="w-full text-sm text-purple-500 hover:text-purple-400"
          >
            {isSignup
              ? 'Already have an account? Login'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}