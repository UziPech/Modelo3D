import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { useScroll } from '@react-three/drei';
import gsap from 'gsap';

export default function ScrollContent() {
    const scroll = useScroll();
    const heroRef = useRef();
    const badgeRef = useRef();
    const uzielRef = useRef();
    const pechRef = useRef();
    const subtitleRef = useRef();

    // Cinematic entrance animation on mount
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            // 1. Badge slides down + fade in
            tl.fromTo(badgeRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 }
            );

            // 2. UZIEL + ISAAC — each word clips in from right
            const nameWords = uzielRef.current.querySelectorAll('.hero-word');
            tl.to(nameWords, {
                clipPath: 'inset(-10% -10% -10% 0)',
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
            }, '-=0.2');

            // 3. PECH BALAM — clips in
            const pechWords = pechRef.current.querySelectorAll('.hero-word');
            tl.to(pechWords, {
                clipPath: 'inset(-10% -10% -10% 0)',
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
            }, '-=0.5');

            // 4. Subtitle fades up
            tl.fromTo(subtitleRef.current,
                { y: 25, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9 },
                '-=0.3'
            );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="content-wrapper" style={{ padding: '0 10vw' }}>

            {/* SECCIÓN 1: Hero Section (Título Principal) */}
            <div className="scroll-section hero-section" style={{ position: 'relative', overflow: 'visible' }}>
                <div ref={heroRef} className="hero-text-wrapper" style={{ marginLeft: '-2vw', position: 'relative' }}>

                    {/* ── GHOST TEXT LAYER ──────────────────────────────────────────────
                        Texto fantasma: mismas palabras, tipografía bold alternativa,
                        color gris claro y escala mayor. Z-index negativo = queda detrás.
                    ─────────────────────────────────────────────────────────────────── */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '-1vw',
                            transform: 'translateY(-50%)',
                            zIndex: -1,
                            pointerEvents: 'none',
                            userSelect: 'none',
                            lineHeight: 0.85,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.1em',
                            maskImage: 'linear-gradient(to right, black 30%, transparent 58%)',
                            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 58%)',
                        }}
                    >
                        {/* línea 1 ghost: UZIEL ISAAC */}
                        <span style={{
                            fontFamily: 'var(--font-pech)',
                            fontSize: '9.2vw',
                            fontWeight: '900',
                            color: 'rgba(6, 5, 5, 0.07)',
                            letterSpacing: '-0.03em',
                            whiteSpace: 'nowrap',
                            display: 'block',
                        }}>
                            UZIEL ISAAC
                        </span>
                        {/* línea 2 ghost: PECH BALAM */}
                        <span style={{
                            fontFamily: 'var(--font-pech)',
                            fontSize: '9.2vw',
                            fontWeight: '900',
                            color: 'rgba(5, 5, 5, 0.07)',
                            letterSpacing: '-0.03em',
                            whiteSpace: 'nowrap',
                            display: 'block',
                        }}>
                            PECH BALAM
                        </span>
                    </div>

                    {/* ── TEXTO PRINCIPAL ─────────────────────────────────────────────── */}
                    <h1 className="hero-title" style={{ margin: 0 }}>
                        <span
                            ref={badgeRef}
                            className="shimmer-badge"
                            style={{
                                background: '#000',
                                color: '#fff',
                                padding: '4px 12px',
                                fontSize: '0.25em',
                                borderRadius: '4px',
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                marginBottom: '20px',
                                letterSpacing: '2px',
                                opacity: 0,
                            }}
                        >DEVELOPER</span>
                        <div ref={uzielRef} style={{ display: 'flex', alignItems: 'center', fontSize: '4.5vw', fontWeight: '900', lineHeight: '0.9', transformOrigin: 'left' }}>
                            <span
                                className="hero-word"
                                style={{
                                    fontFamily: 'var(--font-uziel)',
                                    fontSize: '1.4em',
                                    color: '#1a1a1a',
                                    letterSpacing: '-0.02em',
                                    display: 'inline-block',
                                }}
                            >
                                UZIEL
                            </span>
                            <span
                                className="hero-word"
                                style={{ fontFamily: 'var(--font-isaac)', fontSize: '1.4em', fontWeight: 'normal', color: '#1a1a1a', marginLeft: '2.5vw' }}
                            >ISAAC</span>
                        </div>
                        <div ref={pechRef} style={{ fontFamily: 'var(--font-pech)', fontSize: '5.5vw', fontWeight: 'normal', lineHeight: '0.9', color: '#020202ff', transformOrigin: 'left', marginTop: '1vw', letterSpacing: '-0.02em', display: 'flex', gap: '2vw' }}>
                            <span className="hero-word">PECH</span>
                            <span className="hero-word">BALAM</span>
                        </div>
                    </h1>
                    <p ref={subtitleRef} className="hero-subtitle" style={{ marginTop: '30px', color: '#444', maxWidth: '400px', opacity: 0 }}>
                        Nuestras innovadoras tecnologías de restauración digital allanan el camino para preservar la historia.
                    </p>
                </div>
            </div>

            {/* SECCIÓN 2: Massive Typography (now handled by BackgroundText layer) */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'flex-start', position: 'relative', overflow: 'visible' }}>
            </div>

            {/* SECCIÓN 3: Espacio Hotspot 2 (Manto Drapeado) - Aparece al llegar a la página 3 */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
            </div>

            {/* SECCIÓN 4: Espacio Hotspot 3 (Base y Roca) - Aparece al llegar a la página 4 */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>

                {/* Imagen de fondo al final del scroll */}
                <img
                    src="/assets/fondos/paisaje.png"
                    alt="Paisaje final"
                    className="footer-image"
                    style={{
                        opacity: scroll.offset > 0.8 ? (scroll.offset - 0.8) * 5 : 0
                    }}
                />

                {/* Difuminado final */}
                <div className="bottom-blur" style={{ opacity: scroll.offset > 0.9 ? 1 : 0 }}></div>
            </div>

        </div>
    );
}


