'use client';

import React from 'react';
import {
  Box,
  Compass,
  Camera,
  Activity,
  Radio,
  FileCode2,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { fadeUp, staggerContainer, staggerItem } from '@/utils/motionVariants';

export const CapabilitiesGrid: React.FC = () => {
  const capabilities = [
    {
      id: 'cap-1',
      title: 'Photogrammetric Camera Calibration',
      category: 'CAMERA CALIBRATION',
      description:
        'Estimate intrinsic camera parameters and lens distortion from calibration imagery, establishing a consistent geometric foundation for reconstruction.',
      icon: Box,
      badgeVariant: 'cyan' as const,
      cardVariant: 'accent-cyan' as const,
      stat: 'GEOMETRIC FOUNDATION',
    },
    {
      id: 'cap-2',
      title: 'Distortion-Corrected Imagery',
      category: 'IMAGE PREPROCESSING',
      description:
        'Correct lens distortion and normalize aerial imagery before reconstruction, preserving reliable image geometry across the processing pipeline.',
      icon: Compass,
      badgeVariant: 'indigo' as const,
      cardVariant: 'accent-indigo' as const,
      stat: 'CALIBRATED INPUT',
    },
    {
      id: 'cap-3',
      title: 'Metric Scene Reconstruction',
      category: '3D RECONSTRUCTION',
      description:
        'Convert calibrated aerial imagery into dense spatial geometry by combining image evidence with per-pixel scene depth and camera projection.',
      icon: Camera,
      badgeVariant: 'amber' as const,
      cardVariant: 'accent-amber' as const,
      stat: 'IMAGE → 3D',
    },
    {
      id: 'cap-4',
      title: 'Multi-View Pose Recovery',
      category: 'POSE ESTIMATION',
      description:
        'Recover relative camera motion from visual correspondences using feature matching, geometric verification and robust pose estimation.',
      icon: Eye,
      badgeVariant: 'emerald' as const,
      cardVariant: 'accent-emerald' as const,
      stat: 'MULTI-VIEW GEOMETRY',
    },
    {
      id: 'cap-5',
      title: 'Robust Spatial Fusion',
      category: 'POINT-CLOUD FUSION',
      description:
        'Align geometry across multiple frames while rejecting unreliable correspondences, inconsistent scale estimates and geometric outliers.',
      icon: Radio,
      badgeVariant: 'forest' as const,
      cardVariant: 'default' as const,
      stat: 'CONFIDENCE-AWARE FUSION',
    },
    {
      id: 'cap-6',
      title: 'Interactive Spatial Reconstruction',
      category: '3D ANALYSIS',
      description:
        'Deliver the reconstructed scene as an inspectable 3D representation for spatial visualization, geometric analysis and downstream processing.',
      icon: FileCode2,
      badgeVariant: 'indigo' as const,
      cardVariant: 'accent-indigo' as const,
      stat: '3D SCENE OUTPUT',
    },
  ];

  return (
    <section id="capabilities" className="scroll-mt-24 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2"
      >
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-[#F1F8F9]">
          Engineered for Extreme Spatial Precision.
        </h2>
        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto font-normal">
          SkyFusion unifies single-pass aerial imagery processing with robust 3D geometric scene reconstruction.
        </p>
      </motion.div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <motion.div
              key={cap.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
            >
              <Card
                variant={cap.cardVariant}
                isInteractive
                className="h-full flex flex-col justify-between p-7 sm:p-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#1C2C34] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#1A456E] dark:text-[#93B8D3] shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={cap.badgeVariant}>{cap.category}</Badge>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-white leading-snug">
                    {cap.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-[#CBD5E1] leading-relaxed font-sans">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-[#94A3B8] font-semibold">BENCHMARK:</span>
                  <span className="font-black text-[#1A456E] dark:text-[#93B8D3]">{cap.stat}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
