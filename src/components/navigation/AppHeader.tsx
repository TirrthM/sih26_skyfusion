'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Bell, Search, Shield, Cpu, RefreshCw } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface AppHeaderProps {
  title?: string;
  breadcrumbs?: string[];
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'Mission Control Command',
  breadcrumbs = ['SkyFusion', 'Operations', 'Active Swarm'],
}) => {
  return (
    <header className="h-16 px-6 bg-white dark:bg-sf-surface-dark border-b-2 border-slate-950 dark:border-sf-border-dark flex items-center justify-between sticky top-0 z-20">
      {/* Left: Title & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <span>/</span>}
                <span>{crumb}</span>
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-base font-display font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Live Telemetry Status & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sf-surface-darkMuted border border-slate-300 dark:border-slate-800 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-sf-cyan animate-pulse" />
          <span className="text-slate-500">WS STREAM:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">18.4k pts/sec</span>
        </div>

        <Badge variant="cyan" hasDot>
          GPS LOCK 3D
        </Badge>

        <ThemeToggle />

        <Link href="/">
          <Button variant="outline" size="sm">
            Landing Page
          </Button>
        </Link>
      </div>
    </header>
  );
};
