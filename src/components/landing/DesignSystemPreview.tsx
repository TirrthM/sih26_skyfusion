'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Sliders, ArrowRight, Layers, Palette, Box } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DesignSystemPreview: React.FC = () => {
  return (
    <section id="design-system" className="scroll-mt-28 py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="p-8 rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-cyan space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="indigo" hasDot>
                Phase 0 Verified Foundation
              </Badge>
              <span className="text-xs font-mono text-slate-500">Design System v1.0</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tactile Aerospace Design System
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-1">
              Custom-engineered design tokens, neubrutalist borders, telemetry badges, and WebGL primitives.
            </p>
          </div>

          <Link href="/design-system">
            <Button
              variant="tactical"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Open Full Component Sandbox
            </Button>
          </Link>
        </div>

        {/* Quick Tokens Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#080B11] text-white border border-slate-700">
            <div className="font-bold">#080B11</div>
            <div className="text-[10px] text-slate-400">Night Canvas</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0F1420] text-white border border-slate-700">
            <div className="font-bold">#0F1420</div>
            <div className="text-[10px] text-slate-400">Slate Surface</div>
          </div>
          <div className="p-3 rounded-xl bg-[#38BDF8] text-slate-950 font-bold">
            <div>#38BDF8</div>
            <div className="text-[10px] text-slate-800">Cyan Telemetry</div>
          </div>
          <div className="p-3 rounded-xl bg-[#6366F1] text-white font-bold">
            <div>#6366F1</div>
            <div className="text-[10px] text-indigo-200">Swarm Indigo</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F59E0B] text-slate-950 font-bold">
            <div>#F59E0B</div>
            <div className="text-[10px] text-amber-900">HUD Amber</div>
          </div>
          <div className="p-3 rounded-xl bg-[#10B981] text-slate-950 font-bold">
            <div>#10B981</div>
            <div className="text-[10px] text-emerald-950">Active Emerald</div>
          </div>
        </div>
      </div>
    </section>
  );
};
