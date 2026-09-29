import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DroneModel3D } from './DroneModel3D';
import { Html } from '@react-three/drei';

export const DroneLoader3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      // Hover up and down slightly
      groupRef.current.position.y = Math.sin(t * 2) * 0.2;
      // Rotate the entire loader group slowly
      groupRef.current.rotation.y = t * 0.5;
    }
    
    if (ringRef.current) {
      // Pulse the ring scale and opacity
      const scale = 1 + Math.sin(t * 3) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
      
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(t * 3) * 0.2;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      <group ref={groupRef}>
        {/* Render the actual 3D drone but centered */}
        <group position={[0, 0, 0]}>
          {/* We reconstruct a simple drone here to avoid the DroneModel3D trajectory logic */}
          {/* Central Drone Fuselage */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.15, 0.6]} />
            <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* GPS Dome / Sensor Pod */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Arms & Propellers */}
          {[
            [-1, -1], [1, -1], [-1, 1], [1, 1]
          ].map(([x, z], i) => (
            <group key={i} position={[x * 0.4, 0, z * 0.4]}>
              <mesh position={[-x * 0.2, 0, -z * 0.2]} rotation={[0, Math.atan2(x, z), 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.6]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.1]} />
                <meshStandardMaterial color="#94A3B8" />
              </mesh>
              {/* Spinning Propeller */}
              <Propeller x={x} z={z} />
            </group>
          ))}
          {/* Scanner Cone */}
          <mesh position={[0, -0.4, 0]}>
            <coneGeometry args={[0.6, 1.2, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Loading Ring below the drone */}
      <mesh ref={ringRef} position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Loading Text Label */}
      <Html center position={[0, -2.5, 0]}>
        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#38BDF8]/30 shadow-xl whitespace-nowrap">
          <span className="font-mono text-xs font-bold text-[#38BDF8] tracking-widest uppercase">
            Loading Scan...
          </span>
        </div>
      </Html>
    </group>
  );
};

// Helper component for spinning propeller
const Propeller = ({ x, z }: { x: number, z: number }) => {
  const propRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (propRef.current) {
      // Spin direction depends on arm position for realistic quadcopter behavior
      const dir = (x * z) > 0 ? 1 : -1;
      propRef.current.rotation.y += dir * 0.5;
    }
  });
  return (
    <mesh ref={propRef} position={[0, 0.12, 0]}>
      <boxGeometry args={[0.4, 0.01, 0.04]} />
      <meshStandardMaterial color="#F8FAFC" transparent opacity={0.6} />
    </mesh>
  );
};
