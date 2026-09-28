'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tactical' | 'outline' | 'danger' | 'ghost' | 'dark-pill';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sf-sky focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 font-semibold',
      md: 'text-sm px-5 py-2.5 gap-2 font-medium',
      lg: 'text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 gap-2.5 font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-[#0B100D] text-white hover:bg-[#1E302B] dark:bg-[#F1F8F9] dark:text-[#0B100D] dark:hover:bg-white shadow-pill-cta dark:shadow-pill-cta-dark border border-transparent active:scale-[0.98]',
      'dark-pill':
        'bg-[#0B100D] text-white hover:bg-[#1E302B] dark:bg-[#F1F8F9] dark:text-[#0B100D] dark:hover:bg-white shadow-pill-cta dark:shadow-pill-cta-dark border border-transparent active:scale-[0.98]',
      secondary:
        'bg-white text-[#0B100D] dark:bg-[#1C2C34] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#253943] border border-slate-300 dark:border-slate-600 shadow-sm active:scale-[0.98]',
      tactical:
        'bg-[#37699F] text-white hover:bg-[#204C79] dark:bg-[#37699F] dark:text-[#FFFFFF] dark:hover:bg-[#4A7EB5] shadow-md border border-transparent font-semibold active:scale-[0.98]',
      outline:
        'bg-transparent text-[#0B100D] dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#1C2C34] border border-slate-300 dark:border-slate-600 active:scale-[0.98]',
      danger:
        'bg-[#D45D5D] text-white hover:bg-[#B84949] shadow-sm border border-transparent',
      ghost:
        'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-[#1C2C34] border-transparent',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 mr-1 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          iconLeft
        )}
        <span>{children}</span>
        {!isLoading && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';
