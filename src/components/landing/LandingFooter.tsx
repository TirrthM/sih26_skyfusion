'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Github, Twitter, Layers, ShieldCheck, Heart } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t-2 border-slate-950 dark:border-sf-border-dark bg-white dark:bg-sf-surface-dark py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Mission Status */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-sf-cyan text-slate-950 border-2 border-slate-950 flex items-center justify-center font-display font-black text-xl shadow-tactile-sm-light">
            SF
          </div>
          <div>
            <div className="font-display font-bold text-lg text-slate-900 dark:text-white">
              SkyFusion Aerospace
            </div>
            <p className="text-xs font-mono text-slate-500">
              Autonomous UAV Swarm Telemetry & Real-Time 3D Reconstruction Platform
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <Link href="/design-system" className="hover:text-sf-cyan transition-colors">
            Design System
          </Link>
          <Link href="/app-shell-demo" className="hover:text-sf-cyan transition-colors">
            Mission App Shell
          </Link>
          <Link href="#capabilities" className="hover:text-sf-cyan transition-colors">
            Capabilities
          </Link>
          <Link href="#pipeline" className="hover:text-sf-cyan transition-colors">
            3D Pipeline
          </Link>
          <Link href="#faq" className="hover:text-sf-cyan transition-colors">
            FAQ
          </Link>
        </div>

        {/* System Telemetry Indicator */}
        <div className="flex items-center gap-3">
          <Badge variant="emerald" hasDot>
            System Status: Nominal
          </Badge>
          <span className="text-xs font-mono text-slate-400">© 2026 SkyFusion</span>
        </div>
      </div>
    </footer>
  );
};
