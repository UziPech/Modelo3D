import { useScroll, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import EstatuaMetalica from './EstatuaMetalica';

/**
 * @function EstatuaAnimada
 * @description Componente contenedor que aplica la lógica de scroll, rotación y clics
 * a la Estatua 'Flore'. Posición y escala hardcodeadas tras ajustes visuales.
 */
export default function EstatuaAnimada() {
    const scroll = useScroll();
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Auto rotación suave en la primera sección
        if (scroll.offset < 0.25) {
            groupRef.current.rotation.y += 0.5 * delta;
        }

        // Animación de traslación impulsada por el scroll
        groupRef.current.position.y = -2.5 - (scroll.offset * 1.5);
        groupRef.current.position.x = 4.5 + (scroll.offset * 2.9);
        groupRef.current.position.z = 0;
    });

    return (
        <group ref={groupRef} position={[4.5, -2.5, 0]}>
            <OrbitControls
                enabled={scroll.offset < 0.2}
                enableDamping
                dampingFactor={0.05}
                enablePan={false}
                enableZoom={false}
                target={[0, -2.5, 0]}
            />
            <EstatuaMetalica />
        </group>
    );
}
