'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-sf-surface-dark ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Mode"
      className={`relative p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-sf-surface-dark/80 shadow-sm hover:border-sf-cyan/60 hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] text-slate-800 dark:text-slate-200 transition-all select-none ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-sf-amber animate-in spin-in-180 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-sf-indigo animate-in spin-in-180 duration-200" />
      )}
    </button>
  );
};
