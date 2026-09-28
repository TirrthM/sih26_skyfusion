import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'tactical' | 'accent-cyan' | 'accent-amber' | 'accent-emerald' | 'accent-indigo' | 'glass';
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  isInteractive = false,
  ...props
}) => {
  const baseStyles = 'rounded-3xl p-6 sm:p-8 transition-all duration-200 relative overflow-hidden';

  const variantStyles = {
    default:
      'bg-white dark:bg-[#142026] border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark hover:dark:border-[#659AC1]/50',
    tactical:
      'bg-white dark:bg-[#1A2A32] border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark hover:dark:border-[#659AC1]/50',
    glass:
      'bg-white/95 dark:bg-[#142026]/90 border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark backdrop-blur-md',
    'accent-cyan':
      'bg-white dark:bg-[#142026] border border-[#659AC1]/50 dark:border-[#659AC1]/40 shadow-aerial dark:shadow-aerial-dark hover:border-[#659AC1]',
    'accent-amber':
      'bg-white dark:bg-[#142026] border border-[#D99B26]/50 dark:border-[#D99B26]/40 shadow-aerial dark:shadow-aerial-dark hover:border-[#D99B26]',
    'accent-emerald':
      'bg-white dark:bg-[#142026] border border-[#5B8769]/50 dark:border-[#5B8769]/40 shadow-aerial dark:shadow-aerial-dark hover:border-[#5B8769]',
    'accent-indigo':
      'bg-white dark:bg-[#142026] border border-[#37699F]/50 dark:border-[#37699F]/40 shadow-aerial dark:shadow-aerial-dark hover:border-[#37699F]',
  };

  const interactiveStyles = isInteractive
    ? 'hover:-translate-y-1 hover:shadow-aerial-lg dark:hover:shadow-aerial-dark-glow cursor-pointer'
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
