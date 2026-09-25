'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface CameraFrustumProps {
  poses?: { position: [number, number, number]; rotation: [number, number, number] }[];
}

export const CameraFrustum3D: React.FC<CameraFrustumProps> = ({ poses }) => {
  const defaultPoses = useMemo(() => {
    return [
      { position: [-5, 3.5, 3] as [number, number, number], rotation: [-0.4, -0.6, 0] as [number, number, number] },
      { position: [-2, 4.2, 4] as [number, number, number], rotation: [-0.5, -0.2, 0] as [number, number, number] },
      { position: [2, 4.6, 3.5] as [number, number, number], rotation: [-0.6, 0.3, 0] as [number, number, number] },
      { position: [5, 4.0, 1] as [number, number, number], rotation: [-0.5, 0.8, 0] as [number, number, number] },
      { position: [4, 3.8, -3] as [number, number, number], rotation: [-0.4, 1.4, 0] as [number, number, number] },
      { position: [0, 4.5, -5] as [number, number, number], rotation: [-0.6, 2.2, 0] as [number, number, number] },
    ];
  }, []);

  const activePoses = poses || defaultPoses;

  // Frustum pyramid geometry
  const frustumLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const apex = new THREE.Vector3(0, 0, 0);
    const scale = 0.5;
    const w = 0.4 * scale;
    const h = 0.3 * scale;
    const d = 0.7 * scale;

    const c1 = new THREE.Vector3(-w, -h, -d);
    const c2 = new THREE.Vector3(w, -h, -d);
    const c3 = new THREE.Vector3(w, h, -d);
    const c4 = new THREE.Vector3(-w, h, -d);

    // Pyramid edges from apex to corners
    points.push(apex, c1);
    points.push(apex, c2);
    points.push(apex, c3);
    points.push(apex, c4);

    // Base rectangle
    points.push(c1, c2);
    points.push(c2, c3);
    points.push(c3, c4);
    points.push(c4, c1);

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, []);

  return (
    <group>
      {activePoses.map((p, idx) => (
        <group key={idx} position={p.position} rotation={p.rotation}>
          <lineSegments geometry={frustumLines}>
            <lineBasicMaterial
              color={idx === 2 ? '#F59E0B' : '#38BDF8'}
              transparent
              opacity={0.85}
              linewidth={1.5}
            />
          </lineSegments>

          {/* Camera origin marker */}
          <mesh>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color={idx === 2 ? '#F59E0B' : '#38BDF8'} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
