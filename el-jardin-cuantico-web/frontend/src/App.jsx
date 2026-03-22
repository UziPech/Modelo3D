import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Sparkles } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import { EstatuaAnimada, MatterPill } from './features/experience';
import { ScrollContent } from './features/content';
import { Header, CurtainBackground, ScrollProxy } from './features/layout';

/**
 * App — Clean container.
 *
 * Layer stack (back → front):
 *   body (#000)             ← deep black reveal color
 *   CurtainBackground       ← white, z-index 0, animated clip-path
 *   Canvas                  ← z-index 1, transparent bg
 *   Header                  ← z-index 10
 *
 * Scroll sync: ScrollProxy inside Canvas writes offset to progressRef.
 * CurtainBackground reads it via GSAP ticker — no manual rAF, zero jank.
 */
export default function App() {
  // Shared scroll progress [0→1], written by ScrollProxy, read by CurtainBackground
  const progressRef = useRef(0);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Header />

      {/* LAYER 0: White curtain that clips away to reveal body black */}
      <CurtainBackground progressRef={progressRef} />

      {/* LAYER 1: 3D scene + HTML overlay */}
      <Canvas
        camera={{ position: [-4, 0, 8], fov: 40 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

          {/* Fixed 3D UI element */}
          <MatterPill />

          <ScrollControls pages={4} damping={0.1}>
            {/* Scroll bridge: writes offset to progressRef for DOM consumption */}
            <ScrollProxy progressRef={progressRef} />

            {/* 3D animated statue */}
            <EstatuaAnimada />

            {/* HTML content overlay */}
            <Scroll html>
              <ScrollContent />
            </Scroll>
          </ScrollControls>

          <EffectComposer>
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
