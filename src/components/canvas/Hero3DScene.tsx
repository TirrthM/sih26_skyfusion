'use client';

import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { SpatialGrid3D } from './SpatialGrid3D';
import { Terrain3D } from './Terrain3D';
import { PointCloud3D } from './PointCloud3D';
import { CameraFrustum3D } from './CameraFrustum3D';
import { FlightPath3D } from './FlightPath3D';
import { DroneModel3D } from './DroneModel3D';

export interface Hero3DSceneProps {
  reducedMotion?: boolean;
  showTerrain?: boolean;
  showPointCloud?: boolean;
  showFrustums?: boolean;
  showFlightPath?: boolean;
  showDrone?: boolean;
  pointCount?: number;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({
  reducedMotion = false,
  showTerrain = true,
  showPointCloud = true,
  showFrustums = true,
  showFlightPath = true,
  showDrone = true,
  pointCount = 4200,
}) => {
  return (
    <>
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 8]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-8, 6, -6]} intensity={0.8} color="#38BDF8" />
      <pointLight position={[6, 8, 6]} intensity={0.5} color="#818CF8" />

      {/* Orbit Controls with bounded damping */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above terrain
        minDistance={4}
        maxDistance={24}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.5}
      />

      {/* 3D Scene Layers */}
      <SpatialGrid3D />
      {showTerrain && <Terrain3D />}
      {showPointCloud && <PointCloud3D count={pointCount} reducedMotion={reducedMotion} />}
      {showFrustums && <CameraFrustum3D />}
      {showFlightPath && <FlightPath3D reducedMotion={reducedMotion} />}
      {showDrone && <DroneModel3D reducedMotion={reducedMotion} />}
    </>
  );
};
