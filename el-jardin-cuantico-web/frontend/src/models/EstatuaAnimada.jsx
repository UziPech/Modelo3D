import { useScroll, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import EstatuaMetalica from './EstatuaMetalica'; // Importar el componente base
import { useHotspotState } from '../logic/useHotspotState'; // Importar la lógica

/**
 * @function EstatuaAnimada
 * @description Componente contenedor que aplica la lógica de scroll, rotación y clics
 * a la Estatua 'Flore'.
 */
export default function EstatuaAnimada() {
    const { toggleHotspot, HOTSPOT_DATA, activeHotspotData } = useHotspotState(); // Lógica de negocio
    const scroll = useScroll(); // Hook de Drei para obtener la posición del scroll (0 a 1)
    const groupRef = useRef(); // Referencia al grupo que contiene el modelo y los hotspots

    // Definimos isHotspotActive aquí para usarlo tanto en useFrame como en el render
    const isHotspotActive = activeHotspotData !== null;

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // 1. ROTACIÓN SOBRE EL EJE Y (CORREGIDA)

        // Solo giramos si NO hay un hotspot activo (para que el zoom funcione sin interferencias)
        // Y solo en la primera sección (scroll < 0.25)
        if (!isHotspotActive && scroll.offset < 0.25) {
            const rotationSpeed = 0.5 * delta; // Velocidad de rotación constante

            // Aplicar la rotación directamente al eje Y del grupo de la estatua
            groupRef.current.rotation.y += rotationSpeed;
        }



        // Ajuste de posición: Mover el grupo hacia abajo y a la derecha con el scroll
        // Base Y: -2.5 (definido en modelPosition)
        // Base X: 0 (definido en modelPosition)

        // Queremos que baje (Y disminuye) y se mueva a la derecha (X aumenta)
        groupRef.current.position.y = -2.5 - (scroll.offset * 1.5);
        groupRef.current.position.x = 0 + (scroll.offset * 2.0);
    });

    // Posición del modelo (Centrado en 0,0,0 para que OrbitControls funcione bien)
    // La cámara está desplazada en App.jsx para que se vea a la derecha.
    const modelPosition = [0, -2.5, 0];

    return (
        <group ref={groupRef} position={modelPosition}>
            {/* 4. Controles de Cámara */}
            <OrbitControls
                enabled={!isHotspotActive && scroll.offset < 0.2}
                enableDamping
                dampingFactor={0.05}
                enablePan={true} // ¡Habilitar Panning!
                enableZoom={true}
                target={[0, -2.5, 0]} // Target en el centro del modelo
            />

            {/* Pasar la lógica de clic y los datos al componente base */}
            <EstatuaMetalica onHotspotClick={toggleHotspot} HOTSPOT_DATA={HOTSPOT_DATA} />
        </group>
    );
}
