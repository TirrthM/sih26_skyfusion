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
      <div className="p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#121A17]/85 backdrop-blur-xl border border-[#37699F]/15 dark:border-white/12 shadow-[0_12px_32px_rgba(55,105,159,0.08)] space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6 border-[#37699F]/15 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="emerald" hasDot>
                Reference-Engineered System
              </Badge>
              <span className="text-xs font-mono text-[#31514F] dark:text-slate-400">Design System v2.0</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#0B100D] dark:text-white">
              Spatial Aerial Design Tokens
            </h2>
            <p className="text-xs sm:text-sm text-[#31514F] dark:text-slate-400 font-sans mt-1">
              Engineered with the Farmdrone aerial palette, soft atmospheric depth, and WebGL primitives.
            </p>
          </div>

          <Link href="/design-system">
            <button className="px-5 py-2.5 rounded-full bg-[#0B100D] hover:bg-[#17221E] text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer">
              <span>Component Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Reference Tokens Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-[#F1F8F9] text-[#0B100D] border border-slate-300">
            <div className="font-bold">#F1F8F9</div>
            <div className="text-[10px] text-[#31514F]">Air Canvas</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#93B8D3] text-[#0B100D] font-bold">
            <div>#93B8D3</div>
            <div className="text-[10px] text-slate-800">Sky Environment</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#659AC1] text-white font-bold">
            <div>#659AC1</div>
            <div className="text-[10px] text-slate-100">Primary Blue</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#37699F] text-white font-bold">
            <div>#37699F</div>
            <div className="text-[10px] text-slate-200">Deep Blue</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#0B100D] text-white font-bold">
            <div>#0B100D</div>
            <div className="text-[10px] text-slate-400">Primary Dark</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#31514F] text-white font-bold">
            <div>#31514F</div>
            <div className="text-[10px] text-slate-300">Deep Green</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#5B8769] text-white font-bold">
            <div>#5B8769</div>
            <div className="text-[10px] text-slate-100">Secondary Green</div>
          </div>
        </div>
      </div>
    </section>
  );
};
