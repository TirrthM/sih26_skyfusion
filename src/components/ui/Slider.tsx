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
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
        <span className="font-semibold text-xs font-mono text-[#294F77] dark:text-[#93B8D3] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-sf-dark-surfaceMuted border border-black/5 dark:border-white/10">
          {valueDisplay !== undefined ? valueDisplay : value}
        </span>
      </div>
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-sf-dark-border rounded-full appearance-none cursor-pointer accent-[#659AC1] dark:accent-[#93B8D3] transition-all"
          {...props}
        />
      </div>
    </div>
  );
};
