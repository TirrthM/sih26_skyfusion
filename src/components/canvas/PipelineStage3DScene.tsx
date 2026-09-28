'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

export interface PipelineStage3DSceneProps {
  stageIndex: number; // 1 to 11
  reducedMotion?: boolean;
}

export const PipelineStage3DScene: React.FC<PipelineStage3DSceneProps> = ({
  stageIndex,
  reducedMotion = false,
}) => {
  // Frustum pyramid geometry helper
  const frustumGeom = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const apex = new THREE.Vector3(0, 0, 0);
    const scale = 1.15;
    const w = 0.65 * scale;
    const h = 0.45 * scale;
    const d = 1.1 * scale;

    const c1 = new THREE.Vector3(-w, -h, -d);
    const c2 = new THREE.Vector3(w, -h, -d);
    const c3 = new THREE.Vector3(w, h, -d);
    const c4 = new THREE.Vector3(-w, h, -d);

    points.push(apex, c1, apex, c2, apex, c3, apex, c4);
    points.push(c1, c2, c2, c3, c3, c4, c4, c1);

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Large camera frustum helper
  const largeFrustumGeom = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const apex = new THREE.Vector3(0, 0, 0);
    const w = 2.0;
    const h = 1.4;
    const d = 3.6;

    const c1 = new THREE.Vector3(-w, -h, -d);
    const c2 = new THREE.Vector3(w, -h, -d);
    const c3 = new THREE.Vector3(w, h, -d);
    const c4 = new THREE.Vector3(-w, h, -d);

    points.push(apex, c1, apex, c2, apex, c3, apex, c4);
    points.push(c1, c2, c2, c3, c3, c4, c4, c1);

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Frame Input Arc Data with ground projection footprints
  const frameInputData = useMemo(() => {
    const frames = [
      { pos: new THREE.Vector3(-5.2, 3.8, -2.4), rot: new THREE.Euler(-0.35, 0.55, 0), label: 'FRAME_01', color: '#38BDF8', ground: [-3.8, -1.8] },
      { pos: new THREE.Vector3(-2.6, 4.2, 0.2), rot: new THREE.Euler(-0.4, 0.28, 0), label: 'FRAME_02', color: '#F59E0B', ground: [-2.0, 0.1] },
      { pos: new THREE.Vector3(0.0, 4.5, 1.8), rot: new THREE.Euler(-0.45, 0, 0), label: 'FRAME_03', color: '#10B981', ground: [0.0, 1.2] },
      { pos: new THREE.Vector3(2.6, 4.2, 0.2), rot: new THREE.Euler(-0.4, -0.28, 0), label: 'FRAME_04', color: '#EC4899', ground: [2.0, 0.1] },
      { pos: new THREE.Vector3(5.2, 3.8, -2.4), rot: new THREE.Euler(-0.35, -0.55, 0), label: 'FRAME_05', color: '#8B5CF6', ground: [3.8, -1.8] },
    ];
    return frames;
  }, []);

  // Calibration Chessboard Corner Keypoints Grid (7x9)
  const calibrationCorners = useMemo(() => {
    const corners: THREE.Vector3[] = [];
    const startX = -2.0;
    const startY = -1.2;
    const stepX = 0.5;
    const stepY = 0.4;
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 9; col++) {
        corners.push(new THREE.Vector3(startX + col * stepX, startY + row * stepY, 0.09));
      }
    }
    return corners;
  }, []);

  // Feature Matches (Inliers & Outliers)
  const featureMatches = useMemo(() => {
    const leftPlanePos = new THREE.Vector3(-2.8, 1.8, 0);
    const rightPlanePos = new THREE.Vector3(2.8, 1.8, 0);
    const inliers: { p1: THREE.Vector3; p2: THREE.Vector3; y: number; color: string }[] = [];
    const outliers: { p1: THREE.Vector3; p2: THREE.Vector3 }[] = [];

    const inlierCoords = [
      [-1.1, 0.8, -1.02, 0.8, '#38BDF8'],
      [-0.7, 0.8, -0.62, 0.8, '#38BDF8'],
      [-0.3, 0.8, -0.22, 0.8, '#38BDF8'],
      [0.2, 0.8, 0.28, 0.8, '#38BDF8'],
      [0.6, 0.8, 0.68, 0.8, '#38BDF8'],
      [1.0, 0.8, 1.08, 0.8, '#38BDF8'],
      [-0.9, 0.3, -0.82, 0.3, '#F59E0B'],
      [-0.4, 0.3, -0.32, 0.3, '#F59E0B'],
      [0.1, 0.3, 0.18, 0.3, '#F59E0B'],
      [0.7, 0.3, 0.78, 0.3, '#F59E0B'],
      [-0.8, -0.2, -0.72, -0.2, '#10B981'],
      [-0.3, -0.2, -0.22, -0.2, '#10B981'],
      [0.3, -0.2, 0.38, -0.2, '#10B981'],
      [0.8, -0.2, 0.88, -0.2, '#10B981'],
      [-0.9, -0.7, -0.82, -0.7, '#EC4899'],
      [-0.4, -0.7, -0.32, -0.7, '#EC4899'],
      [0.1, -0.7, 0.18, -0.7, '#EC4899'],
      [0.6, -0.7, 0.68, -0.7, '#EC4899'],
    ];

    inlierCoords.forEach(([x1, y1, x2, y2, color]) => {
      const p1 = new THREE.Vector3(leftPlanePos.x + Number(x1), leftPlanePos.y + Number(y1), leftPlanePos.z + 0.05);
      const p2 = new THREE.Vector3(rightPlanePos.x + Number(x2), rightPlanePos.y + Number(y2), rightPlanePos.z + 0.05);
      inliers.push({ p1, p2, y: Number(y1), color: String(color) });
    });

    const outlierCoords = [
      [-0.95, 0.85, 0.85, -0.85],
      [0.95, -0.65, -0.85, 0.75],
      [-0.35, -0.95, 0.75, 0.95],
      [0.55, 0.85, -0.75, -0.55],
      [-0.75, -0.45, 0.65, 0.35],
      [0.35, -0.85, -0.45, 0.85],
      [-0.15, 0.45, 0.85, -0.35],
      [0.75, -0.25, -0.65, 0.65],
    ];

    outlierCoords.forEach(([x1, y1, x2, y2]) => {
      const p1 = new THREE.Vector3(leftPlanePos.x + x1, leftPlanePos.y + y1, leftPlanePos.z + 0.05);
      const p2 = new THREE.Vector3(rightPlanePos.x + x2, rightPlanePos.y + y2, rightPlanePos.z + 0.05);
      outliers.push({ p1, p2 });
    });

    return { inliers, outliers };
  }, []);

  // Multi-view Triangulation Rays for Stage 08
  const triangulationRays = useMemo(() => {
    const cameras = [
      { pos: new THREE.Vector3(-4.5, 5.2, 3.5), rot: new THREE.Euler(-0.7, 0.4, 0), color: '#38BDF8', label: 'CAM_A' },
      { pos: new THREE.Vector3(0.0, 5.8, 4.6), rot: new THREE.Euler(-0.75, 0, 0), color: '#F59E0B', label: 'CAM_B' },
      { pos: new THREE.Vector3(4.5, 5.2, 3.5), rot: new THREE.Euler(-0.7, -0.4, 0), color: '#10B981', label: 'CAM_C' },
    ];
    const targetPoints = [
      new THREE.Vector3(-2.2, 3.8, -1.2),
      new THREE.Vector3(-0.9, 4.4, -0.6),
      new THREE.Vector3(1.6, 3.5, -1.1),
      new THREE.Vector3(0.3, 2.0, 1.4),
      new THREE.Vector3(-1.9, 1.6, 1.6),
      new THREE.Vector3(2.4, 1.8, 1.1),
      new THREE.Vector3(-0.5, 1.2, -0.2),
      new THREE.Vector3(1.1, 2.8, 0.5),
    ];
    const lines: { from: THREE.Vector3; to: THREE.Vector3; color: string }[] = [];
    cameras.forEach((cam) => {
      targetPoints.forEach((tgt) => {
        lines.push({ from: cam.pos, to: tgt, color: cam.color });
      });
    });
    return { cameras, targetPoints, lines };
  }, []);

  // Surface Normal Vectors for Stage 10
  const surfaceNormals = useMemo(() => {
    const vectors: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    const step = 0.7;
    // Front and wall samples
    for (let x = -3.0; x <= 3.0; x += step) {
      for (let y = 0.6; y <= 4.2; y += step) {
        const start = new THREE.Vector3(x, y, 1.3);
        const end = new THREE.Vector3(x, y, 1.95);
        vectors.push({ start, end, color: '#10B981' });
      }
    }
    // Roof normals pointing up
    for (let x = -2.6; x <= 2.6; x += step) {
      for (let z = -2.2; z <= 1.0; z += step) {
        const start = new THREE.Vector3(x, 4.3, z);
        const end = new THREE.Vector3(x, 4.95, z);
        vectors.push({ start, end, color: '#38BDF8' });
      }
    }
    // Ground / terrain normals
    for (let x = -4.0; x <= 4.0; x += 1.2) {
      for (let z = -3.0; z <= 3.0; z += 1.2) {
        const start = new THREE.Vector3(x, 0.05, z);
        const end = new THREE.Vector3(x, 0.55, z);
        vectors.push({ start, end, color: '#A855F7' });
      }
    }
    return vectors;
  }, []);

  // ICP Displacement Vectors for Stage 09
  const icpVectors = useMemo(() => {
    const lines: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const r = 1.8 + Math.sin(i * 3) * 0.6;
      const y = 0.5 + (i % 8) * 0.45;
      const p1 = new THREE.Vector3(Math.cos(angle) * r - 0.3, y, Math.sin(angle) * r - 0.2);
      const p2 = new THREE.Vector3(Math.cos(angle + 0.12) * r + 0.3, y + 0.15, Math.sin(angle + 0.12) * r + 0.25);
      lines.push({ from: p1, to: p2 });
    }
    return lines;
  }, []);

  // Dense 3D Point Cloud Generator with rich depth, semantic and multi-scan color modes
  const pointClouds = useMemo(() => {
    const createBuildingCloud = (
      colorMode: 'depth-turbo' | 'scan-cyan' | 'scan-amber' | 'fused' | 'classified',
      count = 6000
    ) => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const buildings = [
        { cx: -2.4, cz: -1.4, w: 2.8, d: 2.4, h: 4.8 },
        { cx: 2.2, cz: -1.2, w: 3.0, d: 2.6, h: 4.0 },
        { cx: -0.6, cz: 2.0, w: 2.4, d: 2.2, h: 3.0 },
        { cx: 2.6, cz: 2.0, w: 2.2, d: 2.2, h: 2.5 },
        { cx: -3.4, cz: 1.6, w: 2.0, d: 1.8, h: 2.2 },
      ];

      for (let i = 0; i < count; i++) {
        const b = buildings[i % buildings.length];
        const isRoof = Math.random() < 0.36;
        let x = 0, y = 0, z = 0;

        if (isRoof) {
          x = b.cx + (Math.random() - 0.5) * b.w;
          z = b.cz + (Math.random() - 0.5) * b.d;
          y = b.h + (Math.random() - 0.5) * 0.15;
        } else {
          const side = Math.floor(Math.random() * 4);
          if (side === 0) {
            x = b.cx - b.w / 2;
            z = b.cz + (Math.random() - 0.5) * b.d;
          } else if (side === 1) {
            x = b.cx + b.w / 2;
            z = b.cz + (Math.random() - 0.5) * b.d;
          } else if (side === 2) {
            x = b.cx + (Math.random() - 0.5) * b.w;
            z = b.cz - b.d / 2;
          } else {
            x = b.cx + (Math.random() - 0.5) * b.w;
            z = b.cz + b.d / 2;
          }
          y = Math.random() * b.h;
        }

        x += (Math.random() - 0.5) * 0.05;
        y += (Math.random() - 0.5) * 0.05;
        z += (Math.random() - 0.5) * 0.05;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        if (colorMode === 'depth-turbo') {
          // Vivid Continuous Turbo Rainbow Depth Palette:
          // Close (Red/Orange) -> Mid-Near (Yellow) -> Mid (Green/Teal) -> Mid-Far (Cyan/Sky) -> Distant (Blue/Indigo/Purple)
          const norm = Math.min(Math.max((z + 3.0) / 6.5, 0), 1);
          if (norm > 0.8) {
            // Very Near: Flaming Red-Orange
            colors[i * 3] = 0.98;
            colors[i * 3 + 1] = 0.22;
            colors[i * 3 + 2] = 0.15;
          } else if (norm > 0.6) {
            // Near: Vivid Amber Gold
            colors[i * 3] = 0.98;
            colors[i * 3 + 1] = 0.72;
            colors[i * 3 + 2] = 0.08;
          } else if (norm > 0.4) {
            // Mid: Bright Emerald / Teal
            colors[i * 3] = 0.1;
            colors[i * 3 + 1] = 0.88;
            colors[i * 3 + 2] = 0.55;
          } else if (norm > 0.2) {
            // Mid-Far: Luminous Electric Cyan
            colors[i * 3] = 0.15;
            colors[i * 3 + 1] = 0.75;
            colors[i * 3 + 2] = 0.98;
          } else {
            // Distant: Deep Indigo / Violet
            colors[i * 3] = 0.55;
            colors[i * 3 + 1] = 0.25;
            colors[i * 3 + 2] = 0.95;
          }
        } else if (colorMode === 'scan-cyan') {
          colors[i * 3] = 0.22;
          colors[i * 3 + 1] = 0.76;
          colors[i * 3 + 2] = 0.98;
        } else if (colorMode === 'scan-amber') {
          colors[i * 3] = 0.98;
          colors[i * 3 + 1] = 0.62;
          colors[i * 3 + 2] = 0.08;
        } else if (colorMode === 'classified') {
          // Output Digital Twin Semantic Classification:
          // Roofs = Terracotta Amber-Red, Facades = Sleek Slate Cyan/Teal, Ground = Forest Emerald, Structural Edges = Gold
          if (isRoof) {
            colors[i * 3] = 0.95;
            colors[i * 3 + 1] = 0.35;
            colors[i * 3 + 2] = 0.25;
          } else if (y < 0.4) {
            // Ground Plane
            colors[i * 3] = 0.12;
            colors[i * 3 + 1] = 0.85;
            colors[i * 3 + 2] = 0.45;
          } else {
            // Building Facade
            const t = y / 4.8;
            colors[i * 3] = 0.2 + t * 0.4;
            colors[i * 3 + 1] = 0.65 + t * 0.3;
            colors[i * 3 + 2] = 0.95;
          }
        } else {
          // Fused Normal Colormap: Multi-tone elevation gradient
          const t = y / 4.8;
          colors[i * 3] = 0.15 + t * 0.65;
          colors[i * 3 + 1] = 0.75 + t * 0.2;
          colors[i * 3 + 2] = 0.95 - t * 0.4;
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      return geom;
    };

    return {
      depthTurbo: createBuildingCloud('depth-turbo', 7500),
      scanCyan: createBuildingCloud('scan-cyan', 4000),
      scanAmber: createBuildingCloud('scan-amber', 4000),
      fused: createBuildingCloud('fused', 8000),
      classified: createBuildingCloud('classified', 9000),
    };
  }, []);

  return (
    <>
      {/* Studio Lighting Setup with rich colored rim lights */}
      <ambientLight intensity={1.6} />
      <directionalLight position={[15, 25, 20]} intensity={3.0} color="#FFFFFF" />
      <directionalLight position={[-15, 15, -15]} intensity={2.0} color="#93B8D3" />
      <pointLight position={[0, 12, 0]} intensity={2.8} color="#38BDF8" />
      <pointLight position={[-8, 6, 8]} intensity={2.4} color="#F59E0B" />
      <pointLight position={[8, 6, -8]} intensity={2.0} color="#10B981" />

      {/* Orbit Controls with smooth damping */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={26}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.6}
      />

      {/* High-contrast Aerospace Coordinate Base Grid */}
      <gridHelper args={[24, 24, '#38BDF8', '#1E293B']} position={[0, -0.01, 0]} />

      {/* ========================================================================= */}
      {/* STAGE 01: Frame Input (UAV Image Acquisition & Flight Path) */}
      {/* ========================================================================= */}
      {stageIndex === 1 && (
        <group position={[0, 0, 0]}>
          {/* Flight Path Spline Line with Neon Gradient */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...new THREE.BufferGeometry().setFromPoints(frameInputData.map((f) => f.pos))}
            />
            <lineBasicMaterial color="#10B981" linewidth={5} />
          </line>

          {/* Sequential Aerial Frames with Rich Details */}
          {frameInputData.map((f, i) => (
            <group key={i}>
              {/* Floating Camera Viewframe */}
              <group position={f.pos} rotation={f.rot}>
                {/* Dark Photo Mount */}
                <mesh>
                  <planeGeometry args={[2.4, 1.6]} />
                  <meshStandardMaterial color="#0B132B" side={THREE.DoubleSide} metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Bright Neon Frame Border */}
                <lineSegments>
                  <edgesGeometry args={[new THREE.PlaneGeometry(2.4, 1.6)]} />
                  <lineBasicMaterial color={f.color} linewidth={4.5} />
                </lineSegments>
                {/* Aerial Thumbnail Grid Preview */}
                <mesh position={[0, -0.1, 0.02]}>
                  <planeGeometry args={[1.9, 1.0, 6, 4]} />
                  <meshBasicMaterial color="#1E293B" wireframe />
                </mesh>
                {/* Reticle Target */}
                <mesh position={[0, 0.2, 0.03]}>
                  <ringGeometry args={[0.22, 0.28, 24]} />
                  <meshBasicMaterial color={f.color} />
                </mesh>
                {/* Optical Frustum Cone */}
                <lineSegments geometry={frustumGeom} scale={0.8} position={[0, 0, 0.1]}>
                  <lineBasicMaterial color={f.color} transparent opacity={0.8} linewidth={2} />
                </lineSegments>
              </group>

              {/* Waypoint Altitude Indicator Node */}
              <mesh position={[f.pos.x, f.pos.y, f.pos.z]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshBasicMaterial color={f.color} />
              </mesh>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(f.pos.x, f.pos.y, f.pos.z),
                    new THREE.Vector3(f.pos.x, 0, f.pos.z),
                  ])}
                />
                <lineBasicMaterial color={f.color} transparent opacity={0.4} linewidth={1.5} />
              </line>

              {/* Ground Overlapping Field of View Footprint */}
              <mesh position={[f.ground[0], 0.02, f.ground[1]]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3.2, 2.4]} />
                <meshBasicMaterial
                  color={f.color}
                  transparent
                  opacity={0.22}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <lineSegments position={[f.ground[0], 0.03, f.ground[1]]} rotation={[-Math.PI / 2, 0, 0]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2.4)]} />
                <lineBasicMaterial color={f.color} linewidth={2.5} />
              </lineSegments>
            </group>
          ))}

          {/* Detailed Drone Quadcopter at Leading Waypoint */}
          <group position={[5.2, 4.3, -2.4]} rotation={[-0.35, -0.55, 0]}>
            {/* Main Fuselage */}
            <mesh>
              <boxGeometry args={[1.2, 0.22, 1.2]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Gimbal Camera Pod */}
            <mesh position={[0, -0.26, 0.18]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#38BDF8" metalness={0.8} />
            </mesh>
            {/* 4 Rotor Arms with Glowing Discs */}
            {[-0.75, 0.75].map((rx, idx1) =>
              [-0.75, 0.75].map((rz, idx2) => (
                <group key={`${idx1}-${idx2}`} position={[rx, 0.14, rz]}>
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.3, 0.42, 20]} />
                    <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry args={[0.07, 0.07, 0.18, 12]} />
                    <meshStandardMaterial color="#64748B" />
                  </mesh>
                </group>
              ))
            )}
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 02: Camera Calibration (Intrinsics Estimation & Checkerboards) */}
      {/* ========================================================================= */}
      {stageIndex === 2 && (
        <group position={[0, 1.4, 0]}>
          {/* Main Primary Checkerboard Calibration Board */}
          <group position={[-0.8, 0, -3.2]} rotation={[-0.1, 0.15, 0]}>
            <mesh>
              <boxGeometry args={[5.4, 3.8, 0.18]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} />
            </mesh>
            <gridHelper args={[5.0, 12, '#38BDF8', '#F8FAFC']} position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments position={[0, 0, 0.1]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(5.0, 3.4)]} />
              <lineBasicMaterial color="#F59E0B" linewidth={4.5} />
            </lineSegments>
            {/* Detected Sub-pixel Corner Crosshairs (63 Neon Green Dots) */}
            {calibrationCorners.map((c, i) => (
              <group key={i} position={c}>
                <mesh>
                  <sphereGeometry args={[0.055, 8, 8]} />
                  <meshBasicMaterial color="#10B981" />
                </mesh>
              </group>
            ))}
          </group>

          {/* Secondary Angled Calibration Target */}
          <group position={[3.4, -0.2, -2.4]} rotation={[-0.12, -0.65, 0]}>
            <mesh>
              <boxGeometry args={[3.0, 2.6, 0.12]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <gridHelper args={[2.6, 6, '#EC4899', '#64748B']} position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments position={[0, 0, 0.08]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(2.6, 2.2)]} />
              <lineBasicMaterial color="#10B981" linewidth={3.5} />
            </lineSegments>
          </group>

          {/* Detailed DSLR Camera with Visible Sensor Cutaway */}
          <group position={[0, 1.2, 3.0]} rotation={[-0.12, 0, 0]}>
            {/* Main Camera Body */}
            <mesh position={[0, 0, 0.5]}>
              <boxGeometry args={[1.6, 1.1, 1.0]} />
              <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Sensor Plane Cutout with Principal Point (cx, cy) */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.0, 0.7]} />
              <meshBasicMaterial color="#0284C7" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <ringGeometry args={[0.1, 0.15, 16]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            {/* Lens Barrel Cylinder with Metal Grip Rings */}
            <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.52, 0.58, 0.9, 32]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Front Aperture Glass */}
            <mesh position={[0, 0, -0.96]}>
              <circleGeometry args={[0.46, 32]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>

            {/* Projected Optical Cone to Checkerboard */}
            <lineSegments geometry={frustumGeom} scale={3.4} position={[0, 0, -0.9]}>
              <lineBasicMaterial color="#F59E0B" linewidth={4} />
            </lineSegments>

            {/* Principal Optical Axis Ray */}
            <line>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(0, 0, -7.0),
                ])}
              />
              <lineBasicMaterial color="#38BDF8" linewidth={4.5} />
            </line>

            {/* 3D Coordinate Gimbal Frame */}
            <axesHelper args={[2.2]} />
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 03: Image Correction (Radial Distortion Rectification) */}
      {/* ========================================================================= */}
      {stageIndex === 3 && (
        <group position={[0, 1.8, 0]}>
          {/* Distorted Image Plane (Left - Vivid Crimson Warning) */}
          <group position={[-3.0, 0, 0]}>
            <mesh>
              <planeGeometry args={[3.6, 2.8]} />
              <meshStandardMaterial color="#1C1917" side={THREE.DoubleSide} />
            </mesh>
            <gridHelper args={[3.6, 16, '#EF4444', '#78350F']} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.6, 2.8)]} />
              <lineBasicMaterial color="#EF4444" linewidth={5} />
            </lineSegments>
            {/* Concentric Barrel Distortion Rings */}
            <mesh position={[0, 0, 0.05]}>
              <ringGeometry args={[1.0, 1.08, 32]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <ringGeometry args={[0.5, 0.58, 32]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            {/* Distorted Outward Warp Arrows */}
            {[-1.3, 1.3].map((cx, i) =>
              [-1.0, 1.0].map((cy, j) => (
                <group key={`${i}-${j}`} position={[cx, cy, 0.06]}>
                  <mesh>
                    <ringGeometry args={[0.14, 0.2, 16]} />
                    <meshBasicMaterial color="#EF4444" />
                  </mesh>
                  <line>
                    <bufferGeometry
                      attach="geometry"
                      {...new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(0, 0, 0),
                        new THREE.Vector3(cx * 0.25, cy * 0.25, 0),
                      ])}
                    />
                    <lineBasicMaterial color="#EF4444" linewidth={3} />
                  </line>
                </group>
              ))
            )}
          </group>

          {/* Corrected Rectilinear Plane (Right - Vibrant Emerald Green) */}
          <group position={[3.0, 0, 0]}>
            <mesh>
              <planeGeometry args={[3.6, 2.8]} />
              <meshStandardMaterial color="#064E3B" side={THREE.DoubleSide} />
            </mesh>
            <gridHelper args={[3.6, 16, '#10B981', '#065F46']} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.6, 2.8)]} />
              <lineBasicMaterial color="#10B981" linewidth={5} />
            </lineSegments>
            {/* Crisp Square Alignment Crosshair */}
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[2.0, 2.0]} />
              <meshBasicMaterial color="#10B981" wireframe />
            </mesh>
            {[-1.3, 1.3].map((cx, i) =>
              [-1.0, 1.0].map((cy, j) => (
                <mesh key={`${i}-${j}`} position={[cx, cy, 0.06]}>
                  <boxGeometry args={[0.22, 0.22, 0.02]} />
                  <meshBasicMaterial color="#10B981" />
                </mesh>
              ))
            )}
          </group>

          {/* Center Corrective Optical Element & Transformation Arrow */}
          <group position={[0, 0, 0]}>
            {/* 3D Corrective Glass Lens Disc */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
              <meshStandardMaterial color="#38BDF8" transparent opacity={0.45} roughness={0.1} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[1.18, 1.25, 32]} />
              <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
            </mesh>
            {/* Transformation Arrow */}
            <line>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(-1.4, 0, 0),
                  new THREE.Vector3(1.4, 0, 0),
                ])}
              />
              <lineBasicMaterial color="#F59E0B" linewidth={6} />
            </line>
            <mesh position={[1.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.32, 0.65, 20]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 04: Depth Estimation (Dense Metric Turbo Depth Maps) */}
      {/* ========================================================================= */}
      {stageIndex === 4 && (
        <group position={[0, 0.2, 0]}>
          {/* Dense Continuous Turbo-Spectrum Point Cloud */}
          <points geometry={pointClouds.depthTurbo}>
            <pointsMaterial size={0.11} vertexColors transparent opacity={0.98} />
          </points>

          {/* Floating Depth Iso-Contour Slicing Planes */}
          {[-1.8, 0.2, 2.2].map((pz, idx) => (
            <group key={idx} position={[0, 2.4, pz]}>
              <mesh>
                <planeGeometry args={[8.5, 5.0]} />
                <meshBasicMaterial
                  color={idx === 0 ? '#6366F1' : idx === 1 ? '#06B6D4' : '#F59E0B'}
                  transparent
                  opacity={0.12}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(8.5, 5.0)]} />
                <lineBasicMaterial
                  color={idx === 0 ? '#6366F1' : idx === 1 ? '#06B6D4' : '#F59E0B'}
                  linewidth={2.5}
                />
              </lineSegments>
            </group>
          ))}

          {/* Vivid Vertical Depth Turbo Legend Bar */}
          <group position={[-5.2, 2.6, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <boxGeometry args={[0.45, 0.7, 0.1]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.45, 0.7, 0.1]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.45, 0.7, 0.1]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <mesh position={[0, -0.9, 0]}>
              <boxGeometry args={[0.45, 0.7, 0.1]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
            <mesh position={[0, -1.6, 0]}>
              <boxGeometry args={[0.45, 0.7, 0.1]} />
              <meshBasicMaterial color="#8B5CF6" />
            </mesh>
            <lineSegments position={[0, -0.2, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(0.48, 3.6, 0.12)]} />
              <lineBasicMaterial color="#FFFFFF" linewidth={2.5} />
            </lineSegments>
          </group>

          {/* Dual Stereo Sensor Rig Projecting Scanning Light Sheets */}
          <group position={[4.8, 5.6, 5.4]} rotation={[-0.65, 0.5, 0]}>
            <lineSegments geometry={largeFrustumGeom} scale={1.3}>
              <lineBasicMaterial color="#06B6D4" linewidth={4} />
            </lineSegments>
            <mesh position={[-0.6, 0, 0]}>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
            <mesh position={[0.6, 0, 0]}>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 05: Feature Matching (Visual Correspondences & Descriptors) */}
      {/* ========================================================================= */}
      {stageIndex === 5 && (
        <group position={[0, 0.8, 0]}>
          {/* Left Frame Viewport */}
          <group position={[-3.2, 1.8, 0]} rotation={[0, 0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 2.6]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.95} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.4, 2.6)]} />
              <lineBasicMaterial color="#38BDF8" linewidth={4.5} />
            </lineSegments>
            {/* Feature Wireframe Building Facade */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[2.6, 2.0, 4, 4]} />
              <meshBasicMaterial color="#1E293B" wireframe />
            </mesh>
          </group>

          {/* Right Frame Viewport */}
          <group position={[3.2, 1.8, 0]} rotation={[0, -0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 2.6]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.95} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.4, 2.6)]} />
              <lineBasicMaterial color="#38BDF8" linewidth={4.5} />
            </lineSegments>
            {/* Feature Wireframe Building Facade */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[2.6, 2.0, 4, 4]} />
              <meshBasicMaterial color="#1E293B" wireframe />
            </mesh>
          </group>

          {/* 3D Laser Correspondence Beams with Colorful Feature Nodes */}
          {featureMatches.inliers.map((m, idx) => (
            <group key={idx}>
              {/* Feature Descriptor Halo Left */}
              <mesh position={m.p1}>
                <ringGeometry args={[0.08, 0.14, 16]} />
                <meshBasicMaterial color={m.color} side={THREE.DoubleSide} />
              </mesh>
              {/* Feature Descriptor Halo Right */}
              <mesh position={m.p2}>
                <ringGeometry args={[0.08, 0.14, 16]} />
                <meshBasicMaterial color={m.color} side={THREE.DoubleSide} />
              </mesh>
              {/* Connecting Laser Match Line */}
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([m.p1, m.p2])}
                />
                <lineBasicMaterial color={m.color} transparent opacity={0.95} linewidth={3.5} />
              </line>
            </group>
          ))}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 06: Pose Recovery (Structure from Motion & 6-DoF Extrinsics) */}
      {/* ========================================================================= */}
      {stageIndex === 6 && (
        <group position={[0, 0, 0]}>
          {/* Target Central Building Structure (Wireframe Volumes) */}
          <group position={[0, 1.5, 0]}>
            <mesh position={[-1.2, 0.5, -0.8]}>
              <boxGeometry args={[2.6, 4.0, 2.4]} />
              <meshStandardMaterial color="#38BDF8" wireframe />
            </mesh>
            <mesh position={[1.4, 0, 0.6]}>
              <boxGeometry args={[2.8, 3.0, 2.6]} />
              <meshStandardMaterial color="#F59E0B" wireframe />
            </mesh>
          </group>

          {/* Sparse 3D Landmark Tie Points */}
          {triangulationRays.targetPoints.map((tp, idx) => (
            <group key={idx} position={tp}>
              <mesh>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
              <mesh>
                <ringGeometry args={[0.22, 0.3, 16]} />
                <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}

          {/* 5 Distinct Recovered Camera Poses with 6-DoF RGB Coordinate Axes */}
          {frameInputData.map((f, i) => (
            <group key={i} position={f.pos} rotation={f.rot}>
              <lineSegments geometry={frustumGeom} scale={1.6}>
                <lineBasicMaterial color={f.color} linewidth={4} />
              </lineSegments>
              {/* Camera Optical Center Sphere */}
              <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshBasicMaterial color={f.color} />
              </mesh>
              {/* 3D RGB Coordinate Gimbal (X=Red, Y=Green, Z=Blue) */}
              <axesHelper args={[1.6]} />
            </group>
          ))}

          {/* Baseline Trajectory Spline */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...new THREE.BufferGeometry().setFromPoints(frameInputData.map((f) => f.pos))}
            />
            <lineBasicMaterial color="#10B981" linewidth={5} />
          </line>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 07: Geometric Validation (Epipolar Geometry & RANSAC Rejection) */}
      {/* ========================================================================= */}
      {stageIndex === 7 && (
        <group position={[0, 0.8, 0]}>
          {/* Left Frame with Epipolar Reference Lines */}
          <group position={[-3.2, 1.8, 0]} rotation={[0, 0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 2.6]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.95} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.4, 2.6)]} />
              <lineBasicMaterial color="#10B981" linewidth={4.5} />
            </lineSegments>
            {/* Epipolar Constraint Grid Lines */}
            {[-0.7, -0.2, 0.3, 0.8].map((ey, idx) => (
              <line key={idx}>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-1.6, ey, 0.02),
                    new THREE.Vector3(1.6, ey, 0.02),
                  ])}
                />
                <lineBasicMaterial color="#10B981" transparent opacity={0.45} linewidth={2} />
              </line>
            ))}
          </group>

          {/* Right Frame with Epipolar Reference Lines */}
          <group position={[3.2, 1.8, 0]} rotation={[0, -0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 2.6]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.95} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.4, 2.6)]} />
              <lineBasicMaterial color="#10B981" linewidth={4.5} />
            </lineSegments>
            {/* Epipolar Constraint Grid Lines */}
            {[-0.7, -0.2, 0.3, 0.8].map((ey, idx) => (
              <line key={idx}>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-1.6, ey, 0.02),
                    new THREE.Vector3(1.6, ey, 0.02),
                  ])}
                />
                <lineBasicMaterial color="#10B981" transparent opacity={0.45} linewidth={2} />
              </line>
            ))}
          </group>

          {/* Central RANSAC Consensus Filter Ring */}
          <group position={[0, 1.8, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[1.3, 1.45, 32]} />
              <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} transparent opacity={0.7} />
            </mesh>
          </group>

          {/* Inlier Matches (VIBRANT EMERALD GREEN - PASS) */}
          {featureMatches.inliers.map((m, idx) => (
            <group key={idx}>
              <mesh position={m.p1}>
                <sphereGeometry args={[0.09, 14, 14]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
              <mesh position={m.p2}>
                <sphereGeometry args={[0.09, 14, 14]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([m.p1, m.p2])}
                />
                <lineBasicMaterial color="#10B981" transparent opacity={0.98} linewidth={4} />
              </line>
            </group>
          ))}

          {/* Outlier Matches (BRIGHT RED WITH REJECT 'X' GLYPHS - REJECTED) */}
          {featureMatches.outliers.map((m, idx) => (
            <group key={idx}>
              <mesh position={m.p1}>
                <boxGeometry args={[0.16, 0.16, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
              <mesh position={m.p2}>
                <boxGeometry args={[0.16, 0.16, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([m.p1, m.p2])}
                />
                <lineBasicMaterial color="#EF4444" transparent opacity={0.4} linewidth={2} />
              </line>
            </group>
          ))}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 08: Point Cloud Generation (Dense Multi-Camera Triangulation) */}
      {/* ========================================================================= */}
      {stageIndex === 8 && (
        <group position={[0, 0, 0]}>
          {/* 3 Multi-Camera Triangulation Stations (Cyan, Amber, Emerald) */}
          {triangulationRays.cameras.map((cam, idx) => (
            <group key={idx} position={cam.pos} rotation={cam.rot}>
              <lineSegments geometry={frustumGeom} scale={2.0}>
                <lineBasicMaterial color={cam.color} linewidth={4} />
              </lineSegments>
              <mesh>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshBasicMaterial color={cam.color} />
              </mesh>
            </group>
          ))}

          {/* Intersecting Optical Triangulation Ray Lines */}
          {triangulationRays.lines.map((l, idx) => (
            <line key={idx}>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([l.from, l.to])}
              />
              <lineBasicMaterial color={l.color} transparent opacity={0.55} linewidth={2} />
            </line>
          ))}

          {/* Materializing Dense Point Cloud along Intersections */}
          <points geometry={pointClouds.scanCyan}>
            <pointsMaterial size={0.105} color="#38BDF8" transparent opacity={0.96} />
          </points>

          {/* Building Wireframe Scaffold */}
          <mesh position={[-2.4, 2.4, -1.4]}>
            <boxGeometry args={[2.8, 4.8, 2.4]} />
            <meshStandardMaterial color="#38BDF8" wireframe />
          </mesh>
          <mesh position={[2.2, 2.0, -1.2]}>
            <boxGeometry args={[3.0, 4.0, 2.6]} />
            <meshStandardMaterial color="#F59E0B" wireframe />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 09: Point Cloud Alignment (Multi-Scan ICP Registration) */}
      {/* ========================================================================= */}
      {stageIndex === 9 && (
        <group position={[0, 0, 0]}>
          {/* Sub-Scan A (Vibrant Sky Cyan) with Station A */}
          <group position={[-0.45, 0, -0.3]}>
            <points geometry={pointClouds.scanCyan}>
              <pointsMaterial size={0.1} color="#38BDF8" transparent opacity={0.92} />
            </points>
            <group position={[-4.2, 4.8, 3.6]} rotation={[-0.6, 0.45, 0]}>
              <lineSegments geometry={frustumGeom} scale={1.8}>
                <lineBasicMaterial color="#38BDF8" linewidth={4} />
              </lineSegments>
            </group>
          </group>

          {/* Sub-Scan B (Vibrant Amber Gold) with Station B, showing alignment offset */}
          <group position={[0.45, 0.2, 0.35]} rotation={[0, 0.1, 0]}>
            <points geometry={pointClouds.scanAmber}>
              <pointsMaterial size={0.1} color="#F59E0B" transparent opacity={0.92} />
            </points>
            <group position={[4.2, 4.8, 3.6]} rotation={[-0.6, -0.45, 0]}>
              <lineSegments geometry={frustumGeom} scale={1.8}>
                <lineBasicMaterial color="#F59E0B" linewidth={4} />
              </lineSegments>
            </group>
          </group>

          {/* ICP Point-to-Point Convergence Vector Rays (Magenta / Green) */}
          {icpVectors.map((v, idx) => (
            <line key={idx}>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([v.from, v.to])}
              />
              <lineBasicMaterial color={idx % 2 === 0 ? '#EC4899' : '#10B981'} transparent opacity={0.8} linewidth={2.5} />
            </line>
          ))}

          {/* 3D Alignment ICP Transformation Euler Gimbal */}
          <group position={[0, 2.2, 0]}>
            <axesHelper args={[2.6]} />
            {/* Rotation Alignment Rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.0, 2.12, 32]} />
              <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} transparent opacity={0.85} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[2.0, 2.12, 32]} />
              <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} transparent opacity={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <ringGeometry args={[2.0, 2.12, 32]} />
              <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} transparent opacity={0.85} />
            </mesh>
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 10: Point Cloud Fusion (Octree Voxelization & Surface Normals) */}
      {/* ========================================================================= */}
      {stageIndex === 10 && (
        <group position={[0, 0, 0]}>
          {/* Dense High-Resolution Unified Fused Point Cloud */}
          <points geometry={pointClouds.fused}>
            <pointsMaterial size={0.105} vertexColors transparent opacity={0.98} />
          </points>

          {/* 3D Octree Voxel Grid Bounding Cages */}
          {[-2.4, 0.0, 2.4].flatMap((vx, i) =>
            [1.2, 3.2].flatMap((vy, j) =>
              [-1.2, 1.2].map((vz, k) => (
                <lineSegments key={`${i}-${j}-${k}`} position={[vx, vy, vz]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(2.2, 1.8, 2.2)]} />
                  <lineBasicMaterial color="#0284C7" transparent opacity={0.35} linewidth={1.5} />
                </lineSegments>
              ))
            )
          )}

          {/* Hundreds of Computed Surface Normal Vectors */}
          {surfaceNormals.map((sn, idx) => (
            <group key={idx}>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([sn.start, sn.end])}
                />
                <lineBasicMaterial color={sn.color} transparent opacity={0.85} linewidth={2} />
              </line>
              <mesh position={sn.end}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color={sn.color} />
              </mesh>
            </group>
          ))}

          {/* Calibrated Multi-View Camera Station Network */}
          {frameInputData.map((f, i) => (
            <group key={i} position={f.pos} rotation={f.rot}>
              <lineSegments geometry={frustumGeom} scale={1.2}>
                <lineBasicMaterial color={f.color} transparent opacity={0.8} linewidth={2} />
              </lineSegments>
            </group>
          ))}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 11: 3D Point Cloud Output (Digital Twin & Geometric Measurement) */}
      {/* ========================================================================= */}
      {stageIndex === 11 && (
        <group position={[0, 0, 0]}>
          {/* Complete Classified Digital Twin Point Cloud */}
          <points geometry={pointClouds.classified}>
            <pointsMaterial size={0.11} vertexColors transparent opacity={0.98} />
          </points>

          {/* 3D Inspection Bounding Box with Metric Measurements */}
          <group position={[-0.4, 2.4, 0.2]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(8.6, 5.6, 7.4)]} />
              <lineBasicMaterial color="#38BDF8" linewidth={3} />
            </lineSegments>
            {/* Corner Caliper Target Markers */}
            {[-4.3, 4.3].flatMap((bx, i) =>
              [-2.8, 2.8].flatMap((by, j) =>
                [-3.7, 3.7].map((bz, k) => (
                  <mesh key={`${i}-${j}-${k}`} position={[bx, by, bz]}>
                    <sphereGeometry args={[0.12, 12, 12]} />
                    <meshBasicMaterial color="#F59E0B" />
                  </mesh>
                ))
              )
            )}
          </group>

          {/* Structural CAD Wireframe Shells */}
          <mesh position={[-2.4, 2.4, -1.4]}>
            <boxGeometry args={[2.8, 4.8, 2.4]} />
            <meshStandardMaterial color="#38BDF8" wireframe transparent opacity={0.4} />
          </mesh>
          <mesh position={[2.2, 2.0, -1.2]}>
            <boxGeometry args={[3.0, 4.0, 2.6]} />
            <meshStandardMaterial color="#F59E0B" wireframe transparent opacity={0.4} />
          </mesh>
          <mesh position={[-0.6, 1.5, 2.0]}>
            <boxGeometry args={[2.4, 3.0, 2.2]} />
            <meshStandardMaterial color="#10B981" wireframe transparent opacity={0.4} />
          </mesh>

          {/* Coordinate Origin Tripod */}
          <group position={[-4.5, 0.1, -3.8]}>
            <axesHelper args={[2.5]} />
          </group>
        </group>
      )}
    </>
  );
};
