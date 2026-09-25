'use client';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { WebGLFallback } from './WebGLFallback';

export interface SceneCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  className?: string;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  children,
  cameraPosition = [10, 8, 12],
  fov = 45,
  className = 'w-full h-full min-h-[420px]',
}) => {
  const [isClient, setIsClient] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setIsClient(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 rounded-2xl ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sf-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            INITIALIZING 3D SPATIAL ENGINE...
          </span>
        </div>
      </div>
    );
  }

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <CanvasErrorBoundary>
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <Canvas
          camera={{ position: cameraPosition, fov }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          {children}
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
};
