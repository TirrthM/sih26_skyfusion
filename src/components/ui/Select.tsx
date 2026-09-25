import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          disabled={disabled}
          className={twMerge(
            clsx(
              'w-full rounded-lg px-3.5 py-2 text-sm font-sans transition-all appearance-none cursor-pointer',
              'bg-white dark:bg-sf-surface-darkMuted',
              'text-slate-900 dark:text-slate-100',
              'border-2 border-slate-950 dark:border-sf-border-dark',
              'shadow-tactile-sm-light dark:shadow-tactile-sm-dark',
              'focus:outline-none focus:border-sf-cyan focus:ring-1 focus:ring-sf-cyan',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error ? 'border-sf-rose' : '',
              className
            )
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-sf-surface-dark">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-sf-rose font-mono">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
