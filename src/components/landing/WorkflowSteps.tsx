'use client';

import React from 'react';
import { Plane, Cpu, Box, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { fadeUp } from '@/utils/motionVariants';

export const WorkflowSteps: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Image Input & Calibration',
      description:
        'Provide overlapping aerial imagery and calibrate the camera to estimate intrinsic parameters and correct lens distortion before reconstruction.',
      icon: Plane,
      tag: 'IMAGE INPUT',
    },
    {
      step: '02',
      title: 'Depth & Pose Recovery',
      description:
        'Estimate scene depth from each frame, match visual features across views, and recover relative camera motion using robust geometric verification.',
      icon: Cpu,
      tag: 'DEPTH + POSE',
    },
    {
      step: '03',
      title: '3D Reconstruction & Fusion',
      description:
        'Convert corrected imagery into 3D point clouds, align the reconstructed views, and fuse them into a common spatial representation.',
      icon: Box,
      tag: '3D FUSION',
    },
    {
      step: '04',
      title: 'Inspect & Export',
      description:
        'Inspect the reconstructed 3D geometry and export the resulting point cloud for visualization, analysis, and downstream 3D processing.',
      icon: Share2,
      tag: 'POINT CLOUD',
    },
  ];

  return (
    <section id="workflow" className="scroll-mt-24 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Narrative Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2"
      >
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-[#F1F8F9]">
          4 Steps. One Clear 3D Workflow.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto">
          From calibrated imagery to an aligned 3D point cloud through a clear, four-stage workflow.
        </p>
      </motion.div>

      {/* Sequential 4-Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card
                variant="default"
                isInteractive
                className="h-full flex flex-col justify-between relative group p-6 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-full bg-[#0B100D] dark:bg-[#F1F8F9] text-[#F1F8F9] dark:text-[#0B100D] flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                      {item.step}
                    </span>
                    <Badge variant="slate">{item.tag}</Badge>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-950 dark:text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-[#CBD5E1] leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-[#94A3B8] font-bold">
                  <span className="text-[11px]">STAGE {item.step} / 04</span>
                  <Icon className="w-4 h-4 text-[#37699F] dark:text-[#93B8D3]" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
