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
        <Badge variant="emerald" hasDot>
          Interactive 3D Pipeline
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
          Feed-Forward 3D Reconstruction Demo.
        </h2>
        <p className="text-slate-300 text-sm sm:text-base font-sans">
          Experiment with point cloud thresholds, camera pose extraction, and instant digital twin meshing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Pipeline Stage & Slider Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3 border-white/10">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                // PIPELINE CONTROLS
              </span>
              <Badge variant="cyan">Zero GPU Config</Badge>
            </div>

            {/* Pipeline Stage Selectors */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-semibold uppercase text-slate-300">
                Select Active Pipeline Layer:
              </label>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                {[
                  { id: 'INGEST', label: '1. Video Ingest' },
                  { id: 'FEATURES', label: '2. Neural Features' },
                  { id: 'POSES', label: '3. Camera Poses' },
                  { id: 'POINT_CLOUD', label: '4. 3D Point Cloud' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStage(item.id as any)}
                    className={`p-3 rounded-2xl border text-left font-semibold transition-all ${
                      stage === item.id
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)] font-bold'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-emerald-400/40 hover:bg-white/10'
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

          <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
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
        <div className="lg:col-span-7 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden relative min-h-[440px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-white/10 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              VIEWPORT: {stage} // REAL-TIME WEBGL
            </span>
            <span className="text-emerald-400 font-bold">{pointDensity} VECTORS</span>
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
            <div className="absolute bottom-4 left-4 pointer-events-none p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-xs font-mono space-y-1 text-slate-300 shadow-xl">
              <div className="text-amber-300 font-bold">// STAGE TELEMETRY</div>
              <div>CONFIDENCE: <span className="text-white">{(confidence * 100).toFixed(1)}%</span></div>
              <div>ESTIMATED ERROR: <span className="text-emerald-400">&lt; 0.62mm</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
