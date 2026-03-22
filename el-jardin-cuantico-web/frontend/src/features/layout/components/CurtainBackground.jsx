import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * CurtainBackground — A fixed white layer that sits BEHIND the Canvas.
 *
 * Architecture:
 *   body (#000)  ←  always black, the "reveal" color
 *   CurtainBackground (z-index: 0)  ←  white, gets clipped away
 *   Canvas (z-index: 1)  ←  transparent bg, 3D scene
 *   Header (z-index: 10) ←  always on top
 *
 * Animation:
 *   clip-path: inset(0 0 0 0)      →  fully white (hero zone)
 *   clip-path: inset(0 0 100% 0)   →  fully clipped = black revealed
 *
 * The transition is driven by a GSAP ticker that reads `progressRef.current`
 * (written by ScrollProxy inside the Canvas). This avoids any manual rAF
 * and stays perfectly synced with the R3F render loop.
 *
 * @param {Object} props
 * @param {React.MutableRefObject<number>} props.progressRef - Scroll offset [0→1]
 */
export default function CurtainBackground({ progressRef }) {
  const curtainRef = useRef(null);
  const tweenProgress = useRef({ value: 0 }); // smoothed progress for GSAP

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    // GSAP ticker runs on every frame — reads the raw scroll offset,
    // smoothly interpolates, and applies the clip-path.
    const onTick = () => {
      const raw = progressRef?.current ?? 0;

      // Map scroll offset to curtain progress:
      // 0–0.25 → curtain fully visible (progress 0)
      // 0.25–0.5 → curtain animates away (progress 0→1)
      // >0.5 → curtain fully gone (progress 1)
      const target = gsap.utils.clamp(0, 1, (raw - 0.25) / 0.25);

      // Smooth interpolation to avoid jitter
      tweenProgress.current.value += (target - tweenProgress.current.value) * 0.1;

      const pct = tweenProgress.current.value * 100;
      curtain.style.clipPath = `inset(0 0 ${pct}% 0)`;
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [progressRef]);

  return (
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
  );
}
