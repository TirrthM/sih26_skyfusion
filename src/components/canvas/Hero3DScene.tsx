'use client';

import React from 'react';
import { OrbitControls } from '@react-three/drei';
import { SpatialGrid3D } from './SpatialGrid3D';
import { Terrain3D } from './Terrain3D';
import { PointCloud3D } from './PointCloud3D';
import { CameraFrustum3D } from './CameraFrustum3D';
import { FlightPath3D } from './FlightPath3D';
import { DroneModel3D } from './DroneModel3D';
import { PlyPointCloud3D } from './PlyPointCloud3D';
import { CameraResetController } from './CameraResetController';
import { DroneLoader3D } from './DroneLoader3D';

export interface Hero3DSceneProps {
  plyModelUrl?: string;
  reducedMotion?: boolean;
  showTerrain?: boolean;
  showPointCloud?: boolean;
  showFrustums?: boolean;
  showFlightPath?: boolean;
  showDrone?: boolean;
  pointCount?: number;
  modelRotation?: [number, number, number];
  modelScale?: number;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({
  plyModelUrl,
  reducedMotion = false,
  showTerrain = true,
  showPointCloud = true,
  showFrustums = true,
  showFlightPath = true,
  showDrone = true,
  pointCount = 1800,
  modelRotation,
  modelScale,
}) => {
  return (
    <>
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 8]} intensity={1.0} color="#FFFFFF" />
      <pointLight position={[-6, 5, -6]} intensity={0.6} color="#659AC1" />

      {/* Orbit Controls with bounded damping */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={plyModelUrl ? Math.PI : Math.PI / 2 - 0.05} // Allow full 360 rotation for uploaded models
        minDistance={1}
        maxDistance={50}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.4}
      />
      
      {/* Camera Reset Controller */}
      <CameraResetController />

      {/* 3D Scene Layers */}
      {!plyModelUrl && <SpatialGrid3D />}
      {showTerrain && !plyModelUrl && <Terrain3D />}
      
      {showPointCloud && (
        plyModelUrl ? (
          <React.Suspense fallback={<DroneLoader3D />}>
            <PlyPointCloud3D 
              url={plyModelUrl} 
              pointSize={0.03} 
              rotation={modelRotation}
              scale={modelScale}
            />
          </React.Suspense>
        ) : (
          <PointCloud3D count={pointCount} reducedMotion={reducedMotion} />
        )
      )}
      
      {!plyModelUrl && showFrustums && <CameraFrustum3D />}
      {!plyModelUrl && showFlightPath && <FlightPath3D reducedMotion={reducedMotion} />}
      {!plyModelUrl && showDrone && <DroneModel3D reducedMotion={reducedMotion} />}
    </>
  );
};
