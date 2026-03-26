import React, { useRef } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * FloatingModels
 * 
 * Renderiza los modelos flotantes laterales con valores hardcodeados finales.
 * Float intensity reducida un 20% respecto al original.
 * La pieza de ajedrez tiene una auto-rotación sutil en Y.
 */
export default function FloatingModels() {
    const pilar = useGLTF('/assets/pilar_corintio_optimizado.glb');
    const ajedrez = useGLTF('/assets/pieza_de_ajedrez_dama.glb');

    const ajedrezRef = useRef();

    // Rotación sutil continua en Y para la pieza de ajedrez
    useFrame((_, delta) => {
        if (ajedrezRef.current) {
            ajedrezRef.current.rotation.y += 0.3 * delta;
        }
    });

    return (
        <group>
            {/* Pilar Corintio */}
            <group
                position={[-2.4, -3.1, -3.0]}
                rotation={[
                    THREE.MathUtils.degToRad(-52),
                    THREE.MathUtils.degToRad(17),
                    THREE.MathUtils.degToRad(14)
                ]}
                scale={1.4}
            >
                {/* floatIntensity: 0.8 * 0.8 = 0.64 (-20%) */}
                <Float speed={5.0} rotationIntensity={0.32} floatIntensity={0.64}>
                    <primitive object={pilar.scene.clone()} />
                </Float>
            </group>

            {/* Pieza de Ajedrez (Dama) */}
            <group
                ref={ajedrezRef}
                position={[1.5, 0.6, -3.3]}
                rotation={[
                    THREE.MathUtils.degToRad(40),
                    THREE.MathUtils.degToRad(77),
                    THREE.MathUtils.degToRad(21)
                ]}
                scale={20.0}
            >
                {/* floatIntensity: 1.2 * 0.8 = 0.96 (-20%) */}
                <Float speed={1.2} rotationIntensity={0.48} floatIntensity={0.96}>
                    <primitive object={ajedrez.scene.clone()} />
                </Float>
            </group>
        </group>
    );
}

useGLTF.preload('/assets/pilar_corintio_optimizado.glb');
useGLTF.preload('/assets/pieza_de_ajedrez_dama.glb');
