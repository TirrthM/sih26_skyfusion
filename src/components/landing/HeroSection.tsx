'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Radio,
  Layers,
  Eye,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  Plane,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SceneCanvas } from '../canvas/SceneCanvas';
import { Hero3DScene } from '../canvas/Hero3DScene';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const HeroSection: React.FC = () => {
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();

  // Layer Visibility Toggles in 3D Viewport
  const [showTerrain, setShowTerrain] = useState(true);
  const [showPointCloud, setShowPointCloud] = useState(true);
  const [showFrustums, setShowFrustums] = useState(true);
  const [showFlightPath, setShowFlightPath] = useState(true);
  const [showDrone, setShowDrone] = useState(true);

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial-telemetry-light dark:bg-radial-telemetry-dark blur-2xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Mission Narrative & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2">
            <Badge variant="cyan" hasDot>
              Autonomous Aerial Intelligence
            </Badge>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              v1.0-RC
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08]">
            Turn Drone Video into{' '}
            <span className="text-sf-indigo dark:text-sf-cyan underline decoration-sf-amber decoration-4 underline-offset-4">
              Dense 3D Scenes
            </span>{' '}
            in Minutes.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-sans leading-relaxed max-w-xl">
            Autonomous multi-UAV swarm telemetry meets feed-forward 3D reconstruction.
            Stream 4K aerial footage directly into geo-referenced point clouds, neural meshes,
            and sub-centimeter digital twins with zero manual ground control points.
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link href="/app-shell-demo">
              <Button
                variant="tactical"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
              >
                Launch Mission Console
              </Button>
            </Link>

            <Link href="/design-system">
              <Button
                variant="secondary"
                size="lg"
                iconLeft={<Sliders className="w-4 h-4" />}
              >
                Explore Design System
              </Button>
            </Link>
          </div>

          {/* Value Metric Ticker */}
          <div className="pt-4 grid grid-cols-3 gap-3 border-t-2 border-slate-950/10 dark:border-slate-800">
            <div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-sf-cyan">
                &lt; 90s
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Inference Time
              </div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-sf-amber">
                0.8 cm
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Spatial Accuracy
              </div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-emerald-500">
                60 FPS
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Real-time 3D Stream
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Mission Control Window */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-cyan overflow-hidden">
            {/* Tactical Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-sf-surface-darkMuted border-b-2 border-slate-950 dark:border-sf-border-dark">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-slate-900 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-slate-900 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-slate-900 inline-block" />
                <span className="ml-2 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  UAV-ALPHA-01 // LIVE_3D_ORBIT.sf
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleReducedMotion}
                  title="Toggle Reduced Motion"
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    reducedMotion
                      ? 'bg-sf-amber text-slate-950 border-slate-900'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-700'
                  }`}
                >
                  {reducedMotion ? 'MOTION: PAUSED' : 'MOTION: AUTO'}
                </button>
              </div>
            </div>

            {/* 3D Scene Canvas Container with HUD Overlays */}
            <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-950">
              <SceneCanvas cameraPosition={[8, 7, 10]} fov={45}>
                <Hero3DScene
                  reducedMotion={reducedMotion}
                  showTerrain={showTerrain}
                  showPointCloud={showPointCloud}
                  showFrustums={showFrustums}
                  showFlightPath={showFlightPath}
                  showDrone={showDrone}
                />
              </SceneCanvas>

              {/* HUD Telemetry Overlay (Top Left) */}
              <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1 p-2.5 rounded-lg bg-slate-950/80 backdrop-blur-xs border border-slate-800 text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">SPECTRE-1</span>
                  <span className="text-sf-cyan">[ACTIVE SCAN]</span>
                </div>
                <div>ALT: <span className="text-white font-bold">142.5m</span> | SPD: <span className="text-white font-bold">48.2 km/h</span></div>
                <div>POINTS: <span className="text-sf-amber font-bold">2.48M pts</span></div>
                <div>POSE CONFIDENCE: <span className="text-emerald-400 font-bold">98.4%</span></div>
              </div>

              {/* Orbit Controls Hint Overlay (Top Right) */}
              <div className="absolute top-3 right-3 pointer-events-none px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-400">
                <span>🖱️ Click & Drag to Orbit</span>
              </div>

              {/* 3D Layer Controls Toolbar (Bottom Center) */}
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
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-sf-surface-dark border-t-2 border-slate-950 dark:border-sf-border-dark text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">OUTPUT COMPATIBLE:</span>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">.GLB</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">.LAS</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">.PLY</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200">CESIUM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
