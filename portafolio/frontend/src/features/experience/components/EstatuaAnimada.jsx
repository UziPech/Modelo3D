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

        // Interacción con el mouse (parallax sutil)
        // Lerp para suavizar el movimiento hacia el puntero
        const targetX = (state.pointer.x * Math.PI) * 0.15;
        const targetY = (state.pointer.y * Math.PI) * 0.1;
        
        // Sumar la rotación base impulsada por el scroll
        // Un poco de rotación sobre Y mientras bajamos
        const scrollRotation = scroll.offset * Math.PI * 1.5;

        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX + scrollRotation, 0.1);

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
