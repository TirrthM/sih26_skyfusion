'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface DroneModel3DProps {
  reducedMotion?: boolean;
}

export const DroneModel3D: React.FC<DroneModel3DProps> = ({ reducedMotion = false }) => {
  const droneGroupRef = useRef<THREE.Group>(null);
  const propRef1 = useRef<THREE.Mesh>(null);
  const propRef2 = useRef<THREE.Mesh>(null);
  const propRef3 = useRef<THREE.Mesh>(null);
  const propRef4 = useRef<THREE.Mesh>(null);
  const scanConeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!reducedMotion && droneGroupRef.current) {
      // Orbit along the survey path with subtle pitch and yaw
      const radiusX = 4.2;
      const radiusZ = 3.6;
      const speed = 0.35;
      const posX = Math.sin(t * speed) * radiusX;
      const posZ = Math.cos(t * speed) * radiusZ;
      const posY = 3.8 + Math.sin(t * 0.8) * 0.2;

      droneGroupRef.current.position.set(posX, posY, posZ);

      // Look direction along trajectory
      const nextX = Math.sin((t + 0.1) * speed) * radiusX;
      const nextZ = Math.cos((t + 0.1) * speed) * radiusZ;
      droneGroupRef.current.lookAt(nextX, posY, nextZ);

      // Fast propeller rotation
      const propSpeed = 25;
      if (propRef1.current) propRef1.current.rotation.y += propSpeed * 0.016;
      if (propRef2.current) propRef2.current.rotation.y -= propSpeed * 0.016;
      if (propRef3.current) propRef3.current.rotation.y += propSpeed * 0.016;
      if (propRef4.current) propRef4.current.rotation.y -= propSpeed * 0.016;
    } else if (droneGroupRef.current) {
      droneGroupRef.current.position.set(2, 4.2, 3);
    }
  });

  return (
    <group ref={droneGroupRef}>
      {/* Central Drone Fuselage */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.4]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* GPS Dome / Sensor Pod */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.08, 16]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Gimbal Camera Underbody */}
      <mesh position={[0, -0.1, 0.08]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} />
      </mesh>

      {/* Quad Arms */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[1.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Motors & Propellers (4 corners) */}
      {[
        [-0.38, 0.04, -0.38],
        [0.38, 0.04, -0.38],
        [-0.38, 0.04, 0.38],
        [0.38, 0.04, 0.38],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
          <mesh
            ref={idx === 0 ? propRef1 : idx === 1 ? propRef2 : idx === 2 ? propRef3 : propRef4}
            position={[0, 0.04, 0]}
          >
            <boxGeometry args={[0.36, 0.006, 0.03]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
          </mesh>
        </group>
      ))}

      {/* Downward LiDAR Scan Cone */}
      <mesh
        ref={scanConeRef}
        position={[0, -1.5, 0]}
        rotation={[0, 0, 0]}
      >
        <coneGeometry args={[1.6, 3.0, 32, 1, true]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
