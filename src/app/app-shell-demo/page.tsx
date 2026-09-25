'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TelemetryGauge } from '@/components/ui/TelemetryGauge';
import { SceneCanvas } from '@/components/canvas/SceneCanvas';
import { Hero3DScene } from '@/components/canvas/Hero3DScene';
import { MOCK_DRONE_FLEET, MOCK_RECONSTRUCTIONS, DroneFleetItem } from '@/services/mockData';
import { TelemetryService } from '@/services/apiClient';
import { Plane, Radio, Box, Battery, Navigation, ShieldCheck, RefreshCw, Eye } from 'lucide-react';

export default function AppShellDemoPage() {
  const [selectedDrone, setSelectedDrone] = useState<DroneFleetItem>(MOCK_DRONE_FLEET[0]);
  const [telemetry, setTelemetry] = useState({
    alt: selectedDrone.altitude,
    speed: selectedDrone.speed,
    pointsPerSec: 18400,
    voltage: 22.8,
  });

  useEffect(() => {
    const unsubscribe = TelemetryService.subscribeLiveTelemetry(selectedDrone.id, (tick) => {
      setTelemetry({
        alt: tick.altitude,
        speed: tick.groundSpeed,
        pointsPerSec: tick.pointsStreamedPerSec,
        voltage: tick.batteryVoltage,
      });
    });
    return () => unsubscribe();
  }, [selectedDrone]);

  return (
    <AppShell
      title="Fleet Tactical Mission Control"
      breadcrumbs={['SkyFusion', 'Mission Operations', 'Active Swarm Alpha']}
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Fleet Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TelemetryGauge
            label="Live Altitude"
            value={telemetry.alt.toFixed(1)}
            unit="m MSL"
            color="cyan"
            icon={<Navigation className="w-4 h-4" />}
            progressPercent={(telemetry.alt / 200) * 100}
          />
          <TelemetryGauge
            label="Airspeed"
            value={telemetry.speed.toFixed(1)}
            unit="km/h"
            color="amber"
            icon={<Plane className="w-4 h-4" />}
            progressPercent={(telemetry.speed / 80) * 100}
          />
          <TelemetryGauge
            label="Telemetry Stream"
            value={(telemetry.pointsPerSec / 1000).toFixed(1)}
            unit="k pts/s"
            color="emerald"
            icon={<Radio className="w-4 h-4" />}
            progressPercent={85}
          />
          <TelemetryGauge
            label="Battery State"
            value={selectedDrone.battery}
            unit="%"
            color="indigo"
            icon={<Battery className="w-4 h-4" />}
            progressPercent={selectedDrone.battery}
          />
        </div>

        {/* Main 3D Viewport + Fleet List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active 3D Spatial Mission Viewport */}
          <div className="lg:col-span-8 rounded-2xl bg-slate-950 border-2 border-slate-950 dark:border-sf-border-darkBright shadow-tactile-light dark:shadow-tactile-cyan overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">{selectedDrone.callsign}</span>
                <span className="text-sf-cyan">// 3D SPATIAL TRACKING</span>
              </div>
              <Badge variant="cyan" hasDot>
                RTK LOCKED (14 SATS)
              </Badge>
            </div>

            <div className="relative h-[460px] w-full">
              <SceneCanvas cameraPosition={[10, 8, 12]} fov={45}>
                <Hero3DScene />
              </SceneCanvas>

              {/* HUD Flight Data Overlay */}
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300 pointer-events-none space-y-1">
                <div>CALLSIGN: <span className="text-white font-bold">{selectedDrone.callsign}</span></div>
                <div>PAYLOAD: <span className="text-sf-cyan">{selectedDrone.activePayload}</span></div>
                <div>FPS: <span className="text-emerald-400">{selectedDrone.cameraFps} FPS 4K</span></div>
              </div>
            </div>
          </div>

          {/* Active Fleet List Selector */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Swarm Fleet Units
              </h3>
              <Badge variant="emerald">8 Units Nominal</Badge>
            </div>

            <div className="space-y-2.5">
              {MOCK_DRONE_FLEET.map((drone) => {
                const isSelected = selectedDrone.id === drone.id;
                return (
                  <div
                    key={drone.id}
                    onClick={() => setSelectedDrone(drone)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-sf-surface-dark border-sf-cyan shadow-tactile-sm-light dark:shadow-tactile-cyan'
                        : 'bg-white dark:bg-sf-surface-dark border-slate-300 dark:border-sf-border-dark hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Plane className={`w-4 h-4 ${isSelected ? 'text-sf-cyan' : 'text-slate-400'}`} />
                        <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                          {drone.callsign}
                        </span>
                      </div>
                      <Badge
                        variant={
                          drone.status === 'SCANNING'
                            ? 'amber'
                            : drone.status === 'ACTIVE'
                            ? 'emerald'
                            : drone.status === 'CALIBRATING'
                            ? 'cyan'
                            : 'rose'
                        }
                        hasDot
                      >
                        {drone.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <div>ALT: <span className="text-slate-900 dark:text-slate-200 font-bold">{drone.altitude}m</span></div>
                      <div>BATT: <span className="text-slate-900 dark:text-slate-200 font-bold">{drone.battery}%</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active 3D Reconstruction Queue */}
        <Card variant="tactical">
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Active 3D Reconstruction Pipeline Queue
              </h3>
              <p className="text-xs font-mono text-slate-500">Feed-forward neural passes in progress</p>
            </div>
            <Badge variant="indigo">3 Tasks Queued</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_RECONSTRUCTIONS.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-white dark:bg-sf-surface-dark border border-slate-300 dark:border-sf-border-dark space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-sf-cyan font-bold">{rec.id}</span>
                  <Badge variant={rec.status === 'COMPLETED' ? 'emerald' : 'cyan'}>
                    {rec.status}
                  </Badge>
                </div>

                <div className="font-display font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {rec.projectName}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>PROGRESS:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{rec.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sf-cyan h-full transition-all duration-300"
                      style={{ width: `${rec.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span>POINTS: {(rec.pointsGenerated / 1000000).toFixed(2)}M</span>
                  <span>CONF: {(rec.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
