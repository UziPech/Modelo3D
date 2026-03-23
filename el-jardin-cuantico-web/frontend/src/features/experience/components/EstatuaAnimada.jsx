import { useScroll, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import EstatuaMetalica from './EstatuaMetalica'; // Importar el componente base

/**
 * @function EstatuaAnimada
 * @description Componente contenedor que aplica la lógica de scroll, rotación y clics
 * a la Estatua 'Flore'.
 */
export default function EstatuaAnimada() {
    const scroll = useScroll(); // Hook de Drei para obtener la posición del scroll (0 a 1)
    const groupRef = useRef(); // Referencia al grupo que contiene el modelo y los hotspots

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // 1. ROTACIÓN SOBRE EL EJE Y (CORREGIDA)

        // Solo giramos en la primera sección (scroll < 0.25)
        if (scroll.offset < 0.25) {
            const rotationSpeed = 0.5 * delta; // Velocidad de rotación constante

            // Aplicar la rotación directamente al eje Y del grupo de la estatua
            groupRef.current.rotation.y += rotationSpeed;
        }



        // Ajuste de posición: Mover el grupo hacia abajo y a la derecha con el scroll
        // Base Y: -2.5 (definido en modelPosition)
        // Base X: 0 (definido en modelPosition)

        // Queremos que baje (Y disminuye) y se mueva a la derecha (X aumenta)
        groupRef.current.position.y = -2.5 - (scroll.offset * 1.5);
        groupRef.current.position.x = 3.5 + (scroll.offset * 2.9); // Desplazamiento agresivo a la derecha
    });

    // Posición del modelo (Centrado en 0,0,0 para que OrbitControls funcione bien)
    // La cámara está desplazada en App.jsx para que se vea a la derecha.
    const modelPosition = [4.5, -2.5, 0]; // Offset base mayor a la derecha

    return (
        <group ref={groupRef} position={modelPosition}>
            {/* 4. Controles de Cámara */}
            <OrbitControls
                enabled={scroll.offset < 0.2}
                enableDamping
                dampingFactor={0.05}
                enablePan={false} // Deshabilitar Pan para que no interfiera con el scroll
                enableZoom={false} // ¡CRÍTICO! Deshabilitar zoom para liberar la rueda del ratón
                target={[0, -2.5, 0]} // Target en el centro del modelo
            />

            {/* Componente base */}
            <EstatuaMetalica />
        </group>
    );
}
