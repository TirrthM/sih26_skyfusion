import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'tactical' | 'accent-cyan' | 'accent-amber' | 'accent-emerald' | 'accent-indigo';
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  isInteractive = false,
  ...props
}) => {
  const baseStyles = 'rounded-3xl p-6 sm:p-7 transition-all duration-300 relative overflow-hidden backdrop-blur-xl';

  const variantStyles = {
    default:
      'bg-white/90 dark:bg-slate-900/80 border border-black/10 dark:border-white/12 shadow-[0_15px_35px_rgba(0,0,0,0.06)] text-slate-900 dark:text-white',
    tactical:
      'bg-white/90 dark:bg-slate-900/80 border border-black/10 dark:border-white/12 shadow-[0_15px_35px_rgba(0,0,0,0.06)] text-slate-900 dark:text-white hover:border-emerald-500/50 dark:hover:border-emerald-400/40',
    'accent-cyan':
      'bg-white/90 dark:bg-slate-900/80 border border-black/10 dark:border-white/12 shadow-[0_15px_35px_rgba(0,0,0,0.06)] text-slate-900 dark:text-white hover:border-sky-500/50 dark:hover:border-sky-400/60 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]',
    'accent-amber':
      'bg-white/90 dark:bg-slate-900/80 border border-black/10 dark:border-white/12 shadow-[0_15px_35px_rgba(0,0,0,0.06)] text-slate-900 dark:text-white hover:border-amber-500/50 dark:hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    'accent-emerald':
      'bg-white/90 dark:bg-slate-900/80 border border-black/10 dark:border-white/12 shadow-[0_15px_35px_rgba(0,0,0,0.06)] text-slate-900 dark:text-white hover:border-emerald-500/50 dark:hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    'accent-indigo':
      'bg-white/90 dark:bg-slate-900/80 border border-black/10 dark:border-white/12 shadow-[0_15px_35px_rgba(0,0,0,0.06)] text-slate-900 dark:text-white hover:border-indigo-500/50 dark:hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]',
  };

  const interactiveStyles = isInteractive
    ? 'hover:-translate-y-1.5 cursor-pointer'
    : '';

  return (
    <div
      className={twMerge(clsx(baseStyles, variantStyles[variant], interactiveStyles, className))}
      {...props}
    >
      {children}
    </div>
  );
};
