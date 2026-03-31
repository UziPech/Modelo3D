import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/all';
import './SpriteExperience.css';

gsap.registerPlugin(ScrollTrigger, Observer);

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
 * percibe la transición entre secuencias.
 */
export default function SpriteExperience() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const frameRef = useRef(0);
  const bitmapsRef = useRef([]);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
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

    let stInstance = null;
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

      let ctxGsap;
      let observer;

      const proxy = { progress: 0 };

      // ── Sensitivity adjusted for 135 total frames ──────────────────
      // Original: 0.0015 for 64 frames.
      // To preserve the same physical scroll-per-frame feel:
      const SCROLL_SENSITIVITY = 0.0015 * (SEQ1_FRAMES / TOTAL_FRAMES);
      const KEY_STEP = 0.05 * (SEQ1_FRAMES / TOTAL_FRAMES);
      const KEY_STEP_LARGE = 0.1 * (SEQ1_FRAMES / TOTAL_FRAMES);

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
      };

      const handleKeyDown = (e) => {
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
      };

      ctxGsap = gsap.context(() => {
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

        observer = Observer.create({
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

        window.addEventListener("keydown", handleKeyDown);
      });

      // Hand off cleanup logic
      stInstance = {
        kill: () => {
          observer?.kill();
          window.removeEventListener("keydown", handleKeyDown);
          ctxGsap?.revert();
        }
      };
    };

    preload();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
      stInstance?.kill();
      bitmapsRef.current.forEach((bmp) => bmp?.close?.());
      bitmapsRef.current = [];
      body.style.overflow = saved.bodyOverflow;
      body.style.height = saved.bodyHeight;
      if (root) {
        root.style.height = saved.rootHeight;
        root.style.overflow = saved.rootOverflow;
      }
    };
  }, []);

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

      {ready && (
        <div className="sprite-hint">
          <span>SCROLL PARA EXPLORAR</span>
          <div className="sprite-hint__line" />
        </div>
      )}
    </section>
  );
}
