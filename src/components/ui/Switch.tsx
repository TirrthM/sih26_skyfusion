'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled,
}) => {
  return (
    <label
      className={clsx(
        'flex items-center justify-between gap-3 cursor-pointer select-none group',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{description}</span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sf-sky',
          checked
            ? 'bg-[#659AC1] dark:bg-[#659AC1]'
            : 'bg-slate-200 dark:bg-sf-dark-border'
        )}
      >
        <span
          className={clsx(
            'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200',
            checked ? 'translate-x-4.5' : 'translate-x-0.5'
          )}
        />
      </button>
    </label>
  );
};
