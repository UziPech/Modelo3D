import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ExploreButton from './ExploreButton';

export default function HeroCTA({ progressRef }) {
  const ctaRef = useRef(null);
  const tweenY = useRef({ value: 0 });

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    const onTick = () => {
      const raw = progressRef?.current ?? 0;
      
      const target = gsap.utils.clamp(0, 1, (raw - 0.15) / 0.35);
      tweenY.current.value += (target - tweenY.current.value) * 0.08;
      
      const yOffset = (1 - tweenY.current.value) * 60;
      el.style.transform = `translate(-50%, ${yOffset}vh)`;
      el.style.opacity = tweenY.current.value;

      el.style.pointerEvents = tweenY.current.value > 0.1 ? 'auto' : 'none';
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
      <ExploreButton label="EXPLORAR" href="#explorar" />
    </div>
  );
}
