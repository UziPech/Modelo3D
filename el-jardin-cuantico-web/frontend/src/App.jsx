import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Sparkles } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import EstatuaAnimada from './models/EstatuaAnimada';
import ScrollContent from './components/ScrollContent';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <Canvas
        camera={{ position: [-4, 0, 8], fov: 40 }}
        style={{ background: '#ffffff' }}
      >
        <Suspense fallback={null}>
          <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

          <ScrollControls pages={4} damping={0.1}>
            {/* El 3D animado */}
            <EstatuaAnimada />

            {/* El Contenido HTML superpuesto */}
            <Scroll html>
              <ScrollContent />
            </Scroll>
          </ScrollControls>

          <EffectComposer>
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </>
  );
}
