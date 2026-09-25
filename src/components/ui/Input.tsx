import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, iconLeft, iconRight, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full rounded-lg px-3.5 py-2 text-sm font-sans transition-all',
                'bg-white dark:bg-sf-surface-darkMuted',
                'text-slate-900 dark:text-slate-100',
                'border-2 border-slate-950 dark:border-sf-border-dark',
                'shadow-tactile-sm-light dark:shadow-tactile-sm-dark',
                'focus:outline-none focus:border-sf-cyan dark:focus:border-sf-cyan focus:ring-1 focus:ring-sf-cyan',
                'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                iconLeft ? 'pl-9' : '',
                iconRight ? 'pr-9' : '',
                error ? 'border-sf-rose dark:border-sf-rose' : '',
                className
              )
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none">
              {iconRight}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-sf-rose font-mono">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
