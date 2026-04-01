import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import './SpriteExperience.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, Observer);

// ── Sequence Configuration ─────────────────────────────────────────────
const SEQ1_FRAMES = 64;
const SEQ2_FRAMES = 71;
const TOTAL_FRAMES = SEQ1_FRAMES + SEQ2_FRAMES; // 135

/**
 * Returns the public path for a given global frame index (0-based).
 * Index 0–63  → /framees/ezgif-frame-001…064.png
 * Index 64–134 → /framees/framees2/ezgif-frame-001…071.png
 */
const getFramePath = (globalIndex) => {
  if (globalIndex < SEQ1_FRAMES) {
    return `/framees/ezgif-frame-${String(globalIndex + 1).padStart(3, '0')}.png`;
  }
  const seq2Index = globalIndex - SEQ1_FRAMES;
  return `/framees/framees2/ezgif-frame-${String(seq2Index + 1).padStart(3, '0')}.png`;
};

/**
 * SpriteExperience — Seamless Dual-Sequence Edition
 *
 * Carga 64 fotogramas de la Secuencia 1 para mostrar la experiencia de inmediato,
 * luego carga 71 fotogramas de la Secuencia 2 silenciosamente en segundo plano.
 * El scroll mapea de forma continua los 135 frames totales — el usuario nunca
 * percibe la transición entre secuencias gracias al efecto de resplandor blanco.
 */
export default function SpriteExperience() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const scrubUIRef = useRef(null);
  const introUIRef = useRef(null);
  const frameRef = useRef(0);
  const bitmapsRef = useRef([]);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Parallax refs
  const parallaxContainerRef = useRef(null);
  const parallaxElementsRef = useRef([]);

  useGSAP((context, contextSafe) => {
    // ── Override body/root to allow native scroll ──────────────────
    const body = document.body;
    const root = document.getElementById('root');
    const saved = {
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
      rootOverflow: root?.style.overflow,
      rootHeight: root?.style.height,
    };
    body.style.overflow = 'auto';
    body.style.height = 'auto';
    if (root) {
      root.style.height = 'auto';
      root.style.overflow = 'visible';
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    let rafId = null;

    // ── Resize canvas to Retina resolution ────────────────────────────
    const resize = () => {
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    // ── Generic range loader — loads frames [start, end) into bitmapsRef ──
    const loadRange = async (start, end, onProgress) => {
      const promises = [];
      let loaded = 0;
      const total = end - start;

      for (let i = start; i < end; i++) {
        const url = getFramePath(i);
        const p = fetch(url)
          .then((r) => r.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bmp) => {
            bitmapsRef.current[i] = bmp;
            loaded++;
            if (onProgress) onProgress(loaded, total);
          });
        promises.push(p);
      }

      await Promise.all(promises);
    };

    // ── Preload: Phase 1 (visible) → Phase 2 (background) ──────────────
    const preload = async () => {
      // Phase 1: Load Sequence 1 — blocks the loader screen
      await loadRange(0, SEQ1_FRAMES, (loaded, total) => {
        setLoadProgress(Math.round((loaded / total) * 100));
      });

      // Paint first frame
      resize();

      // Phase 2: Dismiss loader → start experience
      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.1,
          onComplete: () => {
            setReady(true);
          }
        });
      } else {
        setReady(true);
      }

      // Phase 3: Load Sequence 2 silently in background
      loadRange(SEQ1_FRAMES, TOTAL_FRAMES).catch(console.error);

      const proxy = { progress: 0 };

      // ── Sensitivity adjusted for 135 total frames ──────────────────
      // Lowered SCROLL_SENSITIVITY to make the scrolling last longer
      const SCROLL_SENSITIVITY = 0.0006 * (SEQ1_FRAMES / TOTAL_FRAMES);
      const KEY_STEP = 0.02 * (SEQ1_FRAMES / TOTAL_FRAMES);
      const KEY_STEP_LARGE = 0.05 * (SEQ1_FRAMES / TOTAL_FRAMES);

      const updateCanvas = () => {
        const c = canvasRef.current;
        const cx = c?.getContext('2d', { alpha: false });
        if (!c || !cx) return;

        cx.clearRect(0, 0, c.width, c.height);

        const scaledProgress = proxy.progress * (TOTAL_FRAMES - 0.01);
        let frameIndex = Math.floor(scaledProgress);
        frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));

        // ── Graceful fallback: find closest loaded bitmap ──────────
        let targetIndex = frameIndex;
        while (targetIndex >= 0 && !bitmapsRef.current[targetIndex]) {
          targetIndex--;
        }

        const bitmap = bitmapsRef.current[targetIndex >= 0 ? targetIndex : 0];
        if (bitmap) {
          const cw = window.innerWidth;
          const ch = window.innerHeight;

          const iw = bitmap.width;
          const ih = bitmap.height;
          const scale = Math.max(cw / iw, ch / ih);
          const sw = iw * scale;
          const sh = ih * scale;
          const ox = (cw - sw) / 2;
          const oy = (ch - sh) / 2;

          cx.drawImage(bitmap, ox, oy, sw, sh);
        }

        // ── Transition Effect (White Flash) ─────────────────────────
        const transitionPoint = SEQ1_FRAMES - 0.5; // Cut happens effectively near here
        const effectRadius = 9; // ~9 frames before and after the cut

        const distance = Math.abs(scaledProgress - transitionPoint);

        if (distance <= effectRadius) {
          // alpha goes from 0 (at distance = radius) up to 1 (at distance = 0)
          const alpha = 1 - (distance / effectRadius);
          const easedAlpha = alpha * alpha; // Quadratic ease for a punchier "flash" look

          cx.fillStyle = `rgba(255, 255, 255, ${easedAlpha})`;
          cx.fillRect(0, 0, c.width, c.height);
        }

        // ── Canvas Initial Blur (Abstract Clouds) ─────────────────
        // We blur heavily at progress 0, and lower to 0 by progress 0.15
        const blurProgress = gsap.utils.clamp(0, 1, proxy.progress / 0.15);
        // Start at 40px blur, go to 0px
        const canvasBlur = 40 * (1 - Math.pow(blurProgress, 0.5));
        c.style.filter = `blur(${canvasBlur}px) contrast(${1 + (1 - blurProgress) * 0.2})`;

        // ── Editorial Text Progress scrub ─────────────────────────────
        if (scrubUIRef.current) {
          // The text should disappear fully by around 15% of the total progress
          const uiProgress = gsap.utils.clamp(0, 1, proxy.progress / 0.15);
          const opacity = 1 - Math.pow(uiProgress, 1.5); // Ease-out fading mapped natively
          const blur = uiProgress * 25; // up to 25px blur on exit
          const y = -(uiProgress * 250); // moves up faster
          const scale = 1 + (uiProgress * 0.15); // scales up slightly

          scrubUIRef.current.style.opacity = opacity.toFixed(3);
          scrubUIRef.current.style.filter = `blur(${blur.toFixed(2)}px)`;
          scrubUIRef.current.style.transform = `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        }
      };

      // Wrapped with contextSafe to ensure cleanups happen properly
      const handleKeyDown = contextSafe((e) => {
        let delta = 0;
        if (e.key === "ArrowDown" || e.key === "PageDown") delta = KEY_STEP;
        if (e.key === "ArrowUp" || e.key === "PageUp") delta = -KEY_STEP;
        if (e.key === " ") delta = e.shiftKey ? -KEY_STEP_LARGE : KEY_STEP_LARGE;

        if (delta !== 0) {
          let p = proxy.progress + delta;
          p = gsap.utils.clamp(0, 1, p);
          gsap.to(proxy, {
            progress: p,
            duration: 0.4,
            ease: "power2.out",
            onUpdate: () => {
              updateCanvas();
              if (proxy.updateTimeline) proxy.updateTimeline();
            }
          });
        }
      });

      const tl = gsap.timeline({ paused: true });
      // Heavy parallax + gentle zoom for extreme depth across all 135 frames
      tl.fromTo(canvasRef.current, {
        scale: 1.15, yPercent: -5, transformOrigin: "center center"
      }, {
        scale: 1.0, yPercent: 0, ease: "none", duration: 1
      });

      proxy.updateTimeline = () => tl.progress(proxy.progress);

      updateCanvas();
      proxy.updateTimeline();

      Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onChange: (self) => {
          let p = proxy.progress + (self.deltaY * SCROLL_SENSITIVITY);
          p = gsap.utils.clamp(0, 1, p);
          if (p !== proxy.progress) {
            proxy.progress = p;
            updateCanvas();
            proxy.updateTimeline();
          }
        },
        tolerance: 10,
        preventDefault: true
      });

      // ── Mouse Parallax effect on the intro text ─────────────────────
      const handleMouseMove = contextSafe((e) => {
        if (!ready || proxy.progress > 0.1) return; // only interact at the very top
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

        parallaxElementsRef.current.forEach((el, index) => {
          if (!el) return;
          const depth = (index + 1) * 15; // different depth per element
          gsap.to(el, {
            x: x * depth,
            y: y * depth,
            rotationX: -y * (depth * 0.2), // slight 3D tilt
            rotationY: x * (depth * 0.2),
            duration: 1.5,
            ease: "power2.out",
            overwrite: "auto"
          });
        });
      });

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousemove", handleMouseMove);

      // Save a reference to perform local DOM cleanup on unmount
      context.add("cleanupDOM", () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mousemove", handleMouseMove);
      });
    };

    preload();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);

      // We manually kill bitmaps and restore overflow here when useGSAP unmounts
      bitmapsRef.current.forEach((bmp) => bmp?.close?.());
      bitmapsRef.current = [];
      body.style.overflow = saved.bodyOverflow;
      body.style.height = saved.bodyHeight;
      if (root) {
        root.style.height = saved.rootHeight;
        root.style.overflow = saved.rootOverflow;
      }
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="sprite-section">
      <canvas ref={canvasRef} className="sprite-canvas" />

      {/* Premium White Loading overlay — Animates away via GSAP */}
      {!ready && (
        <div ref={loaderRef} className="sprite-loader">
          <div className="sprite-loader__counter">{loadProgress}</div>
          <span className="sprite-loader__label">INDEXANDO DATOS...</span>
        </div>
      )}

      <div className="cinematic-curtain" ref={(el) => {
        // Simple entrance effect for the curtain when ready
        if (ready && el && !el.dataset.animated) {
          el.dataset.animated = "true";
          gsap.to(el, { opacity: 0, duration: 2, ease: "power2.inOut", pointerEvents: "none" });
        }
      }} />

      <div ref={scrubUIRef} className="hero-editorial-overlay" style={{ pointerEvents: 'none', willChange: 'opacity, filter, transform', opacity: ready ? 1 : 0, transition: 'opacity 0.5s ease-out', perspective: '1000px' }}>
        <div ref={(el) => {
          if (ready && el && !el.dataset.animated) {
            el.dataset.animated = "true";

            // Complex Entrance GSAP Timeline
            const tl = gsap.timeline();
            tl.fromTo('.editorial-line-accent',
              { scaleY: 0, transformOrigin: 'bottom' },
              { scaleY: 1, duration: 1.5, ease: 'expo.inOut', delay: 0.2 }
            );

            tl.fromTo('.title-word',
              { y: '120%', rotationZ: 5, filter: 'blur(5px)' },
              { y: '0%', rotationZ: 0, filter: 'blur(0px)', duration: 1.8, ease: 'power4.out', stagger: 0.15 },
              "-=0.8"
            );

            tl.fromTo('.editorial-subtitle',
              { opacity: 0, y: 30, letterSpacing: '0em', filter: 'blur(10px)' },
              { opacity: 1, y: 0, letterSpacing: '0.4em', filter: 'blur(0px)', duration: 2, ease: 'expo.out' },
              "-=1.4"
            );

            // Continuous subtle floating animation
            gsap.to('.editorial-title', {
              y: '-=15',
              duration: 4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: 2
            });
          }
        }} style={{ willChange: 'opacity, transform, filter', transformStyle: 'preserve-3d' }}>
          <div ref={el => parallaxElementsRef.current[0] = el} className="editorial-line-accent"></div>

          <h1 ref={el => parallaxElementsRef.current[1] = el} className="editorial-title">
            <span className="title-line"><span className="title-word">FULL </span></span>
            <span className="title-line"><span className="title-word">STACK</span></span>
            <br />
            <span className="title-line"><span className="title-word title-word-highlight">DEVELOPER</span></span>
          </h1>

          <p ref={el => parallaxElementsRef.current[2] = el} className="editorial-subtitle">BY UZIEL ISAAC — ARCHITECTURE &amp; CODE</p>
        </div>
      </div>

      {ready && (
        <div className="sprite-hint">
          <span>SCROLL PARA EXPLORAR</span>
          <div className="sprite-hint__line" />
        </div>
      )}
    </section>
  );
}
