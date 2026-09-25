'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Box,
  Compass,
  Download,
  Info,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Dialog } from '@/components/ui/Dialog';
import { Drawer } from '@/components/ui/Drawer';
import { Tooltip } from '@/components/ui/Tooltip';
import { Tabs } from '@/components/ui/Tabs';
import { TelemetryGauge } from '@/components/ui/TelemetryGauge';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { SceneCanvas } from '@/components/canvas/SceneCanvas';
import { Hero3DScene } from '@/components/canvas/Hero3DScene';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('primitives');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState(65);
  const [switchVal, setSwitchVal] = useState(true);
  const [selectVal, setSelectVal] = useState('opt1');

  return (
    <div className="min-h-screen bg-tactical-grid p-4 sm:p-8 max-w-7xl mx-auto space-y-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-light dark:shadow-tactile-dark">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              iconLeft={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Landing
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" hasDot>
                Phase 0 Spec
              </Badge>
              <span className="text-xs font-mono text-slate-500">v1.0 Design System</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              SkyFusion Design System & Component Library
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/app-shell-demo">
            <Button variant="tactical" size="sm">
              App Shell Demo →
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-center">
        <Tabs
          tabs={[
            { id: 'primitives', label: '1. UI Primitives', badge: 12 },
            { id: '3d-systems', label: '2. 3D Spatial System', badge: 'Three.js' },
            { id: 'tokens', label: '3. Color & Typography Tokens' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* TAB 1: UI PRIMITIVES */}
      {activeTab === 'primitives' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Buttons Section */}
          <Card variant="tactical" className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-300 dark:border-slate-800">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Buttons & Interactive Triggers
              </h2>
              <Badge variant="cyan">Tactile Neubrutalist</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Indigo</Button>
              <Button variant="tactical">Tactical Cyan</Button>
              <Button variant="secondary">Secondary Slate</Button>
              <Button variant="outline">Outline Border</Button>
              <Button variant="danger">Danger Rose</Button>
              <Button variant="ghost">Ghost Plain</Button>
              <Button variant="tactical" isLoading>
                Loading State
              </Button>
              <Button variant="tactical" size="sm" iconLeft={<Play className="w-3.5 h-3.5" />}>
                Small Icon
              </Button>
              <Button variant="primary" size="lg" iconRight={<Download className="w-4 h-4" />}>
                Large CTA
              </Button>
            </div>
          </Card>

          {/* Badges Section */}
          <Card variant="default" className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Status Badges & Telemetry Tokens
              </h2>
              <Badge variant="indigo">Pill & Square</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="cyan" hasDot>
                Active UAV
              </Badge>
              <Badge variant="emerald" hasDot>
                RTK Locked 0.8cm
              </Badge>
              <Badge variant="amber" hasDot>
                Scanning Trajectory
              </Badge>
              <Badge variant="rose" hasDot>
                Obstacle Alert
              </Badge>
              <Badge variant="indigo">Transformer Pass</Badge>
              <Badge variant="slate" isPill={false}>
                Format: .GLB
              </Badge>
            </div>
          </Card>

          {/* Form Inputs & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default" className="space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Inputs & Select
              </h3>
              <Input
                label="Mission Identifier"
                placeholder="e.g. SOMA_SECTOR_04"
                defaultValue="FLIGHT_PASS_A1"
              />
              <Select
                label="Sensor Payload Mode"
                options={[
                  { label: 'Dual 4K Stereo + LiDAR (Recommended)', value: 'opt1' },
                  { label: 'Multispectral Thermal 60fps', value: 'opt2' },
                  { label: 'Ultra-High 8K Photogrammetry', value: 'opt3' },
                ]}
              />
            </Card>

            <Card variant="default" className="space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Sliders & Toggles
              </h3>
              <Slider
                label="Point Cloud Confidence"
                min={50}
                max={99}
                value={sliderVal}
                valueDisplay={`${sliderVal}%`}
                onChange={setSliderVal}
              />
              <div className="pt-2">
                <Switch
                  label="Dynamic LiDAR Depth Filter"
                  description="Filter sky and reflective water surfaces"
                  checked={switchVal}
                  onChange={setSwitchVal}
                />
              </div>
            </Card>

            <Card variant="default" className="space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                  Modals & Drawers
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Trigger interactive dialog overlays and slide-over telemetry drawers.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Button
                  variant="tactical"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Open Tactical Dialog
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  Open Flight Log Drawer
                </Button>
              </div>
            </Card>
          </div>

          {/* Telemetry Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <TelemetryGauge
              label="Altitude (MSL)"
              value="142.5"
              unit="m"
              color="cyan"
              icon={<Radio className="w-4 h-4" />}
              progressPercent={65}
            />
            <TelemetryGauge
              label="Ground Speed"
              value="48.2"
              unit="km/h"
              color="amber"
              icon={<Compass className="w-4 h-4" />}
              progressPercent={78}
            />
            <TelemetryGauge
              label="Point Density"
              value="2.48M"
              unit="pts"
              color="emerald"
              icon={<Box className="w-4 h-4" />}
              progressPercent={88}
            />
            <TelemetryGauge
              label="Battery Reserve"
              value="84"
              unit="%"
              color="indigo"
              icon={<Sparkles className="w-4 h-4" />}
              progressPercent={84}
            />
          </div>

          {/* Tooltips Demo */}
          <Card variant="tactical" className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                Interactive Tooltip Triggers
              </h4>
              <p className="text-xs text-slate-500">Hover over elements to inspect tooltips</p>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip content="Sub-centimeter RTK GPS Fix" position="top">
                <Badge variant="cyan">Hover Top</Badge>
              </Tooltip>
              <Tooltip content="Streaming at 18,400 points per second" position="bottom">
                <Badge variant="amber">Hover Bottom</Badge>
              </Tooltip>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: 3D SPATIAL SYSTEM */}
      {activeTab === '3d-systems' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-white dark:bg-sf-surface-dark border-2 border-slate-950 dark:border-sf-border-dark shadow-tactile-light dark:shadow-tactile-dark">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
              Three.js + React Three Fiber + Drei Spatial Viewport
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono mb-6">
              Interactive WebGL canvas with procedural architectural terrain, LiDAR-colored point clouds, camera frustums, and animated quadcopter drone.
            </p>

            <div className="w-full h-[520px] rounded-2xl bg-slate-950 border-2 border-slate-900 overflow-hidden relative">
              <SceneCanvas cameraPosition={[10, 8, 12]} fov={45}>
                <Hero3DScene />
              </SceneCanvas>

              <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 pointer-events-none">
                <div className="text-sf-cyan font-bold">// 3D PIPELINE SPEC</div>
                <div>RENDER ENGINE: THREE.JS WebGL2</div>
                <div>POINTS RENDERED: 4,500 PARTICLES</div>
                <div>FRUSTUM POSES: 6 KEYFRAMES</div>
                <div>COORDINATES: WGS84 GEO-ALIGNED</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DESIGN TOKENS */}
      {activeTab === 'tokens' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Colors */}
          <Card variant="default">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
              Aero Command & Tactical Night Palette
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080B11] text-white border border-slate-700">
                <div className="font-bold">Dark Canvas</div>
                <div>#080B11</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0F1420] text-white border border-slate-700">
                <div className="font-bold">Dark Surface</div>
                <div>#0F1420</div>
              </div>
              <div className="p-3 rounded-xl bg-[#38BDF8] text-slate-950 font-bold">
                <div>Cyan Glow</div>
                <div>#38BDF8</div>
              </div>
              <div className="p-3 rounded-xl bg-[#6366F1] text-white font-bold">
                <div>Swarm Indigo</div>
                <div>#6366F1</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F59E0B] text-slate-950 font-bold">
                <div>Telemetry Amber</div>
                <div>#F59E0B</div>
              </div>
              <div className="p-3 rounded-xl bg-[#10B981] text-slate-950 font-bold">
                <div>Emerald Active</div>
                <div>#10B981</div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card variant="tactical">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
              Typography Hierarchy
            </h3>
            <div className="space-y-4">
              <div className="border-b pb-3 border-slate-300 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-500">DISPLAY (Space Grotesk - 700 / 800)</div>
                <div className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                  Autonomous UAV Swarm Telemetry & 3D Reconstruction
                </div>
              </div>
              <div className="border-b pb-3 border-slate-300 dark:border-slate-800">
                <div className="text-xs font-mono text-slate-500">BODY (Inter - 400 / 500)</div>
                <div className="font-sans text-base text-slate-700 dark:text-slate-300">
                  Stream high-resolution aerial photogrammetry into geo-referenced point clouds with sub-centimeter accuracy.
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-slate-500">TELEMETRY & MONO (JetBrains Mono - 600)</div>
                <div className="font-mono text-sm text-sf-cyan">
                  LAT: 37.7749° N | LNG: 122.4194° W | ALT: 142.5m | HDOP: 0.8 | SATS: 14
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Interactive Modal Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Initiate Swarm 3D Scan"
        description="Verify flight boundary parameters before broadcasting route to UAV fleet."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="tactical"
              size="sm"
              onClick={() => {
                alert('Mission trajectory uploaded to SPECTRE-1!');
                setIsDialogOpen(false);
              }}
            >
              Confirm & Launch
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-sf-surface-darkMuted border border-slate-300 dark:border-slate-800 space-y-1">
            <div className="text-slate-500">SELECTED UAV: <span className="text-slate-900 dark:text-white font-bold">SPECTRE-1</span></div>
            <div className="text-slate-500">FLIGHT ALTITUDE: <span className="text-sf-cyan font-bold">142.0 meters MSL</span></div>
            <div className="text-slate-500">OVERLAP RATIO: <span className="text-emerald-500 font-bold">85% Forward / 75% Side</span></div>
          </div>
          <p className="text-slate-500 font-sans text-xs">
            Autonomous collision avoidance radar will remain engaged throughout the scan.
          </p>
        </div>
      </Dialog>

      {/* Interactive Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="UAV Flight Log & Telemetry"
        subtitle="SPECTRE-1 // REAL-TIME EVENT STREAM"
      >
        <div className="space-y-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
            [22:15:04] GPS 3D FIX: 14 Satellites acquired. RTK Locked.
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-sf-surface-darkMuted border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200">
            [22:15:20] Takeoff complete. Reached survey altitude 142.5m.
          </div>
          <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/40 text-sky-300">
            [22:16:01] 3D Point cloud feed engaged: 18,400 pts/sec.
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300">
            [22:17:33] Wind shear compensated: Ground speed steady at 48.2 km/h.
          </div>
        </div>
      </Drawer>
    </div>
  );
}
