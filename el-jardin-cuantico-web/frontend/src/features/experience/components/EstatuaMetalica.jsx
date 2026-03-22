import { useGLTF, Environment, Center, Resize } from '@react-three/drei';
import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';

// Componente que renderiza el modelo 'Flore' con el material metálico PBR.
export default function EstatuaMetalica() {
  // Carga del modelo GLB (asegúrate que la ruta sea correcta)
  const gltf = useGLTF('/assets/scene-transformed.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#aaaaaa',
            metalness: 1.0,
            roughness: 0.2,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide,
          });
        }
      });
    }
  }, [gltf]);

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

      {/* Iluminación de Entorno para reflejos */}
      <Environment preset="studio" background={false} />
    </group>
  );
}

// Para que R3F pre-cargue el modelo
useGLTF.preload('/assets/scene-transformed.glb');
