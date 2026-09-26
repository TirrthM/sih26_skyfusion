'use client';

import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-sf-bg-dark py-4 sm:py-5 px-4 text-center transition-colors">
      <p className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 tracking-wide">
        &copy; 2026 SkyFusion / SIH 26 PS 158. All rights reserved.
      </p>
    </footer>
  );
};

