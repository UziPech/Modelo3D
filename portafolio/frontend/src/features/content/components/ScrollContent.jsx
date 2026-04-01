import React, { useRef, useLayoutEffect } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';

export default function ScrollContent() {
    const scroll = useScroll();

    // Refs del Hero Original
    const heroRef = useRef();
    const heroContentRef = useRef();
    const badgeRef = useRef();
    const uzielRef = useRef();
    const pechRef = useRef();
    const subtitleRef = useRef();

    // Refs Hook Narrativo 1
    const hook1Ref = useRef();
    const hookLine1Ref = useRef();
    const hookLine2Ref = useRef();
    const hookLine3Ref = useRef();

    // Refs Hook Narrativo 2 (Marquee)
    const marqueeRef = useRef();
    const marquee1Ref = useRef();
    const marquee2Ref = useRef();

    // Refs Heart Section
    const heartRef = useRef();

    // Refs de la Zona Negra (Manifiesto)
    const manifestoRef = useRef();

    // Animación inicial del Hero (sólo carga, no scroll)
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
            tl.fromTo(badgeRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
            const nameWords = uzielRef.current.querySelectorAll('.hero-word');
            tl.to(nameWords, { clipPath: 'inset(-10% -10% -10% 0)', opacity: 1, duration: 0.8, stagger: 0.15 }, '-=0.2');
            const pechWords = pechRef.current.querySelectorAll('.hero-word');
            tl.to(pechWords, { clipPath: 'inset(-10% -10% -10% 0)', opacity: 1, duration: 0.8, stagger: 0.15 }, '-=0.5');
            tl.fromTo(subtitleRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.3');
        }, heroRef);
        return () => ctx.revert();
    }, []);

    // ── MAGIA DETERMINÍSTICA (Scrub) ─────────────────────────────────────────
    // PÁGINAS TOTALES: 6. Offset de 0 a 1.
    //
    // Timeline de Offset:
    // 0.00 - 0.12 : Hero
    // 0.12 - 0.30 : Hook Narrativo (No solo escribo código...)
    // 0.30 - 0.48 : Manifiesto Blanco (Código meticuloso...)
    // 0.48 - 0.66 : Marquee Karaoke
    // 0.66 - 0.82 : Heart (I 🖤 DESIGN)
    // 0.80 - 0.95 : Curtain falls (En CurtainBackground.jsx)

    useFrame(() => {
        const offset = scroll.offset;

        // 1. HERO FADEOUT (0.05 -> 0.12)
        if (heroContentRef.current) {
            const heroOp = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.05, 0.12, 1, 0, offset));
            const heroY = gsap.utils.clamp(-100, 0, gsap.utils.mapRange(0.05, 0.12, 0, -100, offset));
            heroContentRef.current.style.opacity = heroOp;
            heroContentRef.current.style.transform = `translateY(${heroY}px)`;
            heroContentRef.current.style.visibility = heroOp === 0 ? 'hidden' : 'visible';
        }

        // 2. HOOK NARRATIVO 1 (0.10 -> 0.30)
        if (hook1Ref.current) {
            let op = 0;
            if (offset >= 0.10 && offset <= 0.30) {
                if (offset < 0.14) op = gsap.utils.mapRange(0.10, 0.14, 0, 1, offset);
                else if (offset <= 0.26) op = 1;
                else op = gsap.utils.mapRange(0.26, 0.30, 1, 0, offset);
            }
            op = gsap.utils.clamp(0, 1, op);
            hook1Ref.current.style.opacity = op;
            hook1Ref.current.style.visibility = op === 0 ? 'hidden' : 'visible';

            if (op > 0) {
                const slide1 = gsap.utils.clamp(-50, 50, gsap.utils.mapRange(0.10, 0.30, 50, -50, offset));
                const slide2 = gsap.utils.clamp(-50, 50, gsap.utils.mapRange(0.10, 0.30, -50, 50, offset));
                const slide3 = gsap.utils.clamp(0, 100, gsap.utils.mapRange(0.10, 0.30, 100, 0, offset));

                if (hookLine1Ref.current) hookLine1Ref.current.style.transform = `translateX(${slide1}vw)`;
                if (hookLine2Ref.current) hookLine2Ref.current.style.transform = `translateX(${slide2}vw)`;
                if (hookLine3Ref.current) hookLine3Ref.current.style.transform = `translateY(${slide3}px)`;
            }
        }

        // 3. NUEVO MANIFIESTO BLANCO (0.28 -> 0.48)
        if (manifestoRef.current) {
            let op = 0;
            if (offset >= 0.28 && offset <= 0.48) {
                if (offset < 0.32) op = gsap.utils.mapRange(0.28, 0.32, 0, 1, offset);
                else if (offset <= 0.44) op = 1;
                else op = gsap.utils.mapRange(0.44, 0.48, 1, 0, offset);
            }
            op = gsap.utils.clamp(0, 1, op);
            manifestoRef.current.style.opacity = op;
            manifestoRef.current.style.visibility = op === 0 ? 'hidden' : 'visible';

            if (op > 0) {
                manifestoRef.current.style.transform = `translateY(${(1 - op) * 40}px)`;
            }
        }

        // 4. MARQUEE (0.46 -> 0.66)
        if (marqueeRef.current) {
            let op = 0;
            if (offset > 0.46 && offset < 0.66) {
                if (offset < 0.50) op = gsap.utils.mapRange(0.46, 0.50, 0, 1, offset);
                else if (offset <= 0.62) op = 1;
                else op = gsap.utils.mapRange(0.62, 0.66, 1, 0, offset);
            }
            op = gsap.utils.clamp(0, 1, op);
            marqueeRef.current.style.opacity = op;
            marqueeRef.current.style.visibility = op === 0 ? 'hidden' : 'visible';

            if (op > 0) {
                const moveX1 = (offset - 0.46) * 150;
                const moveX2 = -((offset - 0.46) * 150) + 10;
                if (marquee1Ref.current) marquee1Ref.current.style.transform = `translateX(${-moveX1}vw)`;
                if (marquee2Ref.current) marquee2Ref.current.style.transform = `translateX(${moveX2}vw)`;

                const fillPct1 = gsap.utils.clamp(0, 100, (offset - 0.50) * 400);
                const fillPct2 = gsap.utils.clamp(0, 100, (offset - 0.53) * 400);
                if (marquee1Ref.current) marquee1Ref.current.style.backgroundImage = `linear-gradient(to right, #000 ${fillPct1}%, transparent ${fillPct1}%)`;
                if (marquee2Ref.current) marquee2Ref.current.style.backgroundImage = `linear-gradient(to right, #000 ${fillPct2}%, transparent ${fillPct2}%)`;
            }
        }

        // 5. HEART "I 🖤 DESIGN" (0.64 -> 0.82)
        if (heartRef.current) {
            let op = 0;
            if (offset > 0.64 && offset <= 0.82) {
                if (offset < 0.68) op = gsap.utils.mapRange(0.64, 0.68, 0, 1, offset);
                else if (offset < 0.78) op = 1;
                else op = gsap.utils.mapRange(0.78, 0.82, 1, 0, offset);
            }
            op = gsap.utils.clamp(0, 1, op);
            heartRef.current.style.opacity = op;
            heartRef.current.style.visibility = op === 0 ? 'hidden' : 'visible';

            if (op > 0) {
                // Gentle breathing scale
                const scale = gsap.utils.clamp(0.9, 1.15, 0.9 + (offset - 0.64) * 1.5);
                heartRef.current.style.transform = `scale(${scale})`;
            }
        }
    });

    return (
        <div className="content-wrapper" style={{ padding: '0 10vw' }}>

            {/* SECCIÓN 1: Hero Inicial */}
            <div className="scroll-section hero-section" style={{ position: 'relative', overflow: 'visible', zIndex: 1 }}>
                <div ref={heroRef} className="hero-text-wrapper" style={{ marginLeft: '-2vw', position: 'relative' }}>
                    <div ref={heroContentRef} style={{ willChange: 'opacity, transform' }}>

                        {/* Ghost Text */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: 'absolute', top: '50%', left: '-1vw', transform: 'translateY(-50%)',
                                zIndex: -1, pointerEvents: 'none', userSelect: 'none', lineHeight: 0.85,
                                display: 'flex', flexDirection: 'column', gap: '0.1em',
                                maskImage: 'linear-gradient(to right, black 30%, transparent 58%)',
                                WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 58%)',
                            }}
                        >
                            <span style={{ fontFamily: 'var(--font-pech)', fontSize: '9.2vw', fontWeight: '900', color: 'rgba(6, 5, 5, 0.07)', letterSpacing: '-0.03em', whiteSpace: 'nowrap', display: 'block' }}>UZIEL ISAAC</span>
                            <span style={{ fontFamily: 'var(--font-pech)', fontSize: '9.2vw', fontWeight: '900', color: 'rgba(5, 5, 5, 0.07)', letterSpacing: '-0.03em', whiteSpace: 'nowrap', display: 'block' }}>PECH BALAM</span>
                        </div>

                        <h1 className="hero-title" style={{ margin: 0 }}>
                            <span ref={badgeRef} className="shimmer-badge" style={{
                                background: '#000', color: '#fff', padding: '4px 12px', fontSize: '0.25em', borderRadius: '4px', display: 'inline-block', verticalAlign: 'middle', marginBottom: '20px', letterSpacing: '2px', opacity: 0,
                            }}>DEVELOPER</span>

                            <div ref={uzielRef} style={{ display: 'flex', alignItems: 'center', fontSize: '4.5vw', fontWeight: '900', lineHeight: '0.9', transformOrigin: 'left' }}>
                                <span className="hero-word" style={{ fontFamily: 'var(--font-uziel)', fontSize: '1.4em', color: '#1a1a1a', letterSpacing: '-0.02em', display: 'inline-block' }}>UZIEL</span>
                                <span className="hero-word" style={{ fontFamily: 'var(--font-isaac)', fontSize: '1.4em', fontWeight: 'normal', color: '#1a1a1a', marginLeft: '2.5vw' }}>ISAAC</span>
                            </div>
                            <div ref={pechRef} style={{ fontFamily: 'var(--font-pech)', fontSize: '5.5vw', fontWeight: 'normal', lineHeight: '0.9', color: '#020202ff', transformOrigin: 'left', marginTop: '1vw', letterSpacing: '-0.02em', display: 'flex', gap: '2vw' }}>
                                <span className="hero-word">PECH</span>
                                <span className="hero-word">BALAM</span>
                            </div>
                        </h1>
                        <p ref={subtitleRef} className="hero-subtitle" style={{ marginTop: '30px', color: '#444', maxWidth: '400px', opacity: 0 }}>
                            Construyo sistemas reales. No demos. Cada proyecto tiene nombre, cliente y fecha de entrega.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: THE HOOK NARRATIVE (Editorial Typography) */}
            <div className="scroll-section" style={{ position: 'relative', overflow: 'hidden', pointerEvents: 'none' }}>
                <div
                    ref={hook1Ref}
                    style={{
                        position: 'absolute', top: '18%', left: '3vw', width: '55%',
                        opacity: 0, visibility: 'hidden', willChange: 'opacity, visibility'
                    }}
                >
                    {/* Line 1 — DOMINANT headline */}
                    <div ref={hookLine1Ref} style={{ willChange: 'transform' }}>
                        <h2 style={{ fontFamily: 'var(--font-pech)', fontSize: '5.5vw', fontWeight: '900', color: '#111', margin: 0, lineHeight: 1.1 }}>
                            NO SOLO ESCRIBO CÓDIGO.
                        </h2>
                    </div>

                    {/* Line 2 — secondary, lighter weight */}
                    <div ref={hookLine2Ref} style={{ willChange: 'transform', marginTop: '2.5vw' }}>
                        <p style={{
                            fontFamily: 'var(--font-isaac)', fontSize: '2.8vw', fontWeight: '400',
                            color: '#444', margin: 0, lineHeight: 1.3,
                            fontStyle: 'italic'
                        }}>
                            Construyo cosas que funcionan.
                        </p>
                    </div>

                    {/* Line 3 — quiet closure */}
                    <div ref={hookLine3Ref} style={{ willChange: 'transform', marginTop: '2vw' }}>
                        <p style={{ fontFamily: 'var(--font-pech)', fontSize: '2vw', fontWeight: '600', color: '#666', lineHeight: 1.2 }}>
                            ... que duran y que importan.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2.5: MANIFIESTO FRONTEND (Sobre Blanco) */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                <div
                    ref={manifestoRef}
                    style={{
                        opacity: 0,
                        visibility: 'hidden',
                        maxWidth: '85vw',
                        textAlign: 'center',
                        fontFamily: 'var(--font-syne)',
                        fontSize: '1.4rem',
                        lineHeight: '1.4',
                        color: '#111',
                        padding: '0 20px',
                        willChange: 'transform, opacity, visibility'
                    }}
                >
                    <strong style={{ fontWeight: '800', display: 'block', marginBottom: '16px', fontSize: '3rem', fontFamily: 'var(--font-pech)', letterSpacing: '-0.02em', color: '#000' }}>
                        CÓDIGO METICULOSO.
                    </strong>
                    Como desarrollador <strong style={{ fontWeight: '800', fontFamily: 'var(--font-isaac)', fontSize: '2rem' }}>Full Stack especializado en Frontend</strong>, mi obsesión radica en la conjunción entre arquitectura invisible y estética brutalista. La tecnología sola no basta; exige diseño supremo.
                </div>
            </div>

            {/* SECCIÓN 3: MARQUEE KARAOKE (Sobre Blanco) */}
            <div className="scroll-section" style={{ position: 'relative', overflow: 'visible', pointerEvents: 'none' }}>
                <div ref={marqueeRef} style={{ position: 'absolute', top: '30%', width: '100vw', left: '-10vw', opacity: 0, visibility: 'hidden', willChange: 'opacity, visibility' }}>
                    <h2
                        ref={marquee1Ref}
                        style={{
                            fontFamily: 'var(--font-pech)',
                            fontSize: '11vw',
                            fontWeight: '900',
                            whiteSpace: 'nowrap',
                            margin: 0,
                            padding: '0.1em 0',
                            lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: '2px rgba(0,0,0,0.2)', // gris clarito
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            backgroundImage: 'linear-gradient(to right, #000 0%, transparent 0%)', // se llena de negro
                            backgroundRepeat: 'no-repeat',
                            willChange: 'transform, backgroundImage'
                        }}
                    >
                        FRONTEND SPECIALIST &nbsp; FRONTEND SPECIALIST &nbsp; FRONTEND SPECIALIST &nbsp; FRONTEND SPECIALIST
                    </h2>
                    <h2
                        ref={marquee2Ref}
                        style={{
                            fontFamily: 'var(--font-isaac)',
                            fontSize: '7vw',
                            fontWeight: '300',
                            whiteSpace: 'nowrap',
                            margin: '-1vw 0 0 0',
                            padding: '0.1em 0',
                            lineHeight: 1,
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(0,0,0,0.3)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            backgroundImage: 'linear-gradient(to right, #000 0%, transparent 0%)',
                            backgroundRepeat: 'no-repeat',
                            willChange: 'transform, backgroundImage'
                        }}
                    >
                        CREATIVE CODE • CONTEMPORARY • CREATIVE CODE • CONTEMPORARY • CREATIVE CODE • CONTEMPORARY
                    </h2>
                </div>
            </div>

            {/* SECCIÓN 4: CORAZÓN BRUTALISTA MASIVO (Sobre Blanco) */}
            <div className="scroll-section" style={{ position: 'relative', pointerEvents: 'none' }}>
                <div
                    ref={heartRef}
                    style={{
                        position: 'absolute',
                        top: '20%',
                        left: '5vw',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        opacity: 0,
                        visibility: 'hidden',
                        willChange: 'transform, opacity, visibility',
                        transformOrigin: 'center center'
                    }}
                >
                    <span style={{ fontSize: '5vw', fontFamily: 'var(--font-uziel)', fontWeight: '900', color: '#000', lineHeight: 1 }}>I</span>
                    <span style={{ fontSize: '10vw', color: '#000', lineHeight: 1.1 }}>🖤</span>
                    <span style={{ fontSize: '5vw', fontFamily: 'var(--font-pech)', fontWeight: '900', color: '#000', letterSpacing: '-0.05em', lineHeight: 1 }}>DESIGN</span>
                </div>
            </div>



            {/* ESPACIO VACÍO PARA DEJAR CAER LA CORTINA */}
            <div className="scroll-section" style={{ pointerEvents: 'none' }}></div>

            {/* ESPACIO VACÍO PARA DEJAR CAER LA CORTINA Y MOSTRAR ESCENA NEGRA */}
            <div className="scroll-section" style={{ pointerEvents: 'none' }}></div>
            <div className="scroll-section" style={{ pointerEvents: 'none' }}></div>

            {/* Imagen Pura de Fondo final (aparece al 85%) */}
            <img
                src="/assets/fondos/paisaje.png"
                alt="Paisaje final"
                className="footer-image"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none', opacity: scroll.offset > 0.85 ? (scroll.offset - 0.85) * 5 : 0 }}
            />

            <div className="bottom-blur" style={{ opacity: scroll.offset > 0.9 ? 1 : 0, position: 'absolute', bottom: 0, height: '40vh', width: '100%' }}></div>

        </div>
    );
}
