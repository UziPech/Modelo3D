import { useGLTF, Environment, Center, Resize } from '@react-three/drei';
import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';

// Componente que renderiza el modelo 'Flore' con el material metálico PBR.
export default function EstatuaMetalica({ onHotspotClick, HOTSPOT_DATA }) {
  // Carga del modelo GLB (asegúrate que la ruta sea correcta)
  const gltf = useGLTF('/assets/scene.gltf');
  const modelRef = useRef();

  useEffect(() => {
    console.log("GLTF Loaded:", gltf);
  }, [gltf]);

  // 1. Aplicar el material metálico a todas las mallas
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      // MeshStandardMaterial soporta metalness y opacity para el fade
      child.material = new THREE.MeshStandardMaterial({
        color: '#aaaaaa',
        metalness: 1.0,
        roughness: 0.2,
        transparent: true,      // ¡Crucial para el efecto de difuminado!
        opacity: 1.0,           // Empezamos opaco
        side: THREE.DoubleSide, // Asegurar que se vea por ambos lados
      });
    }
  });

  return (
    <group ref={modelRef}>
      {/* Debug Box - Remove later */}
      {/* <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="red" />
      </mesh> */}

      <Center>
        <Resize scale={6.5}>
          <primitive object={gltf.scene} />
        </Resize>
      </Center>

      {/* 2. Hotspots: Añadir las esferas invisibles para detectar clics */}
      {HOTSPOT_DATA && HOTSPOT_DATA.map((hotspot) => (
        <mesh
          key={hotspot.id}
          position={hotspot.cameraTarget}
          onClick={(e) => {
            e.stopPropagation();
            onHotspotClick(hotspot.id);
          }}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial
            color={'#FFFFFF'}
            transparent
            opacity={0.0} // Completamente invisible
          />
        </mesh>
      ))}

      {/* Iluminación de Entorno para reflejos */}
      <Environment preset="studio" background={false} />
    </group>
  );
}

// Para que R3F pre-cargue el modelo
useGLTF.preload('/assets/scene.gltf');
