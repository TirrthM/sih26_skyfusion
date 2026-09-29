'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SceneCanvas } from '../canvas/SceneCanvas';
import { PipelineStage3DScene } from '../canvas/PipelineStage3DScene';
import { fadeUp } from '@/utils/motionVariants';

interface PipelineLayer {
  id: number;
  label: string;
  stageBadge: string;
  title: string;
  purpose: string;
  input: string;
  process: string;
  output: string;
}

const PIPELINE_LAYERS: PipelineLayer[] = [
  {
    id: 1,
    label: '1. Frame Input',
    stageBadge: 'STAGE 01 / 11',
    title: 'FRAME INPUT',
    purpose: 'Prepare overlapping frames for reconstruction.',
    input: 'Video frames or aerial images.',
    process: 'Select usable frames and preserve image order and visual overlap.',
    output: 'Reconstruction-ready image sequence.',
  },
  {
    id: 2,
    label: '2. Camera Calibration',
    stageBadge: 'STAGE 02 / 11',
    title: 'CAMERA CALIBRATION',
    purpose: 'Estimate the internal parameters of the camera.',
    input: 'Calibration imagery containing known visual geometry.',
    process: 'Estimate focal parameters, principal point, and lens distortion coefficients.',
    output: 'Camera intrinsic matrix and distortion parameters.',
  },
  {
    id: 3,
    label: '3. Image Correction',
    stageBadge: 'STAGE 03 / 11',
    title: 'IMAGE CORRECTION',
    purpose: 'Correct lens distortion before reconstruction.',
    input: 'Camera calibration parameters and source images.',
    process: 'Apply distortion correction to the input imagery.',
    output: 'Undistorted images ready for reconstruction.',
  },
  {
    id: 4,
    label: '4. Depth Estimation',
    stageBadge: 'STAGE 04 / 11',
    title: 'DEPTH ESTIMATION',
    purpose: 'Estimate scene depth from corrected imagery.',
    input: 'Corrected images.',
    process: 'Estimate per-pixel depth and apply depth filtering.',
    output: 'Depth maps used to construct 3D geometry.',
  },
  {
    id: 5,
    label: '5. Feature Matching',
    stageBadge: 'STAGE 05 / 11',
    title: 'FEATURE MATCHING',
    purpose: 'Find visual correspondences between overlapping views.',
    input: 'Corrected image pairs.',
    process: 'Detect visual features and match corresponding points across frames.',
    output: 'Image correspondences for multi-view geometry.',
  },
  {
    id: 6,
    label: '6. Pose Recovery',
    stageBadge: 'STAGE 06 / 11',
    title: 'POSE RECOVERY',
    purpose: 'Estimate relative camera movement between views.',
    input: 'Matched image features and 3D/2D correspondences.',
    process: 'Estimate relative rotation and translation using robust pose estimation.',
    output: 'Relative camera poses and camera trajectory.',
  },
  {
    id: 7,
    label: '7. Geometric Validation',
    stageBadge: 'STAGE 07 / 11',
    title: 'GEOMETRIC VALIDATION',
    purpose: 'Reject unreliable correspondences and inconsistent geometry.',
    input: 'Feature matches and estimated camera motion.',
    process: 'Apply reprojection and geometric consistency checks.',
    output: 'Validated correspondences and more reliable camera relationships.',
  },
  {
    id: 8,
    label: '8. Point Cloud Generation',
    stageBadge: 'STAGE 08 / 11',
    title: 'POINT CLOUD GENERATION',
    purpose: 'Convert depth information into 3D geometry.',
    input: 'Depth maps, camera intrinsics, and corrected images.',
    process: 'Back-project valid depth pixels into 3D camera coordinates and filter unreliable points.',
    output: 'Per-frame 3D point clouds.',
  },
  {
    id: 9,
    label: '9. Point Cloud Alignment',
    stageBadge: 'STAGE 09 / 11',
    title: 'POINT CLOUD ALIGNMENT',
    purpose: 'Place reconstructed views into a common coordinate system.',
    input: 'Per-frame point clouds and estimated camera poses.',
    process: 'Transform point clouds using recovered relative camera geometry.',
    output: 'Spatially aligned point clouds.',
  },
  {
    id: 10,
    label: '10. Point Cloud Fusion',
    stageBadge: 'STAGE 10 / 11',
    title: 'POINT CLOUD FUSION',
    purpose: 'Combine aligned point clouds into a unified reconstruction.',
    input: 'Aligned multi-view point clouds.',
    process: 'Merge compatible geometry while filtering inconsistent points.',
    output: 'Unified 3D point cloud.',
  },
  {
    id: 11,
    label: '11. 3D Point Cloud Output',
    stageBadge: 'STAGE 11 / 11',
    title: '3D POINT CLOUD OUTPUT',
    purpose: 'Prepare reconstructed geometry for inspection and downstream processing.',
    input: 'Fused 3D point cloud.',
    process: 'Organize and export the reconstructed geometry.',
    output: '3D point-cloud data, currently demonstrated in PLY format.',
  },
];

export const PipelineDemo: React.FC = () => {
  const [selectedLayerId, setSelectedLayerId] = useState<number>(1);
  const activeLayer = PIPELINE_LAYERS.find((l) => l.id === selectedLayerId) || PIPELINE_LAYERS[0];

  return (
    <section id="pipeline" className="scroll-mt-24 py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2"
      >
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-[#F1F8F9]">
          Multi-Stage 3D Reconstruction Pipeline.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto">
          Explore each stage from calibrated imagery to aligned and fused 3D point clouds.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Side: 11-Stage Pipeline Selector & Dynamic Selected-Layer Panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-[32px] bg-white dark:bg-[#142026] border border-slate-300/80 dark:border-slate-700/80 shadow-aerial dark:shadow-aerial-dark h-full gap-3"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-700/80 shrink-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#94A3B8]">
              Pipeline Architecture
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1A2A32] text-[#1A456E] dark:text-[#93B8D3] font-bold border border-slate-200 dark:border-slate-700">
              11 STAGES
            </span>
          </div>

          {/* Compact 2-Column 11-Stage Buttons */}
          <div className="space-y-1.5 shrink-0">
            <label className="text-[11px] font-mono font-bold uppercase text-slate-900 dark:text-slate-200">
              Select Active Pipeline Layer:
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
              {PIPELINE_LAYERS.map((item) => {
                const isActive = selectedLayerId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedLayerId(item.id)}
                    className={`px-2.5 py-1.5 rounded-xl border text-left font-bold transition-all cursor-pointer truncate ${
                      isActive
                        ? 'bg-[#0B100D] text-white dark:bg-[#F1F8F9] dark:text-[#0B100D] border-transparent shadow-xs'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-[#1A2A32] dark:text-slate-200 dark:border-slate-700 dark:hover:bg-[#223640] dark:hover:border-slate-600'
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Selected-Layer Information Panel */}
          <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#0E171B] border border-slate-200 dark:border-slate-700/80 gap-2.5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-1.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#204C79] dark:text-[#93B8D3]">
                SELECTED LAYER
              </span>
              <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                {activeLayer.stageBadge}
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-950 dark:text-white leading-tight">
                {activeLayer.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#CBD5E1] font-sans mt-0.5 leading-relaxed">
                {activeLayer.purpose}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs font-sans pt-1 border-t border-slate-200/60 dark:border-slate-800/80 flex-1">
              <div className="bg-white/70 dark:bg-[#142026]/70 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center">
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-0.5">
                  INPUT
                </span>
                <span className="text-slate-800 dark:text-slate-200 leading-snug">
                  {activeLayer.input}
                </span>
              </div>

              <div className="bg-white/70 dark:bg-[#142026]/70 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center">
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-0.5">
                  PROCESS
                </span>
                <span className="text-slate-800 dark:text-slate-200 leading-snug">
                  {activeLayer.process}
                </span>
              </div>

              <div className="bg-white/70 dark:bg-[#142026]/70 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center">
                <span className="font-mono text-[10px] font-bold text-[#204C79] dark:text-[#93B8D3] uppercase block mb-0.5">
                  OUTPUT
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                  {activeLayer.output}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Live Reactive 3D Canvas */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="lg:col-span-7 rounded-[32px] bg-slate-950 border border-slate-300/80 dark:border-slate-700/80 shadow-aerial-lg dark:shadow-aerial-dark overflow-hidden relative min-h-[460px] flex flex-col h-full justify-between"
        >
          <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5B8769] animate-pulse" />
              VIEWPORT: {activeLayer.title}
            </span>
            <span className="text-[#93B8D3] font-semibold">{activeLayer.stageBadge}</span>
          </div>

          <div className="flex-1 relative min-h-[380px]">
            <SceneCanvas cameraPosition={[14, 10, 16]} fov={45} className="w-full h-full min-h-[380px]">
              <PipelineStage3DScene stageIndex={selectedLayerId} />
            </SceneCanvas>

            {/* Stage Indicator Overlay */}
            <div className="absolute bottom-3.5 left-3.5 pointer-events-none p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-xs font-mono space-y-0.5 text-slate-300 shadow-lg">
              <div className="text-[#D99B26] font-bold text-[11px]">{activeLayer.stageBadge}</div>
              <div className="text-[11px] font-semibold text-white">{activeLayer.title}</div>
              <div className="text-[10px] text-slate-400">{activeLayer.purpose}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
