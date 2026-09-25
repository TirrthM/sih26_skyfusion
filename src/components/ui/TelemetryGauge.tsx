import React from 'react';
import { clsx } from 'clsx';

export interface TelemetryGaugeProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'cyan' | 'amber' | 'emerald' | 'rose' | 'indigo';
  icon?: React.ReactNode;
  progressPercent?: number;
}

export const TelemetryGauge: React.FC<TelemetryGaugeProps> = ({
  label,
  value,
  unit,
  trend,
  color = 'cyan',
  icon,
  progressPercent,
}) => {
  const colorMap = {
    cyan: 'text-sf-cyan border-sf-cyan',
    amber: 'text-sf-amber border-sf-amber',
    emerald: 'text-sf-emerald border-sf-emerald',
    rose: 'text-sf-rose border-sf-rose',
    indigo: 'text-sf-indigo border-sf-indigo',
  };

  const bgProgressMap = {
    cyan: 'bg-sf-cyan',
    amber: 'bg-sf-amber',
    emerald: 'bg-sf-emerald',
    rose: 'bg-sf-rose',
    indigo: 'bg-sf-indigo',
  };

  return (
    <div className="flex flex-col p-4 rounded-xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-sm-light dark:shadow-tactile-sm-dark">
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
        <span className="uppercase tracking-wider font-semibold">{label}</span>
        {icon && <span className={colorMap[color]}>{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1 my-1">
        <span className="text-2xl font-mono font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {progressPercent !== undefined && (
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className={clsx('h-full transition-all duration-300', bgProgressMap[color])}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
    </div>
  );
};
