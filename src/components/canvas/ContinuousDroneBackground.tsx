'use client';

import React, { useEffect, useRef } from 'react';

interface DroneNode {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  altitude: number;
  heading: number;
  battery: number;
  trail: { x: number; y: number }[];
  maxTrail: number;
}

interface WaypointNode {
  x: number;
  y: number;
  radius: number;
  pulsePhase: number;
  label: string;
}

export const ContinuousDroneBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial Waypoints
    const waypoints: WaypointNode[] = [
      { x: width * 0.15, y: height * 0.25, radius: 4, pulsePhase: 0, label: 'WP-ALPHA' },
      { x: width * 0.82, y: height * 0.2, radius: 4, pulsePhase: 1.2, label: 'WP-BRAVO' },
      { x: width * 0.75, y: height * 0.7, radius: 4, pulsePhase: 2.4, label: 'WP-CHARLIE' },
      { x: width * 0.22, y: height * 0.8, radius: 4, pulsePhase: 3.6, label: 'WP-DELTA' },
      { x: width * 0.5, y: height * 0.45, radius: 5, pulsePhase: 4.8, label: 'HUB-CENTRAL' },
    ];

    // Initialize Autonomous UAV Swarm Agents
    const drones: DroneNode[] = [
      {
        id: 'UAV-01',
        x: width * 0.2,
        y: height * 0.3,
        targetX: width * 0.8,
        targetY: height * 0.25,
        speed: 0.65,
        altitude: 120,
        heading: 45,
        battery: 94,
        trail: [],
        maxTrail: 35,
      },
      {
        id: 'UAV-02',
        x: width * 0.8,
        y: height * 0.25,
        targetX: width * 0.75,
        targetY: height * 0.75,
        speed: 0.55,
        altitude: 95,
        heading: 160,
        battery: 88,
        trail: [],
        maxTrail: 40,
      },
      {
        id: 'UAV-03',
        x: width * 0.7,
        y: height * 0.75,
        targetX: width * 0.25,
        targetY: height * 0.8,
        speed: 0.7,
        altitude: 110,
        heading: 230,
        battery: 91,
        trail: [],
        maxTrail: 30,
      },
      {
        id: 'UAV-04',
        x: width * 0.25,
        y: height * 0.8,
        targetX: width * 0.5,
        targetY: height * 0.4,
        speed: 0.6,
        altitude: 140,
        heading: 320,
        battery: 82,
        trail: [],
        maxTrail: 35,
      },
      {
        id: 'UAV-05',
        x: width * 0.5,
        y: height * 0.4,
        targetX: width * 0.2,
        targetY: height * 0.3,
        speed: 0.5,
        altitude: 105,
        heading: 290,
        battery: 96,
        trail: [],
        maxTrail: 45,
      },
    ];

    let globalTick = 0;

    const render = () => {
      globalTick += 0.015;

      // Detect dark mode
      const isDark = document.documentElement.classList.contains('dark');

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient atmospheric glow orbs (smooth defense lighting)
      const grad1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.3,
        0,
        width * 0.2,
        height * 0.3,
        width * 0.45
      );
      grad1.addColorStop(0, isDark ? 'rgba(6, 182, 212, 0.06)' : 'rgba(2, 132, 199, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.6,
        0,
        width * 0.8,
        height * 0.6,
        width * 0.45
      );
      grad2.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.04)' : 'rgba(5, 150, 105, 0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Connected Telemetry Laser Data-Links between nearby Waypoints and Drones
      ctx.lineWidth = 1;
      for (let i = 0; i < drones.length; i++) {
        for (let j = i + 1; j < drones.length; j++) {
          const dx = drones[i].x - drones[j].x;
          const dy = drones[i].y - drones[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < width * 0.35) {
            const alpha = (1 - dist / (width * 0.35)) * (isDark ? 0.18 : 0.1);
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${alpha})`
              : `rgba(2, 132, 199, ${alpha})`;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.moveTo(drones[i].x, drones[i].y);
            ctx.lineTo(drones[j].x, drones[j].y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // 3. Draw Waypoints & Radar Nodes
      waypoints.forEach((wp, index) => {
        wp.pulsePhase += 0.025;
        const pulseSize = (Math.sin(wp.pulsePhase) + 1) * 6;
        const pulseAlpha = Math.max(0, (1 - pulseSize / 12) * (isDark ? 0.35 : 0.2));

        // Pulsing radar ring
        ctx.strokeStyle = isDark
          ? `rgba(6, 182, 212, ${pulseAlpha})`
          : `rgba(2, 132, 199, ${pulseAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.radius + pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // Core waypoint point
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.7)' : 'rgba(2, 132, 199, 0.6)';
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.radius, 0, Math.PI * 2);
        ctx.fill();

        // Waypoint Label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.45)' : 'rgba(100, 116, 139, 0.55)';
        ctx.fillText(`+ ${wp.label}`, wp.x + 8, wp.y + 3);
      });

      // 4. Update and Draw Autonomous Drone Agents
      drones.forEach((drone) => {
        // Move towards target
        const dx = drone.targetX - drone.x;
        const dy = drone.targetY - drone.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          // Pick new randomized target waypoint or area
          const targetWp = waypoints[Math.floor(Math.random() * waypoints.length)];
          drone.targetX = targetWp.x + (Math.random() - 0.5) * 80;
          drone.targetY = targetWp.y + (Math.random() - 0.5) * 80;
        } else {
          drone.heading = Math.atan2(dy, dx);
          drone.x += Math.cos(drone.heading) * drone.speed;
          drone.y += Math.sin(drone.heading) * drone.speed;
        }

        // Add to flight trail
        drone.trail.push({ x: drone.x, y: drone.y });
        if (drone.trail.length > drone.maxTrail) {
          drone.trail.shift();
        }

        // Draw Flight Path Laser Trail
        if (drone.trail.length > 1) {
          for (let k = 0; k < drone.trail.length - 1; k++) {
            const ratio = k / drone.trail.length;
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${ratio * 0.35})`
              : `rgba(2, 132, 199, ${ratio * 0.25})`;
            ctx.lineWidth = ratio * 1.5 + 0.5;
            ctx.beginPath();
            ctx.moveTo(drone.trail[k].x, drone.trail[k].y);
            ctx.lineTo(drone.trail[k + 1].x, drone.trail[k + 1].y);
            ctx.stroke();
          }
        }

        // Draw Drone Silhouette / Hexacopter Icon
        ctx.save();
        ctx.translate(drone.x, drone.y);
        ctx.rotate(drone.heading + Math.PI / 2);

        // Rotor arms
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.85)' : 'rgba(2, 132, 199, 0.85)';
        ctx.lineWidth = 1.2;

        // Cross frame
        ctx.beginPath();
        ctx.moveTo(-7, -7);
        ctx.lineTo(7, 7);
        ctx.moveTo(7, -7);
        ctx.lineTo(-7, 7);
        ctx.stroke();

        // 4 Rotors (pulsing)
        const rotorSpin = Math.sin(globalTick * 12) * 2;
        ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.9)' : 'rgba(5, 150, 105, 0.9)';
        [
          [-7, -7],
          [7, -7],
          [-7, 7],
          [7, 7],
        ].forEach(([rx, ry]) => {
          ctx.beginPath();
          ctx.arc(rx, ry, 2 + rotorSpin * 0.3, 0, Math.PI * 2);
          ctx.fill();
        });

        // Center fuselage
        ctx.fillStyle = isDark ? '#38BDF8' : '#0284C7';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Telemetry readout alongside drone
        ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.8)' : 'rgba(2, 132, 199, 0.9)';
        ctx.fillText(`${drone.id} • ${drone.altitude}m`, drone.x + 12, drone.y - 4);

        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.6)';
        ctx.fillText(`BAT: ${drone.battery}%`, drone.x + 12, drone.y + 6);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-75 dark:opacity-85 transition-opacity"
      />
    </div>
  );
};
