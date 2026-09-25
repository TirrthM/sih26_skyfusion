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
  const baseStyles = 'inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 select-none border uppercase tracking-wider';

  const variantStyles = {
    cyan: 'bg-sky-100 text-sky-900 border-sky-600 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-500/40',
    indigo: 'bg-indigo-100 text-indigo-900 border-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500/40',
    amber: 'bg-amber-100 text-amber-900 border-amber-600 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/40',
    emerald: 'bg-emerald-100 text-emerald-900 border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/40',
    rose: 'bg-rose-100 text-rose-900 border-rose-600 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/40',
    slate: 'bg-slate-100 text-slate-900 border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  };

  const dotColors = {
    cyan: 'bg-sky-500 shadow-[0_0_8px_#38bdf8]',
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
