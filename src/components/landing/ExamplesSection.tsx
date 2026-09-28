'use client';

import React from 'react';
import {
  Film,
  Check,
  X,
  ArrowUpRight,
  HardDrive,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ReconstructionExample,
  RECONSTRUCTION_EXAMPLES,
} from '@/services/examplesData';
import { fadeUp } from '@/utils/motionVariants';

export interface ExamplesSectionProps {
  selectedExampleId?: string | null;
  onSelectExample: (example: ReconstructionExample) => void;
}

export const ExamplesSection: React.FC<ExamplesSectionProps> = ({
  selectedExampleId,
  onSelectExample,
}) => {
  return (
    <section id="examples" className="scroll-mt-24 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Centered Editorial Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2"
      >
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-[#F1F8F9]">
          Benchmark Dataset Examples.
        </h2>
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto font-normal">
          Select any verified UAV flight dataset below to load multi-angle footage, spatial telemetry, and ground truth benchmarks into the reconstruction engine.
        </p>
        <p className="text-xs sm:text-sm font-mono text-[#1A456E] dark:text-[#93B8D3] font-bold">
          Click any row to load an example.
        </p>
      </motion.div>

      {/* Interactive Examples Table Container */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="rounded-3xl bg-white dark:bg-[#142026] border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-[#1A2A32] text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <th className="py-3.5 px-5">Dataset / Flight Video</th>
                <th className="py-3.5 px-3 text-center">Duration</th>
                <th className="py-3.5 px-3 text-center">Resolution</th>
                <th className="py-3.5 px-3 text-center">File Size</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/60 text-xs font-mono">
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
                    className={`group transition-colors duration-150 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-[#1E3340] border-l-4 dark:border-l-[#659AC1]'
                        : 'hover:bg-slate-50 dark:hover:bg-[#1A2A32]/60'
                    }`}
                  >
                    {/* Column 1: Video Name & Thumbnail Indicator */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-950 font-bold border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: ex.thumbnailColor }}
                        >
                          <Film className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-slate-950 dark:text-white group-hover:text-[#1A456E] dark:group-hover:text-[#93B8D3] transition-colors">
                            {ex.name}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-[#94A3B8] font-sans mt-0.5">
                            {ex.videoFileName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 3: Duration */}
                    <td className="py-3.5 px-3 text-center text-slate-800 dark:text-slate-200 font-semibold">
                      {ex.duration}
                    </td>

                    {/* Column 4: Resolution */}
                    <td className="py-3.5 px-3 text-center text-[#1A456E] dark:text-[#93B8D3] font-bold">
                      {ex.resolution}
                    </td>

                    {/* Column 5: File Size */}
                    <td className="py-3.5 px-3 text-center text-slate-700 dark:text-[#CBD5E1] font-medium">
                      {ex.fileSize}
                    </td>

                    {/* Column 6: Load Action Button */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0B100D] text-white dark:bg-[#F1F8F9] dark:text-[#0B100D] shadow-xs'
                            : 'bg-slate-100 dark:bg-[#1A2A32] text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-slate-600 hover:bg-[#37699F] hover:text-white dark:hover:bg-[#37699F] dark:hover:text-white shadow-xs'
                        }`}
                      >
                        {isSelected ? 'Loaded ✓' : 'Load →'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};
