'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface PointCloud3DProps {
  count?: number;
  reducedMotion?: boolean;
}

export const PointCloud3D: React.FC<PointCloud3DProps> = ({
  count = 4500,
  reducedMotion = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color('#38BDF8'); // Cyan — ground / base
    const color2 = new THREE.Color('#10B981'); // Emerald — low walls
    const color3 = new THREE.Color('#F59E0B'); // Amber — mid height
    const color4 = new THREE.Color('#A855F7'); // Purple — rooftops / high
    const color5 = new THREE.Color('#EC4899'); // Pink — peak features

    // Building definitions to cluster points around (matching Terrain3D)
    const buildings = [
      { cx: -4, cz: -3, w: 2.4, h: 3.2, d: 2.4 },
      { cx: -1.2, cz: -5, w: 1.8, h: 5.8, d: 1.8 },
      { cx: 3, cz: -4, w: 2.8, h: 4.0, d: 2.6 },
      { cx: 5.5, cz: -1.5, w: 2.0, h: 2.6, d: 2.0 },
      { cx: -4.8, cz: 1.8, w: 1.8, h: 1.8, d: 2.8 },
      { cx: -2.5, cz: 3.5, w: 1.5, h: 1.2, d: 1.5 },
      { cx: 3.2, cz: 3, w: 2.6, h: 3.6, d: 2.2 },
      { cx: 0.5, cz: 3.8, w: 1.6, h: 1.4, d: 1.8 },
      { cx: 1.5, cz: -2, w: 1.4, h: 2.6, d: 1.4 },
      { cx: -3, cz: -6, w: 1.6, h: 2.0, d: 1.6 },
      { cx: 5.5, cz: 3.5, w: 1.2, h: 2.2, d: 1.6 },
    ];

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;

      // 30% ground scatter, 60% building surface, 10% noise
      const roll = Math.random();

      if (roll < 0.30) {
        // Ground terrain scatter (flat)
        x = (Math.random() - 0.5) * 18;
        z = (Math.random() - 0.5) * 18;
        y = -2 + Math.random() * 0.2;
      } else if (roll < 0.90) {
        // Building surface cluster — pick a random building
        const b = buildings[Math.floor(Math.random() * buildings.length)];
        const face = Math.floor(Math.random() * 5); // 4 walls + roof

        if (face === 0) {
          // Rooftop scatter
          x = b.cx + (Math.random() - 0.5) * b.w;
          z = b.cz + (Math.random() - 0.5) * b.d;
          y = -2 + b.h + (Math.random() - 0.5) * 0.15;
        } else if (face === 1) {
          // Front wall
          x = b.cx + (Math.random() - 0.5) * b.w;
          z = b.cz + b.d / 2 + (Math.random() - 0.5) * 0.1;
          y = -2 + Math.random() * b.h;
        } else if (face === 2) {
          // Back wall
          x = b.cx + (Math.random() - 0.5) * b.w;
          z = b.cz - b.d / 2 + (Math.random() - 0.5) * 0.1;
          y = -2 + Math.random() * b.h;
        } else if (face === 3) {
          // Left wall
          x = b.cx - b.w / 2 + (Math.random() - 0.5) * 0.1;
          z = b.cz + (Math.random() - 0.5) * b.d;
          y = -2 + Math.random() * b.h;
        } else {
          // Right wall
          x = b.cx + b.w / 2 + (Math.random() - 0.5) * 0.1;
          z = b.cz + (Math.random() - 0.5) * b.d;
          y = -2 + Math.random() * b.h;
        }
      } else {
        // Atmospheric noise / scan artifacts
        x = (Math.random() - 0.5) * 14;
        z = (Math.random() - 0.5) * 14;
        y = -2 + Math.random() * 6;
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color ramp by height (LiDAR elevation style)
      const normY = Math.max(0, Math.min(1, (y + 2) / 7));
      let c: THREE.Color;
      if (normY < 0.15) {
        c = color1.clone().lerp(color2, normY / 0.15);
      } else if (normY < 0.4) {
        c = color2.clone().lerp(color3, (normY - 0.15) / 0.25);
      } else if (normY < 0.7) {
        c = color3.clone().lerp(color4, (normY - 0.4) / 0.3);
      } else {
        c = color4.clone().lerp(color5, (normY - 0.7) / 0.3);
      }

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (!reducedMotion && pointsRef.current) {
      // Subtle sparkle and breathing effect
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
