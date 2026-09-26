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
    cyan: 'bg-sky-950/70 text-sky-300 border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]',
    indigo: 'bg-indigo-950/70 text-indigo-300 border-indigo-400/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]',
    amber: 'bg-amber-950/70 text-amber-300 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    rose: 'bg-rose-950/70 text-rose-300 border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    slate: 'bg-slate-900/80 text-slate-200 border-white/20 shadow-sm',
  };

  const dotColors = {
    cyan: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
    indigo: 'bg-indigo-400 shadow-[0_0_8px_#6366f1]',
    amber: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    emerald: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    rose: 'bg-rose-400 shadow-[0_0_8px_#f43f5e]',
    slate: 'bg-slate-400',
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
