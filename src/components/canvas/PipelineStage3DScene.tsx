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
    const w = 1.8;
    const h = 1.25;
    const d = 3.2;

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
      { pos: new THREE.Vector3(-5.0, 3.8, -2.2), rot: new THREE.Euler(-0.35, 0.55, 0), label: 'IMG_0101.RAW', ground: [-3.8, -1.8] },
      { pos: new THREE.Vector3(-2.5, 4.2, 0.2), rot: new THREE.Euler(-0.4, 0.28, 0), label: 'IMG_0102.RAW', ground: [-2.0, 0.1] },
      { pos: new THREE.Vector3(0.0, 4.4, 1.6), rot: new THREE.Euler(-0.45, 0, 0), label: 'IMG_0103.RAW', ground: [0.0, 1.2] },
      { pos: new THREE.Vector3(2.5, 4.2, 0.2), rot: new THREE.Euler(-0.4, -0.28, 0), label: 'IMG_0104.RAW', ground: [2.0, 0.1] },
      { pos: new THREE.Vector3(5.0, 3.8, -2.2), rot: new THREE.Euler(-0.35, -0.55, 0), label: 'IMG_0105.RAW', ground: [3.8, -1.8] },
    ];
    return frames;
  }, []);

  // Calibration Chessboard Corner Keypoints Grid
  const calibrationCorners = useMemo(() => {
    const corners: THREE.Vector3[] = [];
    const startX = -2.0;
    const startY = -1.2;
    const stepX = 0.5;
    const stepY = 0.4;
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 9; col++) {
        corners.push(new THREE.Vector3(startX + col * stepX, startY + row * stepY, 0.08));
      }
    }
    return corners;
  }, []);

  // Feature Matches (Valid Inliers & Outliers)
  const featureMatches = useMemo(() => {
    const leftPlanePos = new THREE.Vector3(-2.8, 1.8, 0);
    const rightPlanePos = new THREE.Vector3(2.8, 1.8, 0);
    const inliers: { p1: THREE.Vector3; p2: THREE.Vector3; epipolarY: number }[] = [];
    const outliers: { p1: THREE.Vector3; p2: THREE.Vector3 }[] = [];

    // Real structured keypoints (building corners, roof crests, window intersections)
    const inlierCoords = [
      [-1.0, 0.8, -0.92, 0.8],
      [-0.6, 0.8, -0.52, 0.8],
      [-0.2, 0.8, -0.12, 0.8],
      [0.2, 0.8, 0.28, 0.8],
      [0.6, 0.8, 0.68, 0.8],
      [1.0, 0.8, 1.08, 0.8],
      [-0.9, 0.3, -0.82, 0.3],
      [-0.4, 0.3, -0.32, 0.3],
      [0.1, 0.3, 0.18, 0.3],
      [0.7, 0.3, 0.78, 0.3],
      [-0.8, -0.2, -0.72, -0.2],
      [-0.3, -0.2, -0.22, -0.2],
      [0.3, -0.2, 0.38, -0.2],
      [0.8, -0.2, 0.88, -0.2],
      [-0.9, -0.7, -0.82, -0.7],
      [-0.4, -0.7, -0.32, -0.7],
      [0.1, -0.7, 0.18, -0.7],
      [0.6, -0.7, 0.68, -0.7],
    ];

    inlierCoords.forEach(([x1, y1, x2, y2]) => {
      const p1 = new THREE.Vector3(leftPlanePos.x + x1, leftPlanePos.y + y1, leftPlanePos.z + 0.05);
      const p2 = new THREE.Vector3(rightPlanePos.x + x2, rightPlanePos.y + y2, rightPlanePos.z + 0.05);
      inliers.push({ p1, p2, epipolarY: y1 });
    });

    // Gross outlier mismatches (deviating from epipolar geometry)
    const outlierCoords = [
      [-0.95, 0.85, 0.85, -0.85],
      [0.95, -0.65, -0.85, 0.75],
      [-0.35, -0.95, 0.75, 0.95],
      [0.55, 0.85, -0.75, -0.55],
      [-0.75, -0.45, 0.65, 0.35],
      [0.35, -0.85, -0.45, 0.85],
    ];

    outlierCoords.forEach(([x1, y1, x2, y2]) => {
      const p1 = new THREE.Vector3(leftPlanePos.x + x1, leftPlanePos.y + y1, leftPlanePos.z + 0.05);
      const p2 = new THREE.Vector3(rightPlanePos.x + x2, rightPlanePos.y + y2, rightPlanePos.z + 0.05);
      outliers.push({ p1, p2 });
    });

    return { inliers, outliers };
  }, []);

  // Multi-view triangulation rays for Stage 08
  const triangulationRays = useMemo(() => {
    const cameras = [
      new THREE.Vector3(-4.0, 5.0, 3.5),
      new THREE.Vector3(0.0, 5.5, 4.5),
      new THREE.Vector3(4.0, 5.0, 3.5),
    ];
    const targetPoints = [
      new THREE.Vector3(-2.0, 3.5, -1.0),
      new THREE.Vector3(-0.8, 4.2, -0.5),
      new THREE.Vector3(1.5, 3.2, -1.0),
      new THREE.Vector3(0.2, 1.8, 1.2),
      new THREE.Vector3(-1.8, 1.5, 1.5),
      new THREE.Vector3(2.2, 1.6, 1.0),
    ];
    const lines: { from: THREE.Vector3; to: THREE.Vector3; color: string }[] = [];
    cameras.forEach((cam, cIdx) => {
      const color = cIdx === 0 ? '#38BDF8' : cIdx === 1 ? '#F59E0B' : '#10B981';
      targetPoints.forEach((tgt) => {
        lines.push({ from: cam, to: tgt, color });
      });
    });
    return { cameras, targetPoints, lines };
  }, []);

  // Surface Normal Vectors for Stage 10
  const surfaceNormals = useMemo(() => {
    const vectors: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const step = 0.8;
    // Front and roof samples
    for (let x = -3.0; x <= 3.0; x += step) {
      for (let y = 0.5; y <= 4.0; y += step) {
        const start = new THREE.Vector3(x, y, 1.2);
        const end = new THREE.Vector3(x, y, 1.7);
        vectors.push({ start, end });
      }
    }
    // Roof normals pointing up
    for (let x = -2.5; x <= 2.5; x += step) {
      for (let z = -2.0; z <= 1.0; z += step) {
        const start = new THREE.Vector3(x, 4.2, z);
        const end = new THREE.Vector3(x, 4.7, z);
        vectors.push({ start, end });
      }
    }
    return vectors;
  }, []);

  // Dense 3D Point Cloud Generator with rich depth and multi-view coloring
  const pointClouds = useMemo(() => {
    const createBuildingCloud = (colorMode: 'depth' | 'cyan' | 'amber' | 'multi' | 'fused' | 'classified', count = 5000) => {
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
        const isRoof = Math.random() < 0.38;
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

        x += (Math.random() - 0.5) * 0.06;
        y += (Math.random() - 0.5) * 0.06;
        z += (Math.random() - 0.5) * 0.06;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        if (colorMode === 'depth') {
          // Vivid Multi-tone Depth Spectrum: Near (High Y / Near Z) = Gold/Amber, Mid = Cyan/Teal, Far = Violet/Indigo
          const depthNorm = Math.min(Math.max((z + 2.5) / 5.5, 0), 1);
          if (depthNorm > 0.65) {
            // Near
            colors[i * 3] = 0.98;
            colors[i * 3 + 1] = 0.75 - (depthNorm - 0.65) * 0.5;
            colors[i * 3 + 2] = 0.1;
          } else if (depthNorm > 0.35) {
            // Mid
            colors[i * 3] = 0.1;
            colors[i * 3 + 1] = 0.85;
            colors[i * 3 + 2] = 0.8;
          } else {
            // Far
            colors[i * 3] = 0.35 + (0.35 - depthNorm);
            colors[i * 3 + 1] = 0.25;
            colors[i * 3 + 2] = 0.95;
          }
        } else if (colorMode === 'cyan') {
          colors[i * 3] = 0.22;
          colors[i * 3 + 1] = 0.76;
          colors[i * 3 + 2] = 0.98;
        } else if (colorMode === 'amber') {
          colors[i * 3] = 0.98;
          colors[i * 3 + 1] = 0.62;
          colors[i * 3 + 2] = 0.08;
        } else if (colorMode === 'classified') {
          // Output Digital Twin Classification: Roof = Terracotta Red/Amber, Facade = Sleek Slate Cyan, Ground = Emerald
          if (isRoof) {
            colors[i * 3] = 0.95;
            colors[i * 3 + 1] = 0.55;
            colors[i * 3 + 2] = 0.2;
          } else if (y < 0.35) {
            colors[i * 3] = 0.15;
            colors[i * 3 + 1] = 0.85;
            colors[i * 3 + 2] = 0.45;
          } else {
            const t = y / 4.8;
            colors[i * 3] = 0.25 + t * 0.4;
            colors[i * 3 + 1] = 0.65 + t * 0.3;
            colors[i * 3 + 2] = 0.95;
          }
        } else {
          // Fused clean RGB
          const t = y / 4.8;
          colors[i * 3] = 0.25 + t * 0.5;
          colors[i * 3 + 1] = 0.6 + t * 0.35;
          colors[i * 3 + 2] = 0.95;
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      return geom;
    };

    return {
      depth: createBuildingCloud('depth', 6500),
      cyan: createBuildingCloud('cyan', 3500),
      amber: createBuildingCloud('amber', 3500),
      fused: createBuildingCloud('fused', 7000),
      classified: createBuildingCloud('classified', 8000),
    };
  }, []);

  return (
    <>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[14, 24, 18]} intensity={2.8} color="#FFFFFF" />
      <directionalLight position={[-14, 14, -14]} intensity={1.8} color="#93B8D3" />
      <pointLight position={[0, 10, 0]} intensity={2.4} color="#38BDF8" />
      <pointLight position={[-8, 5, 8]} intensity={2.0} color="#F59E0B" />

      {/* Orbit Controls with smooth damping */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={25}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.5}
      />

      {/* High-contrast Base Grid */}
      <gridHelper args={[22, 22, '#38BDF8', '#1E293B']} position={[0, -0.01, 0]} />

      {/* ========================================================================= */}
      {/* STAGE 01: Frame Input (UAV Image Acquisition) */}
      {/* ========================================================================= */}
      {stageIndex === 1 && (
        <group position={[0, 0, 0]}>
          {/* Flight Path Spline Line */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...new THREE.BufferGeometry().setFromPoints(frameInputData.map((f) => f.pos))}
            />
            <lineBasicMaterial color="#10B981" linewidth={4.5} />
          </line>

          {/* Sequential Aerial Frames with Ground Footprints */}
          {frameInputData.map((f, i) => (
            <group key={i}>
              {/* Floating Camera Viewframe */}
              <group position={f.pos} rotation={f.rot}>
                {/* Dark Photo Mount */}
                <mesh>
                  <planeGeometry args={[2.2, 1.5]} />
                  <meshStandardMaterial color="#0B132B" side={THREE.DoubleSide} metalness={0.7} roughness={0.3} />
                </mesh>
                {/* Bright Neon Frame Border */}
                <lineSegments>
                  <edgesGeometry args={[new THREE.PlaneGeometry(2.2, 1.5)]} />
                  <lineBasicMaterial color={i === 2 ? '#F59E0B' : '#38BDF8'} linewidth={4} />
                </lineSegments>
                {/* Aerial Thumbnail Grid Preview */}
                <mesh position={[0, -0.1, 0.02]}>
                  <planeGeometry args={[1.7, 0.9, 6, 4]} />
                  <meshBasicMaterial color="#1E293B" wireframe />
                </mesh>
                {/* Reticle Target */}
                <mesh position={[0, 0.18, 0.03]}>
                  <ringGeometry args={[0.2, 0.26, 24]} />
                  <meshBasicMaterial color={i === 2 ? '#F59E0B' : '#38BDF8'} />
                </mesh>
                {/* Optical Frustum Cone */}
                <lineSegments geometry={frustumGeom} scale={0.75} position={[0, 0, 0.1]}>
                  <lineBasicMaterial color="#38BDF8" transparent opacity={0.75} linewidth={1.5} />
                </lineSegments>
              </group>

              {/* Waypoint Altitude Indicator Node */}
              <mesh position={[f.pos.x, f.pos.y, f.pos.z]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(f.pos.x, f.pos.y, f.pos.z),
                    new THREE.Vector3(f.pos.x, 0, f.pos.z),
                  ])}
                />
                <lineBasicMaterial color="#10B981" transparent opacity={0.35} linewidth={1} />
              </line>

              {/* Ground Overlapping Field of View Footprint */}
              <mesh position={[f.ground[0], 0.02, f.ground[1]]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.8, 2.2]} />
                <meshBasicMaterial
                  color={i % 2 === 0 ? '#38BDF8' : '#F59E0B'}
                  transparent
                  opacity={0.18}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <lineSegments position={[f.ground[0], 0.03, f.ground[1]]} rotation={[-Math.PI / 2, 0, 0]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(2.8, 2.2)]} />
                <lineBasicMaterial color={i % 2 === 0 ? '#38BDF8' : '#F59E0B'} linewidth={2} />
              </lineSegments>
            </group>
          ))}

          {/* Detailed Drone Quadcopter at Leading Waypoint */}
          <group position={[5.0, 4.3, -2.2]} rotation={[-0.35, -0.55, 0]}>
            {/* Main Fuselage */}
            <mesh>
              <boxGeometry args={[1.0, 0.18, 1.0]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Gimbal Camera Pod */}
            <mesh position={[0, -0.22, 0.15]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            {/* 4 Rotor Arms with Glowing Discs */}
            {[-0.65, 0.65].map((rx, idx1) =>
              [-0.65, 0.65].map((rz, idx2) => (
                <group key={`${idx1}-${idx2}`} position={[rx, 0.12, rz]}>
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.25, 0.36, 20]} />
                    <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
                    <meshStandardMaterial color="#64748B" />
                  </mesh>
                </group>
              ))
            )}
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 02: Camera Calibration (Intrinsics Estimation) */}
      {/* ========================================================================= */}
      {stageIndex === 2 && (
        <group position={[0, 1.4, 0]}>
          {/* Main Primary Checkerboard Calibration Board */}
          <group position={[-0.8, 0, -3.2]} rotation={[-0.1, 0.15, 0]}>
            <mesh>
              <boxGeometry args={[5.2, 3.6, 0.15]} />
              <meshStandardMaterial color="#0F172A" roughness={0.4} />
            </mesh>
            <gridHelper args={[4.8, 12, '#38BDF8', '#F8FAFC']} position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments position={[0, 0, 0.09]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(4.8, 3.2)]} />
              <lineBasicMaterial color="#F59E0B" linewidth={4} />
            </lineSegments>
            {/* Detected Sub-pixel Corner Crosshairs (Green Dots) */}
            {calibrationCorners.map((c, i) => (
              <mesh key={i} position={c}>
                <sphereGeometry args={[0.045, 8, 8]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
            ))}
          </group>

          {/* Secondary Angled Calibration Target */}
          <group position={[3.2, -0.2, -2.6]} rotation={[-0.1, -0.6, 0]}>
            <mesh>
              <boxGeometry args={[2.8, 2.4, 0.1]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <gridHelper args={[2.4, 6, '#F59E0B', '#64748B']} position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments position={[0, 0, 0.07]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(2.4, 2.0)]} />
              <lineBasicMaterial color="#10B981" linewidth={3} />
            </lineSegments>
          </group>

          {/* Detailed DSLR Camera with Visible Sensor Cutaway */}
          <group position={[0, 1.2, 2.8]} rotation={[-0.12, 0, 0]}>
            {/* Main Camera Body */}
            <mesh position={[0, 0, 0.5]}>
              <boxGeometry args={[1.5, 1.0, 0.9]} />
              <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Sensor Plane Cutout with Principal Point (cx, cy) */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.9, 0.6]} />
              <meshBasicMaterial color="#0284C7" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.04]}>
              <ringGeometry args={[0.08, 0.12, 16]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            {/* Lens Barrel Cylinder */}
            <mesh position={[0, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.48, 0.54, 0.8, 32]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Front Aperture Glass */}
            <mesh position={[0, 0, -0.86]}>
              <circleGeometry args={[0.42, 32]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>

            {/* Projected Optical Cone to Checkerboard */}
            <lineSegments geometry={frustumGeom} scale={3.2} position={[0, 0, -0.8]}>
              <lineBasicMaterial color="#F59E0B" linewidth={3.5} />
            </lineSegments>

            {/* Principal Optical Axis Ray */}
            <line>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(0, 0, -6.5),
                ])}
              />
              <lineBasicMaterial color="#38BDF8" linewidth={4} />
            </line>

            {/* 3D Coordinate Gimbal Frame */}
            <axesHelper args={[2.0]} />
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 03: Image Correction (Radial Distortion Rectification) */}
      {/* ========================================================================= */}
      {stageIndex === 3 && (
        <group position={[0, 1.8, 0]}>
          {/* Distorted Image Plane (Left - Red Warning) */}
          <group position={[-2.8, 0, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 2.6]} />
              <meshStandardMaterial color="#1C1917" side={THREE.DoubleSide} />
            </mesh>
            <gridHelper args={[3.4, 16, '#EF4444', '#78350F']} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.4, 2.6)]} />
              <lineBasicMaterial color="#EF4444" linewidth={4.5} />
            </lineSegments>
            {/* Concentric Barrel Distortion Rings */}
            <mesh position={[0, 0, 0.05]}>
              <ringGeometry args={[0.9, 0.98, 32]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <ringGeometry args={[0.45, 0.52, 32]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            {/* Distorted Corner Vectors */}
            {[-1.3, 1.3].map((cx, i) =>
              [-1.0, 1.0].map((cy, j) => (
                <mesh key={`${i}-${j}`} position={[cx, cy, 0.06]}>
                  <ringGeometry args={[0.12, 0.18, 16]} />
                  <meshBasicMaterial color="#EF4444" />
                </mesh>
              ))
            )}
          </group>

          {/* Corrected Rectilinear Plane (Right - Emerald Green Success) */}
          <group position={[2.8, 0, 0]}>
            <mesh>
              <planeGeometry args={[3.4, 2.6]} />
              <meshStandardMaterial color="#064E3B" side={THREE.DoubleSide} />
            </mesh>
            <gridHelper args={[3.4, 16, '#10B981', '#065F46']} rotation={[Math.PI / 2, 0, 0]} />
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.4, 2.6)]} />
              <lineBasicMaterial color="#10B981" linewidth={4.5} />
            </lineSegments>
            {/* Crisp Square Alignment Crosshair */}
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[1.8, 1.8]} />
              <meshBasicMaterial color="#10B981" wireframe />
            </mesh>
            {[-1.3, 1.3].map((cx, i) =>
              [-1.0, 1.0].map((cy, j) => (
                <mesh key={`${i}-${j}`} position={[cx, cy, 0.06]}>
                  <boxGeometry args={[0.2, 0.2, 0.02]} />
                  <meshBasicMaterial color="#10B981" />
                </mesh>
              ))
            )}
          </group>

          {/* Glowing Cyan Transformation Arrow */}
          <group position={[0, 0, 0]}>
            <line>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(-1.1, 0, 0),
                  new THREE.Vector3(1.1, 0, 0),
                ])}
              />
              <lineBasicMaterial color="#38BDF8" linewidth={5} />
            </line>
            <mesh position={[1.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.28, 0.6, 20]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 04: Depth Estimation (Dense Metric Depth Maps) */}
      {/* ========================================================================= */}
      {stageIndex === 4 && (
        <group position={[0, 0.2, 0]}>
          {/* Dense Depth-colored Point Cloud Scene */}
          <points geometry={pointClouds.depth}>
            <pointsMaterial size={0.095} vertexColors transparent opacity={0.96} />
          </points>

          {/* Continuous Multi-Color Depth Legend Strip */}
          <group position={[-4.8, 2.4, 0]}>
            <mesh position={[0, 1.0, 0]}>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshBasicMaterial color="#FACC15" />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshBasicMaterial color="#06B6D4" />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshBasicMaterial color="#6366F1" />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.42, 2.0, 0.12)]} />
              <lineBasicMaterial color="#FFFFFF" linewidth={2} />
            </lineSegments>
          </group>

          {/* Active Observing Depth Sensor Projecting Laser Scan Beam */}
          <group position={[4.6, 5.4, 5.2]} rotation={[-0.65, 0.5, 0]}>
            <lineSegments geometry={largeFrustumGeom} scale={1.2}>
              <lineBasicMaterial color="#06B6D4" linewidth={3.5} />
            </lineSegments>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.24, 16, 16]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
          </group>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 05: Feature Matching (Visual Correspondences) */}
      {/* ========================================================================= */}
      {stageIndex === 5 && (
        <group position={[0, 0.8, 0]}>
          {/* Left Frame Viewport */}
          <group position={[-3.0, 1.8, 0]} rotation={[0, 0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.2, 2.4]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.94} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2.4)]} />
              <lineBasicMaterial color="#38BDF8" linewidth={4} />
            </lineSegments>
            {/* Feature Wireframe Building Facade on Frame */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[2.4, 1.8, 4, 4]} />
              <meshBasicMaterial color="#1E293B" wireframe />
            </mesh>
          </group>

          {/* Right Frame Viewport */}
          <group position={[3.0, 1.8, 0]} rotation={[0, -0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.2, 2.4]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.94} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2.4)]} />
              <lineBasicMaterial color="#38BDF8" linewidth={4} />
            </lineSegments>
            {/* Feature Wireframe Building Facade on Frame */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[2.4, 1.8, 4, 4]} />
              <meshBasicMaterial color="#1E293B" wireframe />
            </mesh>
          </group>

          {/* 3D Laser Correspondence Beams Connecting Matched Keypoints */}
          {featureMatches.inliers.map((m, idx) => (
            <group key={idx}>
              {/* Keypoint Reticle Node Left */}
              <mesh position={m.p1}>
                <ringGeometry args={[0.06, 0.1, 16]} />
                <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} />
              </mesh>
              {/* Keypoint Reticle Node Right */}
              <mesh position={m.p2}>
                <ringGeometry args={[0.06, 0.1, 16]} />
                <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} />
              </mesh>
              {/* Connecting Laser Match Line */}
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([m.p1, m.p2])}
                />
                <lineBasicMaterial color="#38BDF8" transparent opacity={0.9} linewidth={3} />
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
          {/* Target Central Building Structure (Wireframe Volume) */}
          <group position={[0, 1.5, 0]}>
            <mesh position={[-1.2, 0.5, -0.8]}>
              <boxGeometry args={[2.4, 3.8, 2.2]} />
              <meshStandardMaterial color="#1E293B" wireframe />
            </mesh>
            <mesh position={[1.4, 0, 0.6]}>
              <boxGeometry args={[2.6, 2.8, 2.4]} />
              <meshStandardMaterial color="#1E293B" wireframe />
            </mesh>
          </group>

          {/* Triangulated 3D Sparse Tie Points in the Center */}
          {triangulationRays.targetPoints.map((tp, idx) => (
            <group key={idx} position={tp}>
              <mesh>
                <sphereGeometry args={[0.14, 16, 16]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
              <mesh>
                <ringGeometry args={[0.2, 0.26, 16]} />
                <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}

          {/* 5 Distinct Recovered Camera Poses with 6-DoF RGB Coordinate Axes */}
          {frameInputData.map((f, i) => (
            <group key={i} position={f.pos} rotation={f.rot}>
              <lineSegments geometry={frustumGeom} scale={1.5}>
                <lineBasicMaterial color={i === 2 ? '#F59E0B' : '#38BDF8'} linewidth={3.5} />
              </lineSegments>
              {/* Origin Node */}
              <mesh>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshBasicMaterial color={i === 2 ? '#F59E0B' : '#38BDF8'} />
              </mesh>
              {/* 3D RGB Coordinate Gimbal (X=Red, Y=Green, Z=Blue) */}
              <axesHelper args={[1.4]} />
            </group>
          ))}

          {/* Baseline Trajectory Line */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...new THREE.BufferGeometry().setFromPoints(frameInputData.map((f) => f.pos))}
            />
            <lineBasicMaterial color="#10B981" linewidth={4.5} />
          </line>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 07: Geometric Validation (Epipolar Geometry & RANSAC Rejection) */}
      {/* ========================================================================= */}
      {stageIndex === 7 && (
        <group position={[0, 0.8, 0]}>
          {/* Left Frame with Epipolar Reference Lines */}
          <group position={[-3.0, 1.8, 0]} rotation={[0, 0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.2, 2.4]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.94} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2.4)]} />
              <lineBasicMaterial color="#10B981" linewidth={4} />
            </lineSegments>
            {/* Epipolar Constraint Grid Lines */}
            {[-0.7, -0.2, 0.3, 0.8].map((ey, idx) => (
              <line key={idx}>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-1.5, ey, 0.02),
                    new THREE.Vector3(1.5, ey, 0.02),
                  ])}
                />
                <lineBasicMaterial color="#10B981" transparent opacity={0.4} linewidth={1.5} />
              </line>
            ))}
          </group>

          {/* Right Frame with Epipolar Reference Lines */}
          <group position={[3.0, 1.8, 0]} rotation={[0, -0.28, 0]}>
            <mesh>
              <planeGeometry args={[3.2, 2.4]} />
              <meshStandardMaterial color="#0F172A" side={THREE.DoubleSide} transparent opacity={0.94} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2.4)]} />
              <lineBasicMaterial color="#10B981" linewidth={4} />
            </lineSegments>
            {/* Epipolar Constraint Grid Lines */}
            {[-0.7, -0.2, 0.3, 0.8].map((ey, idx) => (
              <line key={idx}>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-1.5, ey, 0.02),
                    new THREE.Vector3(1.5, ey, 0.02),
                  ])}
                />
                <lineBasicMaterial color="#10B981" transparent opacity={0.4} linewidth={1.5} />
              </line>
            ))}
          </group>

          {/* Inlier Matches (VIBRANT EMERALD GREEN - PASS) */}
          {featureMatches.inliers.map((m, idx) => (
            <group key={idx}>
              <mesh position={m.p1}>
                <sphereGeometry args={[0.085, 14, 14]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
              <mesh position={m.p2}>
                <sphereGeometry args={[0.085, 14, 14]} />
                <meshBasicMaterial color="#10B981" />
              </mesh>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([m.p1, m.p2])}
                />
                <lineBasicMaterial color="#10B981" transparent opacity={0.98} linewidth={3.5} />
              </line>
            </group>
          ))}

          {/* Outlier Matches (BRIGHT RED WITH REJECT 'X' GLYPHS - REJECTED) */}
          {featureMatches.outliers.map((m, idx) => (
            <group key={idx}>
              <mesh position={m.p1}>
                <boxGeometry args={[0.12, 0.12, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
              <mesh position={m.p2}>
                <boxGeometry args={[0.12, 0.12, 0.02]} />
                <meshBasicMaterial color="#EF4444" />
              </mesh>
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints([m.p1, m.p2])}
                />
                <lineBasicMaterial color="#EF4444" transparent opacity={0.35} linewidth={1.5} />
              </line>
            </group>
          ))}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 08: Point Cloud Generation (Dense 3D Triangulation) */}
      {/* ========================================================================= */}
      {stageIndex === 8 && (
        <group position={[0, 0, 0]}>
          {/* Multi-Camera Triangulation Rig */}
          {triangulationRays.cameras.map((cam, idx) => (
            <group key={idx} position={cam} rotation={[-0.7, (idx - 1) * 0.4, 0]}>
              <lineSegments geometry={frustumGeom} scale={1.8}>
                <lineBasicMaterial color={idx === 1 ? '#F59E0B' : '#38BDF8'} linewidth={3.5} />
              </lineSegments>
              <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshBasicMaterial color={idx === 1 ? '#F59E0B' : '#38BDF8'} />
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
              <lineBasicMaterial color={l.color} transparent opacity={0.5} linewidth={1.5} />
            </line>
          ))}

          {/* Materializing Dense Point Cloud along Rays */}
          <points geometry={pointClouds.cyan}>
            <pointsMaterial size={0.095} color="#38BDF8" transparent opacity={0.96} />
          </points>

          {/* Building Wireframe Scaffold */}
          <mesh position={[-2.4, 2.4, -1.4]}>
            <boxGeometry args={[2.8, 4.8, 2.4]} />
            <meshStandardMaterial color="#1E293B" wireframe />
          </mesh>
          <mesh position={[2.2, 2.0, -1.2]}>
            <boxGeometry args={[3.0, 4.0, 2.6]} />
            <meshStandardMaterial color="#1E293B" wireframe />
          </mesh>
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 09: Point Cloud Alignment (Multi-Scan ICP Registration) */}
      {/* ========================================================================= */}
      {stageIndex === 9 && (
        <group position={[0, 0, 0]}>
          {/* Sub-Scan A (Cyan) with Camera A */}
          <group position={[-0.4, 0, -0.3]}>
            <points geometry={pointClouds.cyan}>
              <pointsMaterial size={0.09} color="#38BDF8" transparent opacity={0.92} />
            </points>
            <group position={[-3.8, 4.6, 3.4]} rotation={[-0.6, 0.45, 0]}>
              <lineSegments geometry={frustumGeom} scale={1.6}>
                <lineBasicMaterial color="#38BDF8" linewidth={3.5} />
              </lineSegments>
            </group>
          </group>

          {/* Sub-Scan B (Amber) with Camera B, showing alignment offset */}
          <group position={[0.4, 0.15, 0.3]} rotation={[0, 0.08, 0]}>
            <points geometry={pointClouds.amber}>
              <pointsMaterial size={0.09} color="#F59E0B" transparent opacity={0.92} />
            </points>
            <group position={[3.8, 4.6, 3.4]} rotation={[-0.6, -0.45, 0]}>
              <lineSegments geometry={frustumGeom} scale={1.6}>
                <lineBasicMaterial color="#F59E0B" linewidth={3.5} />
              </lineSegments>
            </group>
          </group>

          {/* 3D Alignment ICP Transformation Gizmo */}
          <group position={[0, 2.0, 0]}>
            <axesHelper args={[2.4]} />
            {/* Rotation Alignment Rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.8, 1.9, 32]} />
              <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[1.8, 1.9, 32]} />
              <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} transparent opacity={0.8} />
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
            <pointsMaterial size={0.095} vertexColors transparent opacity={0.98} />
          </points>

          {/* 3D Octree Voxel Grid Bounding Cells */}
          {[-2.4, 0.0, 2.4].flatMap((vx, i) =>
            [1.2, 3.2].flatMap((vy, j) =>
              [-1.2, 1.2].map((vz, k) => (
                <lineSegments key={`${i}-${j}-${k}`} position={[vx, vy, vz]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(2.2, 1.8, 2.2)]} />
                  <lineBasicMaterial color="#0284C7" transparent opacity={0.28} linewidth={1} />
                </lineSegments>
              ))
            )
          )}

          {/* Surface Normal Vectors */}
          {surfaceNormals.map((sn, idx) => (
            <line key={idx}>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([sn.start, sn.end])}
              />
              <lineBasicMaterial color="#10B981" transparent opacity={0.7} linewidth={1.5} />
            </line>
          ))}

          {/* Multi-view Calibrated Camera Stations */}
          {frameInputData.map((f, i) => (
            <group key={i} position={f.pos} rotation={f.rot}>
              <lineSegments geometry={frustumGeom} scale={1.1}>
                <lineBasicMaterial color="#93B8D3" transparent opacity={0.75} linewidth={2} />
              </lineSegments>
            </group>
          ))}
        </group>
      )}

      {/* ========================================================================= */}
      {/* STAGE 11: 3D Point Cloud Output (Digital Twin & Geometric Validation) */}
      {/* ========================================================================= */}
      {stageIndex === 11 && (
        <group position={[0, 0, 0]}>
          {/* Complete Classified Digital Twin Point Cloud */}
          <points geometry={pointClouds.classified}>
            <pointsMaterial size={0.098} vertexColors transparent opacity={0.98} />
          </points>

          {/* 3D Dimension Inspection Bounding Box */}
          <group position={[-0.4, 2.4, 0.2]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(8.4, 5.4, 7.2)]} />
              <lineBasicMaterial color="#38BDF8" linewidth={2.5} />
            </lineSegments>
            {/* Corner Bracket Markers */}
            {[-4.2, 4.2].flatMap((bx, i) =>
              [-2.7, 2.7].flatMap((by, j) =>
                [-3.6, 3.6].map((bz, k) => (
                  <mesh key={`${i}-${j}-${k}`} position={[bx, by, bz]}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color="#F59E0B" />
                  </mesh>
                ))
              )
            )}
          </group>

          {/* Structural Wireframe Shells */}
          <mesh position={[-2.4, 2.4, -1.4]}>
            <boxGeometry args={[2.8, 4.8, 2.4]} />
            <meshStandardMaterial color="#38BDF8" wireframe transparent opacity={0.35} />
          </mesh>
          <mesh position={[2.2, 2.0, -1.2]}>
            <boxGeometry args={[3.0, 4.0, 2.6]} />
            <meshStandardMaterial color="#38BDF8" wireframe transparent opacity={0.35} />
          </mesh>
          <mesh position={[-0.6, 1.5, 2.0]}>
            <boxGeometry args={[2.4, 3.0, 2.2]} />
            <meshStandardMaterial color="#38BDF8" wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      )}
    </>
  );
};
