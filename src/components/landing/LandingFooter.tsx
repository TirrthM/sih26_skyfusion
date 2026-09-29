'use client';

import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-300/80 dark:border-slate-700/80 bg-white/80 dark:bg-[#0D1518]/90 backdrop-blur-md py-4 sm:py-5 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 items-center gap-3 sm:gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <img src="/logo.png" alt="SkyFusion Logo" className="w-6 h-6 object-contain" />
          <span className="font-display font-bold text-sm tracking-tight text-slate-950 dark:text-white">
            Sky<span className="text-[#37699F] dark:text-[#93B8D3]">Fusion</span>
          </span>
        </div>

        {/* Center: Team Attribution (Mathematically Centered) */}
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-[#1A2A32] border border-slate-300/80 dark:border-slate-700 font-semibold text-xs font-mono text-slate-800 dark:text-slate-200 shadow-xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#37699F] dark:bg-[#659AC1]" />
            This project has been developed by team Last_Dance for SIH 2026
          </span>
        </div>

        {/* Right: Copyright */}
        <div className="flex items-center justify-center sm:justify-end">
          <p className="text-xs font-mono text-slate-600 dark:text-[#94A3B8] whitespace-nowrap">
            &copy; 2026 SkyFusion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

