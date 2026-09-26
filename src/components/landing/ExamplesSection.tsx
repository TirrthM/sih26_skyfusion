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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" hasDot>
              Pre-Configured Drone Datasets
            </Badge>
            <span className="text-xs font-mono text-slate-400">5 Ready Scans</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Examples
          </h2>
          <p className="text-xs sm:text-sm font-mono text-emerald-400 font-bold mt-1">
            Click any row to load an example.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Interactive Dataset Benchmarks</span>
        </div>
      </div>

      {/* Interactive Examples Table Container */}
      <div className="rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                <th className="py-4 px-5">Upload Video / Example</th>
                <th className="py-4 px-3 text-center">Video Sampling FPS</th>
                <th className="py-4 px-3 text-center">Confidence Threshold</th>
                <th className="py-4 px-3 text-center">Filter Black BG</th>
                <th className="py-4 px-3 text-center">Filter White BG</th>
                <th className="py-4 px-3 text-center">Show Camera</th>
                <th className="py-4 px-3 text-center">Filter Sky</th>
                <th className="py-4 px-3 text-center">Max Points</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/5 text-xs font-mono">
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
                        ? 'bg-emerald-950/40 border-l-4 border-l-emerald-400'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Column 1: Video Name & Thumbnail Indicator */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-bold border border-white/20 shrink-0 shadow-md"
                          style={{ backgroundColor: ex.thumbnailColor }}
                        >
                          <Film className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                            {ex.name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-sans">
                            <span>{ex.videoFileName}</span>
                            <span>•</span>
                            <span>{ex.resolution}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Video Sampling FPS */}
                    <td className="py-4 px-3 text-center font-bold text-white">
                      {ex.samplingFps.toFixed(1)} FPS
                    </td>

                    {/* Column 3: Confidence Threshold (%) */}
                    <td className="py-4 px-3 text-center font-bold text-emerald-400">
                      {ex.confidenceThreshold}%
                    </td>

                    {/* Column 4: Filter Black Background */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${
                          ex.filterBlackBackground
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-400/40 shadow-xs'
                            : 'bg-white/5 text-slate-600'
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
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-400/40 shadow-xs'
                            : 'bg-white/5 text-slate-600'
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
                            ? 'bg-sky-950/70 text-sky-400 border border-sky-400/40 shadow-xs'
                            : 'bg-white/5 text-slate-600'
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
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-400/40 shadow-xs'
                            : 'bg-white/5 text-slate-600'
                        }`}
                      >
                        {ex.filterSky ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                    </td>

                    {/* Column 8: Max Points */}
                    <td className="py-4 px-3 text-center font-bold text-amber-300">
                      {ex.maxPoints}K
                    </td>

                    {/* Column 9: Load Action Button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-emerald-400/50'
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
