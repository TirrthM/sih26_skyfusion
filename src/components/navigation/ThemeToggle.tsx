'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-white/50 dark:bg-sf-dark-surface/50 ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Mode"
      className={`relative p-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-[#1C2C34] hover:bg-white dark:hover:bg-[#253943] text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-xs outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#659AC1] ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5 text-[#F1C574] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#37699F] transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
