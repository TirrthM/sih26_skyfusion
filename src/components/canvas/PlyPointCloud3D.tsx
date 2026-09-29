'use client';

import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import * as THREE from 'three';

export interface PlyPointCloud3DProps {
  url: string;
  pointSize?: number;
  rotation?: [number, number, number];
  scale?: number;
}

export const PlyPointCloud3D: React.FC<PlyPointCloud3DProps> = ({
  url,
  pointSize = 0.04,
  rotation = [0, 0, 0],
  scale: scaleOverride,
}) => {
  // Load the .ply geometry
  const geometry = useLoader(PLYLoader, url);

  // Center and scale the geometry to fit the scene perfectly
  const centeredGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    
    if (box) {
      // Find the maximum dimension of the bounding box
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      
      // Target size for the model to look "big and proper"
      const targetSize = scaleOverride || 12;
      const scale = targetSize / maxDim;
      
      // Apply scale
      geo.scale(scale, scale, scale);
    }
    
    // Center it exactly at origin
    geo.center();
    // Recompute normals for better lighting if there are any faces (less relevant for pure points, but good practice)
    geo.computeVertexNormals();
    
    return geo;
  }, [geometry]);

  const hasColors = !!centeredGeometry.attributes.color;

  return (
    <points geometry={centeredGeometry} position={[0, 0, 0]} rotation={rotation}>
      <pointsMaterial
        size={pointSize}
        vertexColors={hasColors}
        color={hasColors ? undefined : '#38BDF8'}
        transparent
        opacity={1}
        sizeAttenuation
      />
    </points>
  );
};
