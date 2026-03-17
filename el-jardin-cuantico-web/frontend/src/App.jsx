import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Sparkles } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import EstatuaAnimada from './models/EstatuaAnimada';
import ScrollContent from './components/ScrollContent';
import Header from './components/Header';
import { ScrollBridge } from './components/SyncMarquee';
import Marquee from './components/Marquee';

/**
 * BackgroundMarquee - Componente DOM puro que vive FUERA del Canvas.
 * Lee el scroll offset de un ref compartido y mueve el marquee en sincronia.
 */
function BackgroundMarquee({ scrollRef }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let rafId;
    const animate = () => {
      if (containerRef.current && scrollRef.current !== undefined) {
        // pages=4, así que el desplazamiento total del HTML es (4-1) * 100vh = 300vh
        const offset = scrollRef.current;
        containerRef.current.style.transform = `translate3d(0, ${-offset * 300}vh, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [scrollRef]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: `${4 * 100}vh`, // Misma altura total que ScrollControls
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Marquee posicionado en la "página 2" (offset top = 100vh) */}
      <div style={{
        position: 'absolute',
        top: '100vh',       // Justo al inicio de la página 2
        bottom: 'auto',
        left: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        height: '100vh',     // Ocupa toda la altura de la página 2
        pointerEvents: 'auto',
      }}>
        <Marquee />
      </div>
    </div>
  );
}

export default function App() {
  const scrollRef = useRef(0);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <Header />

      {/* CAPA 0: Marquee detrás del Canvas */}
      <BackgroundMarquee scrollRef={scrollRef} />

      {/* CAPA 1: Canvas 3D (estatua) + HTML overlay (tarjetas) */}
      <Canvas
        camera={{ position: [-4, 0, 8], fov: 40 }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

          <ScrollControls pages={4} damping={0.1}>
            {/* Bridge: solo lee el scroll y lo escribe en scrollRef */}
            <ScrollBridge scrollRef={scrollRef} />

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
    </div>
  );
}
