'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface Terrain3DProps {
  wireframe?: boolean;
}

export const Terrain3D: React.FC<Terrain3DProps> = ({ wireframe = true }) => {
  // Generate an urban cityscape survey scene with varied buildings
  const buildings = useMemo(() => {
    return [
      // Main downtown cluster
      { pos: [-4, 0, -3], size: [2.4, 3.2, 2.4], color: '#38BDF8' },
      { pos: [-1.2, 0, -5], size: [1.8, 5.8, 1.8], color: '#818CF8' },   // Tall tower
      { pos: [3, 0, -4], size: [2.8, 4.0, 2.6], color: '#38BDF8' },
      { pos: [5.5, 0, -1.5], size: [2.0, 2.6, 2.0], color: '#818CF8' },
      // Residential / low-rise
      { pos: [-4.8, 0, 1.8], size: [1.8, 1.8, 2.8], color: '#38BDF8' },
      { pos: [-2.5, 0, 3.5], size: [1.5, 1.2, 1.5], color: '#818CF8' },
      { pos: [3.2, 0, 3], size: [2.6, 3.6, 2.2], color: '#38BDF8' },
      { pos: [0.5, 0, 3.8], size: [1.6, 1.4, 1.8], color: '#818CF8' },
      // Additional mid-rise structures
      { pos: [1.5, 0, -2], size: [1.4, 2.6, 1.4], color: '#38BDF8' },
      { pos: [-3, 0, -6], size: [1.6, 2.0, 1.6], color: '#818CF8' },
      { pos: [5.5, 0, 3.5], size: [1.2, 2.2, 1.6], color: '#38BDF8' },
    ];
  }, []);

  return (
    <group position={[0, -2, 0]}>
      {/* Ground Plane — subtle dark survey surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#0A1628"
          roughness={0.95}
          metalness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Ground grid lines */}
      <gridHelper
        args={[20, 24, '#1E293B', '#1E293B']}
        position={[0, 0, 0]}
      />

      {/* Cityscape Building Wireframe Meshes */}
      {buildings.map((b, idx) => (
        <group key={idx} position={[b.pos[0], b.size[1] / 2, b.pos[2]]}>
          {/* Solid subtle block body */}
          <mesh>
            <boxGeometry args={[b.size[0], b.size[1], b.size[2]]} />
            <meshStandardMaterial
              color="#0F172A"
              roughness={0.8}
              metalness={0.3}
              transparent
              opacity={0.65}
            />
          </mesh>

          {/* Glowing wireframe edge highlight */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(b.size[0], b.size[1], b.size[2])]} />
            <lineBasicMaterial
              color={b.color}
              transparent
              opacity={0.9}
              linewidth={1.5}
            />
          </lineSegments>

          {/* Rooftop detail — small antenna/structure for taller buildings */}
          {b.size[1] > 3 && (
            <mesh position={[0, b.size[1] / 2 + 0.3, 0]}>
              <boxGeometry args={[0.15, 0.6, 0.15]} />
              <meshStandardMaterial
                color={b.color}
                emissive={b.color}
                emissiveIntensity={0.4}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};
