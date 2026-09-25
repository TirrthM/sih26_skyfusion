'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface FlightPath3DProps {
  reducedMotion?: boolean;
}

export const FlightPath3D: React.FC<FlightPath3DProps> = ({ reducedMotion = false }) => {
  const { curvePoints, waypoints } = useMemo(() => {
    const rawWaypoints = [
      new THREE.Vector3(-6, 3.2, 4),
      new THREE.Vector3(-5, 3.5, 3),
      new THREE.Vector3(-2, 4.2, 4),
      new THREE.Vector3(2, 4.6, 3.5),
      new THREE.Vector3(5, 4.0, 1),
      new THREE.Vector3(4, 3.8, -3),
      new THREE.Vector3(0, 4.5, -5),
      new THREE.Vector3(-4, 3.8, -3),
    ];

    const curve = new THREE.CatmullRomCurve3(rawWaypoints, true, 'centripetal', 0.5);
    const points = curve.getPoints(120);

    return { curvePoints: points, waypoints: rawWaypoints };
  }, []);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [curvePoints]);

  return (
    <group>
      {/* Flight Path Curve */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineDashedMaterial({
        color: '#6366F1',
        dashSize: 0.4,
        gapSize: 0.15,
        linewidth: 2,
        transparent: true,
        opacity: 0.75,
      }))} onUpdate={(self: THREE.Line) => self.computeLineDistances()} />

      {/* Waypoint Markers */}
      {waypoints.map((wp, idx) => (
        <group key={idx} position={wp}>
          {/* Beacon point */}
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#38BDF8' : '#F59E0B'} />
          </mesh>

          {/* Altitude plumb line down to grid */}
          <primitive
            object={
              new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(0, -wp.y - 2, 0),
                ]),
                new THREE.LineBasicMaterial({
                  color: '#334155',
                  transparent: true,
                  opacity: 0.4,
                })
              )
            }
          />
        </group>
      ))}
    </group>
  );
};
