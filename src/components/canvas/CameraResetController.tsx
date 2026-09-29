'use client';

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraResetController: React.FC = () => {
  const { camera, scene, controls } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);
  const animationProgress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const calculateAndSetHome = () => {
      // Calculate bounds of all points/meshes in the scene
      const box = new THREE.Box3();
      let hasContent = false;

      scene.traverse((child) => {
        if (child instanceof THREE.Points || child instanceof THREE.Mesh) {
          // Ignore placeholder elements if a real model is loaded, but if this is just 
          // the terrain/grid, it will bound those.
          child.updateMatrixWorld();
          const childBox = new THREE.Box3().setFromObject(child);
          if (!childBox.isEmpty()) {
            box.union(childBox);
            hasContent = true;
          }
        }
      });

      if (!hasContent || box.isEmpty()) {
        box.setFromObject(scene);
      }

      if (box.isEmpty()) return;

      const center = new THREE.Vector3();
      box.getCenter(center);

      const size = new THREE.Vector3();
      box.getSize(size);
      
      // Calculate a sensible distance based on the model's bounding box and camera FOV
      const maxDim = Math.max(size.x, size.y, size.z, 1);
      const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
      
      // Basic trigonometry to fit the bounding box within the view
      let cameraDistance = Math.abs((maxDim / 2) / Math.tan(fov / 2));
      cameraDistance *= 1.5; // Add some margin so it doesn't clip the edges

      // Set target pos relative to center (slightly elevated isometric view)
      targetLookAt.current.copy(center);
      targetPos.current.set(
        center.x + cameraDistance * 0.6,
        center.y + cameraDistance * 0.5,
        center.z + cameraDistance * 0.8
      );

      startPos.current.copy(camera.position);
      if (controls && (controls as any).target) {
        startLookAt.current.copy((controls as any).target);
      } else {
        startLookAt.current.copy(center); // fallback
      }

      // If the camera is already extremely close to the target, don't animate to avoid micro-jumps
      if (startPos.current.distanceTo(targetPos.current) > 0.1) {
        isAnimating.current = true;
        animationProgress.current = 0;
      }
    };

    const handleReset = () => {
      calculateAndSetHome();
    };

    window.addEventListener('reset-camera', handleReset);
    
    // Auto-trigger reset once shortly after mount to ensure initial view is good
    // Wait a couple of ticks for scene/models to fully mount and parse
    const timer = setTimeout(() => {
        calculateAndSetHome();
    }, 500);

    return () => {
      window.removeEventListener('reset-camera', handleReset);
      clearTimeout(timer);
    };
  }, [camera, scene, controls]);

  useFrame((_, delta) => {
    if (isAnimating.current) {
      // 600ms animation (1.0 / 0.6 ≈ 1.66)
      animationProgress.current += delta * 1.66;
      
      if (animationProgress.current >= 1.0) {
        animationProgress.current = 1.0;
        isAnimating.current = false;
      }
      
      // Ease out cubic
      const t = animationProgress.current;
      const ease = 1 - Math.pow(1 - t, 3);
      
      camera.position.lerpVectors(startPos.current, targetPos.current, ease);
      
      if (controls && (controls as any).target) {
        (controls as any).target.lerpVectors(startLookAt.current, targetLookAt.current, ease);
        (controls as any).update();
      } else {
        camera.lookAt(startLookAt.current.clone().lerp(targetLookAt.current, ease));
      }
    }
  });

  return null;
};
