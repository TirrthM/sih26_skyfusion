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
  const baseStyles = 'rounded-xl p-6 transition-all duration-200 relative overflow-hidden';

  const variantStyles = {
    default:
      'bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-light dark:shadow-tactile-dark',
    tactical:
      'bg-slate-50 dark:bg-sf-surface-darkMuted border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-dark',
    'accent-cyan':
      'bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-cyan/40 shadow-tactile-light dark:shadow-tactile-cyan hover:border-sf-cyan',
    'accent-amber':
      'bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-amber/40 shadow-tactile-light dark:shadow-tactile-amber hover:border-sf-amber',
    'accent-emerald':
      'bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-emerald/40 shadow-tactile-light dark:shadow-tactile-emerald hover:border-sf-emerald',
    'accent-indigo':
      'bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-indigo/40 shadow-tactile-light dark:shadow-tactile-indigo hover:border-sf-indigo',
  };

  const interactiveStyles = isInteractive
    ? 'hover:-translate-y-1 hover:shadow-tactile-lg-light dark:hover:shadow-hud-cyan cursor-pointer'
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
