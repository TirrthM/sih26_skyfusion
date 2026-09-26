import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tactical' | 'outline' | 'danger' | 'ghost';
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
      'inline-flex items-center justify-center font-sans font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:opacity-40 disabled:cursor-not-allowed select-none tracking-wide';

    const sizeStyles = {
      sm: 'text-xs px-4 py-2 gap-1.5 font-bold',
      md: 'text-sm px-6 py-2.5 gap-2 font-bold',
      lg: 'text-base px-8 py-3.5 gap-2.5 font-bold',
    };

    const variantStyles = {
      primary:
        'bg-white text-slate-950 hover:bg-slate-100 border border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] active:scale-95',
      secondary:
        'bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-md backdrop-blur-md active:scale-95',
      tactical:
        'bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 border-none shadow-[0_0_25px_rgba(52,211,153,0.4)] hover:shadow-[0_0_35px_rgba(52,211,153,0.6)] active:scale-95',
      outline:
        'bg-transparent text-white hover:bg-white/10 border border-white/30 backdrop-blur-sm active:scale-95',
      danger:
        'bg-rose-500 text-white hover:bg-rose-600 border border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-95',
      ghost:
        'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border-transparent active:scale-95',
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
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
