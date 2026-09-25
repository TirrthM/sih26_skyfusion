'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plane,
  Box,
  Radio,
  Activity,
  Compass,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Database,
  Sliders,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';

export interface AppSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Mission Overview', href: '/app-shell-demo', icon: Activity, badge: 'LIVE' },
    { label: 'Fleet Command', href: '#fleet', icon: Plane, badge: '8 UAV' },
    { label: '3D Spatial Engine', href: '#3d-recon', icon: Box },
    { label: 'Swarm Telemetry', href: '#telemetry', icon: Radio },
    { label: 'Trajectory Planning', href: '#routes', icon: Compass },
    { label: 'Neural Processing', href: '#neural', icon: Cpu },
    { label: 'Spatial Assets', href: '#assets', icon: Database },
    { label: 'Design System', href: '/design-system', icon: Sliders },
  ];

  return (
    <aside
      className={clsx(
        'h-screen sticky top-0 flex flex-col justify-between bg-white dark:bg-sf-surface-dark border-r-2 border-slate-950 dark:border-sf-border-dark transition-all duration-300 z-30',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Brand Block */}
      <div>
        <div className="flex items-center justify-between p-4 border-b-2 border-slate-950 dark:border-sf-border-dark">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sf-cyan text-slate-950 border-2 border-slate-950 flex items-center justify-center font-display font-black text-lg shadow-tactile-sm-light shrink-0">
              SF
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-slate-900 dark:text-white leading-tight">
                  SkyFusion
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Aerospace OS v1.0
                </span>
              </div>
            )}
          </Link>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg border-2 border-slate-950 dark:border-sf-border-dark bg-slate-100 dark:bg-sf-surface-darkMuted text-slate-700 dark:text-slate-300 hover:border-sf-cyan"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all select-none',
                  isActive
                    ? 'bg-sf-cyan text-slate-950 border-2 border-slate-950 shadow-tactile-sm-light font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-sf-surface-darkMuted border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-800'
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span
                    className={clsx(
                      'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold',
                      isActive
                        ? 'bg-slate-950 text-sf-cyan'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mission Telemetry Health Block */}
      <div className="p-4 border-t-2 border-slate-950 dark:border-sf-border-dark">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-sf-surface-darkMuted border border-slate-300 dark:border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">BASE STATION:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">RTK ACCURACY:</span>
              <span className="text-sf-cyan font-bold">0.8 cm</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sf-cyan h-full w-[85%]" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
