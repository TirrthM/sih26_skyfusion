import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'slate' | 'forest';
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
  const baseStyles = 'inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold px-3 py-1 select-none border tracking-wide';

  const variantStyles = {
    cyan: 'bg-[#659AC1]/15 text-[#1A456E] border-[#659AC1]/40 dark:bg-[#659AC1]/20 dark:text-[#93B8D3] dark:border-[#659AC1]/40',
    indigo: 'bg-[#37699F]/15 text-[#143252] border-[#37699F]/40 dark:bg-[#37699F]/30 dark:text-[#B4D7F2] dark:border-[#659AC1]/50',
    amber: 'bg-[#D99B26]/15 text-[#734B03] border-[#D99B26]/40 dark:bg-[#D99B26]/20 dark:text-[#FDE08B] dark:border-[#D99B26]/45',
    emerald: 'bg-[#5B8769]/15 text-[#1E432A] border-[#5B8769]/40 dark:bg-[#5B8769]/25 dark:text-[#A7D8B5] dark:border-[#5B8769]/45',
    forest: 'bg-[#31514F]/15 text-[#163533] border-[#31514F]/40 dark:bg-[#31514F]/35 dark:text-[#93B8D3] dark:border-[#5B8769]/45',
    rose: 'bg-[#D45D5D]/15 text-[#7A1C1C] border-[#D45D5D]/40 dark:bg-[#D45D5D]/20 dark:text-[#FCA5A5] dark:border-[#D45D5D]/45',
    slate: 'bg-slate-200/80 text-slate-800 border-slate-300 dark:bg-[#1C2C34] dark:text-[#CBD5E1] dark:border-slate-600',
  };

  const dotColors = {
    cyan: 'bg-[#37699F] dark:bg-[#659AC1]',
    indigo: 'bg-[#294F77] dark:bg-[#37699F]',
    amber: 'bg-[#D99B26] dark:bg-[#D99B26]',
    emerald: 'bg-[#3E6A4C] dark:bg-[#5B8769]',
    forest: 'bg-[#31514F] dark:bg-[#5B8769]',
    rose: 'bg-[#D45D5D] dark:bg-[#D45D5D]',
    slate: 'bg-slate-700 dark:bg-[#659AC1]',
  };

  return (
    <span
      className={twMerge(
        clsx(baseStyles, isPill ? 'rounded-full' : 'rounded-lg', variantStyles[variant], className)
      )}
      {...props}
    >
      {hasDot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
};
