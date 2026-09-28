'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Palette, Box } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DesignSystemPreview: React.FC = () => {
  return (
    <section id="design-system" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="p-8 sm:p-10 rounded-4xl bg-white dark:bg-[#142026] border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 border-slate-200 dark:border-slate-700/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" hasDot>
                Spatial UI/UX Pro Max System
              </Badge>
              <span className="text-xs font-mono text-slate-600 dark:text-[#CBD5E1]">Design Tokens v2.0</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              Aerial Spatial Design System
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-[#CBD5E1] font-sans mt-1">
              Precision color tokens, generous rounded geometry, smooth spring motion, and WebGL primitives.
            </p>
          </div>

          <Link href="/design-system">
            <Button
              variant="dark-pill"
              iconRight={<ArrowUpRight className="w-4 h-4" />}
            >
              Open Component Sandbox
            </Button>
          </Link>
        </div>

        {/* Color Palette Tokens Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-[#F1F8F9] text-[#0B100D] border border-black/10">
            <div className="font-bold">#F1F8F9</div>
            <div className="text-[10px] text-slate-500">Air / Canvas</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#93B8D3] text-[#0B100D] font-bold">
            <div>#93B8D3</div>
            <div className="text-[10px] text-slate-700">Soft Sky</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#659AC1] text-white font-bold">
            <div>#659AC1</div>
            <div className="text-[10px] text-sky-100">Primary Blue</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#37699F] text-white font-bold">
            <div>#37699F</div>
            <div className="text-[10px] text-sky-200">Deep Blue</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#0B100D] text-[#F1F8F9] border border-white/10">
            <div className="font-bold">#0B100D</div>
            <div className="text-[10px] text-slate-400">Primary Dark</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#31514F] text-white font-bold">
            <div>#31514F</div>
            <div className="text-[10px] text-emerald-200">Deep Green</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#5B8769] text-white font-bold">
            <div>#5B8769</div>
            <div className="text-[10px] text-emerald-100">Forest Green</div>
          </div>
        </div>
      </div>
    </section>
  );
};
