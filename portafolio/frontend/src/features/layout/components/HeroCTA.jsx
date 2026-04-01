import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ExploreButton from './ExploreButton';

export default function HeroCTA({ progressRef }) {
  const ctaRef = useRef(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    // Deterministic mapper: scroll 0.90→1.00 maps to visibility 0→1
    const scrollToProgress = gsap.utils.pipe(
      gsap.utils.clamp(0.90, 1.00),
      gsap.utils.mapRange(0.90, 1.00, 0, 1)
    );

    const onTick = () => {
      const raw = progressRef?.current ?? 0;
      const progress = scrollToProgress(raw);

      const yOffset = (1 - progress) * 60;
      el.style.transform = `translate(-50%, ${yOffset}vh)`;
      el.style.opacity = progress;
      el.style.visibility = progress === 0 ? 'hidden' : 'visible';

      el.style.pointerEvents = progress > 0.1 ? 'auto' : 'none';
    };

    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, [progressRef]);

  return (
    <div ref={ctaRef} style={{
      position: 'fixed',
      top: '72vh',  /* Zona libre debajo del texto, coincide con recuadro rojo */
      left: '50%',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      willChange: 'transform, opacity',
      opacity: 0,
      transform: 'translate(-50%, 60vh)'
    }}>
      <ExploreButton label="EXPLORAR" href="/explorar" />
    </div>
  );
}
