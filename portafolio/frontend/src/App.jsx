import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Sparkles, Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import { EstatuaAnimada, MatterPill, FloatingModels } from './features/experience';
import { ScrollContent } from './features/content';
import { Header, CurtainBackground, ScrollProxy, BackgroundText } from './features/layout';
import HeroCTA from './features/layout/components/HeroCTA';
import { LevaPanel } from './features/experience/components/DebugPanel';

/**
 * App — Clean container.
 *
 * Layer stack (back → front):
 *   body (#000)             ← deep black reveal color
 *   Canvas (z-index: -1)    ← Floating Models in the background
 *   CurtainBackground       ← white, z-index 0, animated clip-path
 *   Canvas (z-index: 1)     ← Foreground 3D scene (Statue) + HTML overlay
 *   Header                  ← z-index 10
 *
 * Scroll sync: ScrollProxy inside Canvas writes offset to progressRef.
 * CurtainBackground reads it via GSAP ticker — no manual rAF, zero jank.
 */
export default function App() {
  // Shared scroll progress [0→1], written by ScrollProxy, read by CurtainBackground
  const progressRef = useRef(0);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', isolation: 'isolate' }}>
      <LevaPanel />
      <Header />
      <HeroCTA progressRef={progressRef} />

      {/* LAYER -2: Background text (behind all 3D) */}
      <BackgroundText progressRef={progressRef} />

      {/* LAYER -1: Background 3D scene */}
      <Canvas
        camera={{ position: [-4, 0, 8], fov: 40 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment preset="night" background={false} />
          <OrbitControls target={[0, -2.5, 0]} enabled={false} />
          {/* Modelos 3D flotantes colocados en el fondo */}
          <FloatingModels />
          <EffectComposer>
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* LAYER 0: White curtain that clips away to reveal body black */}
      <CurtainBackground progressRef={progressRef} />

      {/* LAYER 1: Foreground 3D scene + HTML overlay */}
      <Canvas
        camera={{ position: [-4, 0, 8], fov: 40 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

          <ScrollControls pages={6} damping={0.1}>
            {/* Fixed 3D UI element that now scrolls away */}
            <MatterPill />

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
