import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * CurtainBackground — A fixed white layer that sits BEHIND the Canvas.
 *
 * Architecture:
 *   body (#000)  ←  always black, the "reveal" color
 *   CurtainBackground (z-index: 0)  ←  white, gets clipped away
 *   Shadow (z-index: 2) ← casts shadow over Canvas elements
 *   Canvas (z-index: 1)  ←  transparent bg, 3D scene
 *   Header (z-index: 10) ←  always on top
 *
 * Animation:
 *   clip-path: inset(0 0 0 0)      →  fully white (hero zone)
 *   clip-path: inset(0 0 100% 0)   →  fully clipped = black revealed
 */
export default function CurtainBackground({ progressRef }) {
  const curtainRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const shadow = shadowRef.current;
    if (!curtain || !shadow) return;

    const onTick = () => {
      const raw = progressRef?.current ?? 0;

      // 0–0.80 → curtain fully visible
      // 0.80–0.95 → curtain animates away
      // >0.95 → curtain fully gone
      const target = gsap.utils.clamp(0, 1, (raw - 0.80) / 0.15);
      const pct = target * 100;
      
      curtain.style.clipPath = `inset(0 0 ${pct}% 0)`;

      // Posicionar la sombra justo en el borde visible de la cortina
      shadow.style.transform = `translateY(${100 - pct}vh)`;
      
      // Controlar la opacidad de la sombra
      let op = 0;
      if (pct > 0 && pct < 100) op = 0.8; // Intensidad de la sombra
      if (pct > 95) op = 0.8 * ((100 - pct) / 5); // Fade-out suave al llegar arriba
      
      shadow.style.opacity = op;
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [progressRef]);

  return (
    <>
      <div
        ref={curtainRef}
        className="curtain-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          zIndex: 0,
          pointerEvents: 'none',
          willChange: 'clip-path',
        }}
      />
      
      {/* Sombra proyectada por la cortina */}
      <div
        ref={shadowRef}
        className="curtain-shadow"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '12vh', // Profundidad de la sombra
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
          zIndex: 0, // Debajo del Canvas (z-index 1) pero por encima del fondo/texto para que no afecte a la estatua
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          opacity: 0,
        }}
      />
    </>
  );
}
