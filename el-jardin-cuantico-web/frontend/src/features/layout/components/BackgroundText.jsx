import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * BackgroundText — Massive typography that sits BEHIND everything.
 *
 * z-index: -2   (behind FloatingModels at -1, behind CurtainBackground at 0)
 *
 * Reads progressRef (scroll offset 0→1) via a GSAP ticker and drives
 * a CSS translateY so the text scrolls upward from below the viewport.
 *
 * The CurtainBackground (z-index 0) fully covers this layer until its
 * clip-path starts receding, at which point the text is revealed.
 */
export default function BackgroundText({ progressRef }) {
  const textRef = useRef(null);
  const tweenY = useRef({ value: 0 });

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const onTick = () => {
      const raw = progressRef?.current ?? 0;

      // Map scroll 0.15→0.50 to text movement 0→1
      // Before 0.15 the text is fully below; after 0.50 it is at final position
      const target = gsap.utils.clamp(0, 1, (raw - 0.15) / 0.35);

      // Smooth interpolation
      tweenY.current.value += (target - tweenY.current.value) * 0.08;

      // translateY: starts at 60vh (below viewport), ends at 0
      const yOffset = (1 - tweenY.current.value) * 60;
      el.style.transform = `translateY(${yOffset}vh)`;

      // Fade in as it scrolls up
      el.style.opacity = tweenY.current.value;
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [progressRef]);

  return (
    <div ref={textRef} className="background-text">
      <h2 className="background-text__heading">
        INNOVA,<br />
        CONSTRUYE CONMIGO,<br />
        DESCUBRE EL VALOR.
      </h2>
    </div>
  );
}
