'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  className = 'w-full h-full min-h-[360px]',
}) => {
  const [isClient, setIsClient] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Performance Optimization: Pause WebGL frame loop when canvas is scrolled off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isClient]);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 rounded-2xl ${className}`}>
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-6 h-6 border-2 border-sf-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
            INITIALIZING 3D ENGINE...
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
      <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
        <Canvas
          frameloop={isVisible ? 'always' : 'never'}
          camera={{ position: cameraPosition, fov }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.25]}
        >
          {isVisible && children}
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
};
