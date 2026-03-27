import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import './SpriteExperience.css';

gsap.registerPlugin(ScrollTrigger, Observer);

const TOTAL_FRAMES = 64;
const FRAME_PATH = (n) =>
  `/framees/ezgif-frame-${String(n).padStart(3, '0')}.png`;

/**
 * SpriteExperience — Awwwards 64-Frame Edition
 *
 * Utiliza 64 fotogramas renderizados previamente a memoria vía `createImageBitmap`
 * para un desplazamiento ultra-fluido, cero-lag y perfectamente responsivo.
 * Se incorpora una cortina de carga premium blanca y un Observer nativo para
 * scrub directo 1:1 desde trackpads y ratones.
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

    // ── Preload 64 frames to VRAM for 0ms scrub ─────────────────────
    const preload = async () => {
      const promises = [];
      let loadedCount = 0;

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const url = FRAME_PATH(i + 1);
        const p = fetch(url)
          .then((r) => r.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bmp) => {
            bitmapsRef.current[i] = bmp;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          });
        promises.push(p);
      }

      await Promise.all(promises);

      // Paint initially
      resize();

      if (loaderRef.current) {
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.1, // Smooth elegant delay
          onComplete: () => {
             setReady(true);
          }
        });
      } else {
        setReady(true);
      }

      let ctxGsap;
      let observer;

      const proxy = { progress: 0 };
      
      const updateCanvas = () => {
        const c = canvasRef.current;
        const cx = c?.getContext('2d', { alpha: false });
        if (!c || !cx) return;

        cx.clearRect(0, 0, c.width, c.height);
        
        const scaledProgress = proxy.progress * (TOTAL_FRAMES - 0.01);
        let frameIndex = Math.floor(scaledProgress);
        frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));

        const bitmap = bitmapsRef.current[frameIndex];
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
        if (e.key === "ArrowDown" || e.key === "PageDown") delta = 0.05;
        if (e.key === "ArrowUp" || e.key === "PageUp") delta = -0.05;
        if (e.key === " ") delta = e.shiftKey ? -0.1 : 0.1;
        
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
        // Heavy parallax + gentle zoom for extreme depth between all 64 frames
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
            // Amplificamos la sensibilidad (0.0015) para un scroll natural sin fricción
            let p = proxy.progress + (self.deltaY * 0.0015);
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
