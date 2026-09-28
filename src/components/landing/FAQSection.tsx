'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from '@/utils/motionVariants';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SkyFusion differ from traditional photogrammetry?',
      a: 'SkyFusion uses a modular image-to-3D pipeline that combines camera calibration, image correction, depth-based reconstruction, feature matching and multi-view pose estimation. Instead of depending only on traditional point triangulation, it uses dense scene information together with geometric verification to build and align 3D point clouds.',
    },
    {
      q: 'Do I need dedicated GPU hardware or a Python environment to run SkyFusion?',
      a: 'The reconstruction pipeline can use GPU acceleration for its neural inference stages, while the geometric processing runs through standard computer-vision components. The current research implementation is Python-based, with GPU hardware recommended for faster processing of larger image sets.',
    },
    {
      q: 'What images or camera data can SkyFusion work with?',
      a: 'SkyFusion works with calibrated images extracted from aerial or handheld camera footage, provided the images contain enough visual overlap and scene detail. Video can be converted into individual frames before entering the reconstruction pipeline.',
    },
    {
      q: 'What 3D output can I get from SkyFusion?',
      a: 'The current pipeline produces 3D point clouds in PLY format, along with intermediate depth maps and reconstructed camera geometry. These outputs can be inspected in standard 3D visualization software and can also be processed further for downstream reconstruction or analysis.',
    },
    {
      q: 'How does SkyFusion maintain spatial accuracy without ground control points (GCPs)?',
      a: 'SkyFusion first calibrates the camera to estimate its intrinsic parameters and lens distortion, then uses corrected imagery and geometric constraints during reconstruction. This improves internal geometric consistency, but without surveyed GCPs or another external reference, absolute geographic accuracy cannot be guaranteed.',
    },
    {
      q: 'Can SkyFusion reconstruct a 3D scene from a single image?',
      a: 'A single image can be converted into a depth-based 3D point cloud, which provides an initial spatial representation of the scene. However, multiple overlapping views are needed to recover more reliable scene structure, camera movement and complete geometry.',
    },
    {
      q: 'How does SkyFusion align multiple images into one 3D scene?',
      a: 'The system finds visual features shared between images and uses their correspondences to estimate relative camera motion. Geometric checks and robust pose estimation are then used to reject unreliable matches before transforming and merging the individual point clouds.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="text-center mb-6 sm:mb-8 space-y-2"
      >
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-[#F1F8F9]">
          Frequently Asked Questions.
        </h2>
      </motion.div>

      {/* Accordion Stack */}
      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="rounded-3xl bg-white dark:bg-[#142026] border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-50 dark:hover:bg-[#1A2A32]/60 transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-display font-bold text-base sm:text-lg text-slate-950 dark:text-white pr-4 leading-snug">
                  {faq.q}
                </span>
                <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1C2C34] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200">
                  {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 text-sm sm:text-base font-sans text-slate-700 dark:text-[#CBD5E1] leading-relaxed border-t border-slate-200 dark:border-slate-700/80">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
