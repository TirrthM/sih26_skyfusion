'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg border-2 border-slate-950 dark:border-sf-border-dark bg-slate-100 dark:bg-sf-surface-dark ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Mode"
      className={`relative p-2 rounded-lg border-2 border-slate-950 dark:border-sf-border-dark bg-white dark:bg-sf-surface-dark shadow-tactile-sm-light dark:shadow-tactile-sm-dark hover:border-sf-cyan text-slate-800 dark:text-slate-200 transition-all select-none ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-sf-amber animate-in spin-in-180 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-sf-indigo animate-in spin-in-180 duration-200" />
      )}
    </button>
  );
};
