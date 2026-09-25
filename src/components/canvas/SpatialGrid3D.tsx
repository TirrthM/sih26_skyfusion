'use client';

import React from 'react';
import * as THREE from 'three';

export interface SpatialGrid3DProps {
  size?: number;
  divisions?: number;
  colorCenterLine?: string;
  colorGrid?: string;
}

export const SpatialGrid3D: React.FC<SpatialGrid3DProps> = ({
  size = 40,
  divisions = 40,
  colorCenterLine = '#38BDF8',
  colorGrid = '#1E293B',
}) => {
  return (
    <group position={[0, -2, 0]}>
      {/* Primary Coordinate Grid */}
      <gridHelper args={[size, divisions, new THREE.Color(colorCenterLine), new THREE.Color(colorGrid)]} />
      
      {/* Subtle secondary elevation circles / radar rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[5.9, 6, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[11.9, 12, 64]} />
        <meshBasicMaterial color="#6366F1" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
