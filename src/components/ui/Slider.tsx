import React, { InputHTMLAttributes } from 'react';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  valueDisplay?: string | number;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  valueDisplay,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
  disabled,
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-mono">
        {label && (
          <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
        <span className="font-bold text-sf-cyan px-2 py-0.5 rounded bg-slate-200 dark:bg-sf-surface-dark border border-slate-400 dark:border-slate-700">
          {valueDisplay !== undefined ? valueDisplay : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sf-cyan"
        {...props}
      />
    </div>
  );
};
