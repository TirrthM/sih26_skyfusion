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
  const baseStyles = 'rounded-3xl p-6 sm:p-7 transition-all duration-300 relative overflow-hidden backdrop-blur-2xl';

  const variantStyles = {
    default:
      'bg-slate-950/70 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white',
    tactical:
      'bg-slate-950/75 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white hover:border-emerald-400/40',
    'accent-cyan':
      'bg-slate-950/75 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white hover:border-sky-400/60 hover:shadow-[0_0_35px_rgba(56,189,248,0.25)]',
    'accent-amber':
      'bg-slate-950/75 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white hover:border-amber-400/60 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]',
    'accent-emerald':
      'bg-slate-950/75 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]',
    'accent-indigo':
      'bg-slate-950/75 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white hover:border-indigo-400/60 hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]',
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
