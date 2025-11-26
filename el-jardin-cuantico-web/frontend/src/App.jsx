import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import EstatuaAnimada from './models/EstatuaAnimada';
import ScrollContent from './components/ScrollContent';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <Canvas
        camera={{ position: [-4, 0, 8], fov: 40 }}
        style={{ background: '#ffffff' }} // White background as requested
      >
        <Suspense fallback={null}>
          {/* Atmósfera: Partículas sutiles */}
          <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

          {/* ScrollControls: Define 4 secciones verticales */}
          <ScrollControls pages={4} damping={0.1}>

            {/* El 3D animado */}
            <EstatuaAnimada />

            {/* El Contenido HTML superpuesto */}
            <Scroll html>
              <ScrollContent />
            </Scroll>
          </ScrollControls>

          {/* Post-procesado para efecto "Premium" */}
          <EffectComposer>
            {/* Bloom eliminado por petición del usuario */}
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  );
}
