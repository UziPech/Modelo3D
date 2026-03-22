import { useGLTF, Environment, Center, Resize, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useRef, useEffect, useMemo } from 'react';

/**
 * EstatuaMetalica — PBR metallic statue with scroll-reactive lighting.
 *
 * Lighting zones:
 *   offset 0–0.25  →  white zone: standard reflections (envMapIntensity ~1.0)
 *   offset > 0.25  →  black zone: dramatic look (envMapIntensity lerps down to ~0.3)
 *
 * Uses useScroll() + useFrame() for interpolation — zero re-renders,
 * all mutations happen on the GPU-bound material uniforms.
 */
export default function EstatuaMetalica() {
  const gltf = useGLTF('/assets/scene-transformed.glb');
  const modelRef = useRef();
  const scroll = useScroll();

  // Store material refs to mutate in useFrame without triggering React renders
  const materialsRef = useRef([]);

  // Create the shared material once — reused across all meshes
  const sharedMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#aaaaaa',
        metalness: 1.0,
        roughness: 0.4,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        envMapIntensity: 1.0,
      }),
    []
  );

  useEffect(() => {
    if (!gltf.scene) return;

    const mats = [];
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = sharedMaterial;
        mats.push(sharedMaterial);
      }
    });
    materialsRef.current = mats;
  }, [gltf, sharedMaterial]);

  // Scroll-reactive lighting — runs every frame, no React state
  useFrame(() => {
    const offset = scroll.offset;

    // Target envMapIntensity: 1.0 in white zone, 0.3 in black zone
    const target = offset > 0.25 ? 0.3 : 1.0;

    // Smooth interpolation (lerp factor ~0.05 for buttery transition)
    materialsRef.current.forEach((mat) => {
      mat.envMapIntensity = THREE.MathUtils.lerp(
        mat.envMapIntensity,
        target,
        0.05
      );
    });
  });

  return (
    <group ref={modelRef}>
      <Center>
        <Resize scale={6.5}>
          <primitive object={gltf.scene} />
        </Resize>
      </Center>

      {/* Environment reflections */}
      <Environment preset="night" background={false} />
    </group>
  );
}

useGLTF.preload('/assets/scene-transformed.glb');
