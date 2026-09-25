'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Sliders, CheckCircle2, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { SceneCanvas } from '../canvas/SceneCanvas';
import { Hero3DScene } from '../canvas/Hero3DScene';

export const PipelineDemo: React.FC = () => {
  const [stage, setStage] = useState<'INGEST' | 'FEATURES' | 'POSES' | 'POINT_CLOUD'>('POINT_CLOUD');
  const [confidence, setConfidence] = useState(0.95);
  const [pointDensity, setPointDensity] = useState(4800);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunPass = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStage('POINT_CLOUD');
    }, 1200);
  };

  return (
    <section id="pipeline" className="scroll-mt-28 py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <Badge variant="amber" hasDot>
          Interactive 3D Pipeline
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
          Feed-Forward 3D Reconstruction Demo.
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-sans">
          Experiment with point cloud thresholds, camera pose extraction, and instant digital twin meshing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Pipeline Stage & Slider Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-dark space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                // PIPELINE CONTROLS
              </span>
              <Badge variant="cyan">Zero GPU Config</Badge>
            </div>

            {/* Pipeline Stage Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-slate-700 dark:text-slate-300">
                Select Active Pipeline Layer:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 'INGEST', label: '1. Video Ingest' },
                  { id: 'FEATURES', label: '2. Neural Features' },
                  { id: 'POSES', label: '3. Camera Poses' },
                  { id: 'POINT_CLOUD', label: '4. 3D Point Cloud' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStage(item.id as any)}
                    className={`p-2.5 rounded-lg border-2 text-left font-semibold transition-all ${
                      stage === item.id
                        ? 'bg-sf-cyan text-slate-950 border-slate-950 shadow-tactile-sm-light'
                        : 'bg-slate-100 dark:bg-sf-surface-darkMuted text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <Slider
                label="Confidence Threshold"
                min={0.7}
                max={0.99}
                step={0.01}
                value={confidence}
                valueDisplay={`${(confidence * 100).toFixed(0)}%`}
                onChange={setConfidence}
              />

              <Slider
                label="Point Cloud Density"
                min={1000}
                max={9000}
                step={500}
                value={pointDensity}
                valueDisplay={`${pointDensity} pts`}
                onChange={setPointDensity}
              />
            </div>
          </div>

          <div className="pt-6 border-t-2 border-slate-950/10 dark:border-slate-800 flex items-center justify-between gap-3">
            <Button
              variant="tactical"
              onClick={handleRunPass}
              isLoading={isProcessing}
              iconLeft={<RefreshCw className="w-4 h-4" />}
            >
              Recompute Pass
            </Button>

            <Button
              variant="outline"
              size="sm"
              iconRight={<Download className="w-3.5 h-3.5" />}
              onClick={() => alert('Demo GLB asset download queued!')}
            >
              Export .GLB
            </Button>
          </div>
        </div>

        {/* Right Side: Live Reactive 3D Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950 border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-cyan overflow-hidden relative min-h-[420px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              VIEWPORT: {stage} // REAL-TIME WEBGL
            </span>
            <span className="text-sf-cyan">{pointDensity} VECTORS</span>
          </div>

          <div className="flex-1 relative">
            <SceneCanvas cameraPosition={[6, 5, 8]} fov={48} className="w-full h-full min-h-[380px]">
              <Hero3DScene
                showPointCloud={stage === 'POINT_CLOUD' || stage === 'FEATURES'}
                showFrustums={stage === 'POSES' || stage === 'POINT_CLOUD'}
                showTerrain={stage === 'POINT_CLOUD' || stage === 'INGEST'}
                showFlightPath={stage === 'POSES' || stage === 'POINT_CLOUD'}
                pointCount={pointDensity}
              />
            </SceneCanvas>

            {/* Stage Indicator Overlay */}
            <div className="absolute bottom-4 left-4 pointer-events-none p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
              <div className="text-sf-amber font-bold">// STAGE TELEMETRY</div>
              <div>CONFIDENCE: <span className="text-white">{(confidence * 100).toFixed(1)}%</span></div>
              <div>ESTIMATED ERROR: <span className="text-emerald-400">&lt; 0.62mm</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
