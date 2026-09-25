'use client';

import React from 'react';
import {
  Box,
  Compass,
  Camera,
  Activity,
  Radio,
  FileCode2,
  Sparkles,
  Layers,
  Cpu,
  Eye,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const CapabilitiesGrid: React.FC = () => {
  const capabilities = [
    {
      id: 'cap-1',
      title: 'Neural Point Clouds & Depth Estimation',
      category: '3D SPATIAL ENGINE',
      description:
        'Transform multi-angle 4K aerial frames directly into high-density 3D point clouds with per-pixel depth and confidence scoring in a single feed-forward pass.',
      icon: Box,
      badgeVariant: 'cyan' as const,
      cardVariant: 'accent-cyan' as const,
      stat: '10M+ Pts / Scan',
    },
    {
      id: 'cap-2',
      title: 'Autonomous Swarm Trajectory Planning',
      category: 'FLEET NAVIGATION',
      description:
        'AI-driven multi-drone flight route optimization ensures complete geometric overlap and eliminates blind spots while dynamically avoiding physical obstacles.',
      icon: Compass,
      badgeVariant: 'indigo' as const,
      cardVariant: 'accent-indigo' as const,
      stat: 'Sub-second Reroute',
    },
    {
      id: 'cap-3',
      title: 'Sub-Centimeter Pose Calibration',
      category: 'PHOTOGRAMMETRY',
      description:
        'Computes precise extrinsic camera angles and intrinsic optical parameters per frame without physical ground control points (GCPs).',
      icon: Camera,
      badgeVariant: 'amber' as const,
      cardVariant: 'accent-amber' as const,
      stat: '0.8cm Precision',
    },
    {
      id: 'cap-4',
      title: 'Real-Time Spatial Computer Vision',
      category: 'PERCEPTION',
      description:
        'On-the-fly volumetric measurement, structural integrity anomaly detection, thermal hotspot tracking, and automatic object segmentation.',
      icon: Eye,
      badgeVariant: 'emerald' as const,
      cardVariant: 'accent-emerald' as const,
      stat: '60 FPS Inference',
    },
    {
      id: 'cap-5',
      title: 'Low-Latency Telemetry Pipeline',
      category: 'TELEMETRY STREAM',
      description:
        'WebSocket architecture streaming 3D spatial points, attitude coordinates, battery voltage, and sensor health directly from base stations to web clients.',
      icon: Radio,
      badgeVariant: 'rose' as const,
      cardVariant: 'default' as const,
      stat: '< 15ms Latency',
    },
    {
      id: 'cap-6',
      title: 'Universal 3D Digital Twin Export',
      category: 'INTEROPERABILITY',
      description:
        'One-click export into GLB, LAS, PLY, OBJ, and 3D Cesium Tiles ready for Blender, Unreal Engine 5, Unity, ArcGIS, and custom GIS viewers.',
      icon: FileCode2,
      badgeVariant: 'indigo' as const,
      cardVariant: 'accent-indigo' as const,
      stat: '5 Standard Formats',
    },
  ];

  return (
    <section id="capabilities" className="scroll-mt-28 py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <Badge variant="indigo" hasDot>
          Aerospace Capabilities
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          Engineered for Extreme Spatial Precision.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-sans">
          SkyFusion unifies autonomous drone fleet coordination with state-of-the-art neural 3D scene reconstruction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <Card
              key={cap.id}
              variant={cap.cardVariant}
              isInteractive
              className="flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-sf-surface-darkMuted border-2 border-slate-950 dark:border-sf-border-dark flex items-center justify-center text-slate-900 dark:text-white shadow-tactile-sm-light dark:shadow-tactile-sm-dark">
                    <Icon className="w-6 h-6 text-sf-cyan" />
                  </div>
                  <Badge variant={cap.badgeVariant}>{cap.category}</Badge>
                </div>

                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {cap.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">BENCHMARK:</span>
                <span className="font-bold text-slate-900 dark:text-sf-cyan">{cap.stat}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
