'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

const THEME_CHANGE_EVENT = 'studydesk-theme-change';

const getThemeSnapshot = (): Theme =>
  typeof window !== 'undefined' && localStorage.getItem('studydesk_theme') === 'dark'
    ? 'dark'
    : 'light';

const subscribeToTheme = (onChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === 'studydesk_theme' || event.key === null) {
      onChange();
    }
  };
  window.addEventListener('storage', handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, (): Theme => 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('studydesk_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
