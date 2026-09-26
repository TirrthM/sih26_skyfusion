import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'slate';
  hasDot?: boolean;
  isPill?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'cyan',
  hasDot = false,
  isPill = true,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold px-2.5 py-0.5 select-none border uppercase tracking-wider transition-colors';

  const variantStyles = {
    cyan: 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-400/40 shadow-xs',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-400/40 shadow-xs',
    amber: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-400/40 shadow-xs',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-400/40 shadow-xs',
    rose: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-400/40 shadow-xs',
    slate: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/80 dark:text-slate-200 dark:border-white/20 shadow-xs',
  };

  const dotColors = {
    cyan: 'bg-sky-500 shadow-[0_0_8px_#0ea5e9]',
    indigo: 'bg-indigo-500 shadow-[0_0_8px_#6366f1]',
    amber: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
    emerald: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
    rose: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
    slate: 'bg-slate-500',
  };

  return (
    <span
      className={twMerge(
        clsx(baseStyles, isPill ? 'rounded-full' : 'rounded-md', variantStyles[variant], className)
      )}
      {...props}
    >
      {hasDot && (
        <span className={clsx('w-2 h-2 rounded-full animate-pulse', dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
};
