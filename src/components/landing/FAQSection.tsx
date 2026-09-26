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
        <Badge variant="emerald" hasDot>
          Technical Clarifications
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
          Frequently Asked Questions.
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-3xl bg-slate-950/80 backdrop-blur-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                  : 'border-white/15 hover:border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="font-display font-bold text-base sm:text-lg text-white pr-4">
                  {faq.q}
                </span>
                <span className={`shrink-0 w-9 h-9 rounded-2xl border flex items-center justify-center transition-all ${
                  isOpen
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                    : 'bg-white/10 text-white border-white/20'
                }`}>
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 text-sm sm:text-base font-sans text-slate-300 leading-relaxed border-t border-white/10">
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
