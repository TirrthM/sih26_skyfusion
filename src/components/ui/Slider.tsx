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
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            {label}
          </span>
        )}
        <span className="font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
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
        className="w-full h-2 bg-slate-800/80 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/10"
        {...props}
      />
    </div>
  );
};
