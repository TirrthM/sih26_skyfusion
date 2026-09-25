'use client';

import React from 'react';
import { Plane, Cpu, Box, Share2, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const WorkflowSteps: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Autonomous Swarm Survey',
      description:
        'Deploy pre-programmed flight patterns. Drones execute coordinated multi-angle passes capturing 4K stereo video and LiDAR depth scans.',
      icon: Plane,
      tag: 'AERIAL RECON',
    },
    {
      step: '02',
      title: 'Neural Ingestion & Pose Extraction',
      description:
        'Video feeds stream to the feed-forward transformer pipeline. Camera extrinsics and focal calibration are estimated in real-time.',
      icon: Cpu,
      tag: 'TRANSFORMER PASS',
    },
    {
      step: '03',
      title: 'Dense 3D Reconstruction',
      description:
        'Scene geometry is resolved into a geo-referenced 3D point cloud with textured surface meshes and volumetric depth confidence maps.',
      icon: Box,
      tag: 'SPATIAL SYNTHESIS',
    },
    {
      step: '04',
      title: 'Interactive Twin & Export',
      description:
        'Inspect, measure volumes, and export production-ready GLB, LAS, and Cesium 3D tiles for CAD, GIS, VFX, or emergency operations.',
      icon: Share2,
      tag: 'DIGITAL TWIN',
    },
  ];

  return (
    <section id="workflow" className="scroll-mt-28 py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <Badge variant="emerald" hasDot>
          Flight to Digital Twin
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          4 Steps. Zero Setup Hassle.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-sans">
          From takeoff to a high-fidelity interactive 3D model in under 2 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.step}
              variant="tactical"
              className="flex flex-col justify-between relative group hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-10 h-10 rounded-xl bg-slate-900 text-sf-cyan border-2 border-slate-950 flex items-center justify-center font-mono font-bold text-sm shadow-tactile-sm-light">
                    {item.step}
                  </span>
                  <Badge variant="slate">{item.tag}</Badge>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>STAGE {item.step} / 04</span>
                <Icon className="w-4 h-4 text-sf-cyan" />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
