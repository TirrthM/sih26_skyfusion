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
      'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 font-semibold',
      md: 'text-sm px-4 py-2 gap-2 font-medium',
      lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-sf-indigo text-white hover:bg-sf-indigo-hover border-2 border-slate-950 shadow-tactile-light dark:border-sf-border-dark dark:shadow-tactile-indigo active:translate-y-0.5',
      secondary:
        'bg-slate-100 dark:bg-sf-surface-darkMuted text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-light dark:shadow-tactile-dark active:translate-y-0.5',
      tactical:
        'bg-sf-cyan text-slate-950 font-semibold hover:bg-sf-cyan-hover border-2 border-slate-950 shadow-tactile-light dark:border-sf-cyan dark:shadow-tactile-cyan active:translate-y-0.5',
      outline:
        'bg-transparent text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 border-2 border-slate-950 dark:border-slate-700 active:translate-y-0.5',
      danger:
        'bg-sf-rose text-white hover:bg-sf-rose-hover border-2 border-slate-950 shadow-tactile-light dark:border-sf-rose active:translate-y-0.5',
      ghost:
        'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border-transparent',
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
