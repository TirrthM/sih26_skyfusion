'use client';

import React from 'react';
import {
  Film,
  Check,
  X,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Camera,
  Sliders,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import {
  ReconstructionExample,
  RECONSTRUCTION_EXAMPLES,
} from '@/services/examplesData';

export interface ExamplesSectionProps {
  selectedExampleId?: string | null;
  onSelectExample: (example: ReconstructionExample) => void;
}

export const ExamplesSection: React.FC<ExamplesSectionProps> = ({
  selectedExampleId,
  onSelectExample,
}) => {
  return (
    <section id="examples" className="scroll-mt-28 py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Exact Instruction Text */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" hasDot>
              Pre-Configured Drone Datasets
            </Badge>
            <span className="text-xs font-mono text-slate-500">5 Ready Scans</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Examples
          </h2>
          <p className="text-xs sm:text-sm font-mono text-sf-cyan dark:text-sf-cyan font-bold mt-1">
            Click any row to load an example.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <Database className="w-4 h-4 text-sf-cyan" />
          <span>Interactive Dataset Benchmarks</span>
        </div>
      </div>

      {/* Interactive Examples Table Container */}
      <div className="rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-light dark:shadow-tactile-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b-2 border-slate-950 dark:border-sf-border-dark bg-slate-100 dark:bg-sf-surface-darkMuted text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <th className="py-3.5 px-4">Upload Video / Example</th>
                <th className="py-3.5 px-3 text-center">Video Sampling FPS</th>
                <th className="py-3.5 px-3 text-center">Confidence Threshold</th>
                <th className="py-3.5 px-3 text-center">Filter Black BG</th>
                <th className="py-3.5 px-3 text-center">Filter White BG</th>
                <th className="py-3.5 px-3 text-center">Show Camera</th>
                <th className="py-3.5 px-3 text-center">Filter Sky</th>
                <th className="py-3.5 px-3 text-center">Max Points</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-mono">
              {RECONSTRUCTION_EXAMPLES.map((ex) => {
                const isSelected = selectedExampleId === ex.id;
                return (
                  <tr
                    key={ex.id}
                    onClick={() => onSelectExample(ex)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectExample(ex);
                      }
                    }}
                    className={`group transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-sky-50/80 dark:bg-sky-950/40 border-l-4 border-l-sf-cyan'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Column 1: Video Name & Thumbnail Indicator */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-950 font-bold border border-slate-900 shrink-0 shadow-xs"
                          style={{ backgroundColor: ex.thumbnailColor }}
                        >
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-sf-cyan transition-colors">
                            {ex.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-sans">
                            <span>{ex.videoFileName}</span>
                            <span>•</span>
                            <span>{ex.resolution}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Video Sampling FPS */}
                    <td className="py-4 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {ex.samplingFps.toFixed(1)} FPS
                    </td>

                    {/* Column 3: Confidence Threshold (%) */}
                    <td className="py-4 px-3 text-center font-bold text-sf-cyan">
                      {ex.confidenceThreshold}%
                    </td>

                    {/* Column 4: Filter Black Background */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${
                          ex.filterBlackBackground
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        {ex.filterBlackBackground ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                    </td>

                    {/* Column 5: Filter White Background */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${
                          ex.filterWhiteBackground
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        {ex.filterWhiteBackground ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                    </td>

                    {/* Column 6: Show Camera */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${
                          ex.showCamera
                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-500/40'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        {ex.showCamera ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                    </td>

                    {/* Column 7: Filter Sky */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${
                          ex.filterSky
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        {ex.filterSky ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                    </td>

                    {/* Column 8: Max Points */}
                    <td className="py-4 px-3 text-center font-bold text-sf-amber">
                      {ex.maxPoints}K
                    </td>

                    {/* Column 9: Load Action Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                          isSelected
                            ? 'bg-sf-cyan text-slate-950 border-slate-950 shadow-xs'
                            : 'bg-slate-100 dark:bg-sf-surface-darkMuted text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 group-hover:border-sf-cyan'
                        }`}
                      >
                        {isSelected ? 'Loaded' : 'Load →'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
