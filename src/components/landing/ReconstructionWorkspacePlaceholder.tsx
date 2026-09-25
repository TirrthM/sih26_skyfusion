'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  Box,
  Sliders,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Film,
  Camera,
  Compass,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SceneCanvas } from '../canvas/SceneCanvas';
import { Hero3DScene } from '../canvas/Hero3DScene';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const ReconstructionWorkspacePlaceholder: React.FC = () => {
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();

  // 3D Viewport Layer Visibility Toggles
  const [showTerrain, setShowTerrain] = useState(true);
  const [showPointCloud, setShowPointCloud] = useState(true);
  const [showFrustums, setShowFrustums] = useState(true);
  const [showFlightPath, setShowFlightPath] = useState(true);
  const [showDrone, setShowDrone] = useState(true);

  return (
    <section
      id="reconstruction"
      className="scroll-mt-28 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Small Compact SkyFusion Tagline */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2">
          <Badge variant="cyan" hasDot>
            SINGLE-PASS UAV 3D RECONSTRUCTION
          </Badge>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            v1.0 Workstation
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
          Transform One Drone Flight into an Explorable 3D Scene.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans max-w-lg mx-auto">
          Feed-forward neural reconstruction workspace. Ingest raw aerial video and generate dense 3D point clouds with camera poses in minutes.
        </p>
      </div>

      {/* Reconstruction Workspace Container (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[500px] lg:min-h-[580px]">
        {/* Left Column: Input Controls Placeholder Surface (42% width) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-dark">
          <div className="space-y-5">
            {/* Header & Status */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sf-cyan/20 border border-sf-cyan text-sf-cyan flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Flight Video & Telemetry Input
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    UAV INGESTION ENGINE
                  </span>
                </div>
              </div>
              <Badge variant="indigo">PHASE 2 MODULE</Badge>
            </div>

            {/* Video Upload Dropzone Placeholder */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center space-y-3 bg-slate-50/50 dark:bg-sf-surface-darkMuted/50 hover:border-sf-cyan transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 mx-auto flex items-center justify-center text-slate-600 dark:text-slate-400">
                <UploadCloud className="w-6 h-6 text-sf-cyan" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  DRAG & DROP DRONE VIDEO / IMAGE SET
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Supports MP4, MOV, AVI, JPG, PNG & RTK GPS Telemetry
                </p>
              </div>
              <div className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Input controls active in Phase 2
              </div>
            </div>

            {/* Parameter Placeholders */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-sf-surface-darkMuted border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>ESTIMATION MODE:</span>
                <span className="text-slate-900 dark:text-white font-bold">SINGLE-PASS FEED-FORWARD</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>POSE EXTRACTION:</span>
                <span className="text-sf-cyan font-bold">AUTO CAMERA FRUSTUMS</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>POINT RESOLUTION:</span>
                <span className="text-sf-amber font-bold">SUB-CENTIMETER RTK</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Placeholder */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <Button
              variant="tactical"
              className="w-full"
              iconLeft={<Play className="w-4 h-4" />}
              onClick={() => {
                const el = document.getElementById('pipeline');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ready For Flight Data
            </Button>
          </div>
        </div>

        {/* Right Column: 3D Reconstruction Viewer Placeholder (58% width) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950 border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-cyan overflow-hidden flex flex-col relative">
          {/* Viewer Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-slate-900 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-slate-900 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-slate-900 inline-block" />
              <span className="ml-2 font-bold text-white">
                RECONSTRUCTION VIEWER // READY FOR INGESTION
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleReducedMotion}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  reducedMotion
                    ? 'bg-sf-amber text-slate-950 border-slate-900'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {reducedMotion ? 'MOTION: PAUSED' : 'MOTION: AUTO'}
              </button>
            </div>
          </div>

          {/* Interactive 3D Canvas Viewport */}
          <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] bg-slate-950">
            <SceneCanvas cameraPosition={[8, 7, 10]} fov={45} className="w-full h-full">
              <Hero3DScene
                reducedMotion={reducedMotion}
                showTerrain={showTerrain}
                showPointCloud={showPointCloud}
                showFrustums={showFrustums}
                showFlightPath={showFlightPath}
                showDrone={showDrone}
              />
            </SceneCanvas>

            {/* Standby Watermark Overlay */}
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 pointer-events-none space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">3D SPATIAL ENGINE</span>
                <span className="text-sf-cyan">[STANDBY]</span>
              </div>
              <div className="text-slate-400">
                YOUR 3D RECONSTRUCTION WILL APPEAR HERE
              </div>
              <div className="text-[10px] text-slate-500">
                ORBIT: 360° WEBGL | DENSE POINT CLOUD READY
              </div>
            </div>

            {/* Orbit Instruction Overlay */}
            <div className="absolute top-4 right-4 pointer-events-none px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-400">
              <span>🖱️ Drag to Orbit 3D Scene</span>
            </div>

            {/* 3D Layer Controls Toolbar */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 max-w-[95%] overflow-x-auto">
              <button
                onClick={() => setShowPointCloud(!showPointCloud)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showPointCloud
                    ? 'bg-sf-cyan text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Points
              </button>
              <button
                onClick={() => setShowTerrain(!showTerrain)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showTerrain
                    ? 'bg-sf-indigo text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Buildings
              </button>
              <button
                onClick={() => setShowFrustums(!showFrustums)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showFrustums
                    ? 'bg-sf-amber text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Frustums
              </button>
              <button
                onClick={() => setShowFlightPath(!showFlightPath)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showFlightPath
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Flight Path
              </button>
              <button
                onClick={() => setShowDrone(!showDrone)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  showDrone
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Drone
              </button>
            </div>
          </div>

          {/* Quick Export Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs font-mono">
            <span className="text-slate-500">EXPORTS:</span>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">.GLB</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">.LAS</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">.PLY</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-slate-300">CESIUM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
