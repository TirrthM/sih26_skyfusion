'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SkyFusion differ from traditional photogrammetry like RealityCapture or COLMAP?',
      a: 'Traditional Structure-from-Motion (SfM) pipelines require hours of iterative feature matching and bundle adjustment on expensive local GPUs. SkyFusion uses a feed-forward neural transformer architecture that solves camera poses and dense 3D geometry in a single rapid pass (< 90 seconds) directly in the browser or cloud.',
    },
    {
      q: 'Do I need dedicated GPU hardware or Python environments to run SkyFusion?',
      a: 'No. SkyFusion is engineered as a modern WebGL-accelerated web application. Multi-angle drone footage is processed seamlessly with streaming GPU inference and rendered directly in your browser with interactive 60 FPS orbit controls.',
    },
    {
      q: 'Which drone platforms and camera formats are natively supported?',
      a: 'SkyFusion supports all standard UAV systems including DJI Enterprise, Autel, Skydio, and custom PX4/ArduPilot rigs. Input formats include 4K MP4/MOV aerial video, multi-image JPG/PNG/DNG, and RTK telemetry metadata logs.',
    },
    {
      q: 'What 3D export formats can I download for external software?',
      a: 'Reconstructed scenes can be exported in one click to GLB (with embedded textures and camera frustums), LAS (standard ASPRS LiDAR point clouds), PLY, OBJ, and 3D Tiles for Cesium, Blender, Unreal Engine 5, Unity, and QGIS.',
    },
    {
      q: 'How does SkyFusion ensure spatial accuracy without ground control points (GCPs)?',
      a: 'SkyFusion fuses onboard drone RTK-GPS metadata, IMU attitude telemetry, and transformer optical flow to automatically resolve scale and orientation, delivering sub-centimeter relative spatial precision.',
    },
  ];

  return (
    <section id="faq" className="scroll-mt-28 py-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-14 space-y-3">
        <Badge variant="cyan" hasDot>
          Technical Clarifications
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          Frequently Asked Questions.
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-sm-light dark:shadow-tactile-sm-dark overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-sf-surface-darkMuted transition-colors"
              >
                <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white pr-4">
                  {faq.q}
                </span>
                <span className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-sm sm:text-base font-sans text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
