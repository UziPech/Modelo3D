import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import './ExploreButton.css';

const ExploreButton = ({ label = "EXPLORAR", href = "#", ease = "power3.easeOut" }) => {
  const pillRef = useRef(null);
  const circleRef = useRef(null);
  const tlRef = useRef(null);
  const activeTweenRef = useRef(null);

  useEffect(() => {
    const layout = () => {
      const circle = circleRef.current;
      const pill = pillRef.current;
      if (!circle || !pill) return;

      const rect = pill.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        left: "50%",
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const labelEl = pill.querySelector('.pill-label');
      const whiteEl = pill.querySelector('.pill-label-hover');

      if (labelEl) gsap.set(labelEl, { y: 0 });
      if (whiteEl) gsap.set(whiteEl, { y: Math.ceil(h + 10), opacity: 0 });

      tlRef.current?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.5, ease, overwrite: 'auto' }, 0);

      if (labelEl) {
        tl.to(labelEl, { y: -(h + 8), duration: 0.5, ease, overwrite: 'auto' }, 0);
      }

      if (whiteEl) {
        tl.to(whiteEl, { y: 0, opacity: 1, duration: 0.5, ease, overwrite: 'auto' }, 0);
      }

      tlRef.current = tl;
    };

    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener('resize', onResize);
  }, [ease]);

  const handleEnter = () => {
    const tl = tlRef.current;
    if (!tl) return;
    activeTweenRef.current?.kill();
    activeTweenRef.current = tl.tweenTo(tl.duration(), {
      duration: 0.4,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = () => {
    const tl = tlRef.current;
    if (!tl) return;
    activeTweenRef.current?.kill();
    activeTweenRef.current = tl.tweenTo(0, {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  return (
    <div className="explore-btn-container">
      <Link 
        to={href} 
        className="explore-btn" 
        ref={pillRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <span className="hover-circle" ref={circleRef} aria-hidden="true" />
        <span className="label-stack">
          <span className="pill-label">{label}</span>
          <span className="pill-label-hover" aria-hidden="true">{label}</span>
        </span>
      </Link>
    </div>
  );
};

export default ExploreButton;
