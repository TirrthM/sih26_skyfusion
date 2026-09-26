'use client';

import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl py-6 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-950 dark:text-white tracking-wide">SkyFusion</span>
          <span>•</span>
          <span>SIH 26 Problem Statement 26158</span>
        </div>
        <p>
          &copy; 2026 SkyFusion Autonomous Swarm Reconnaissance. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
