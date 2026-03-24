import React, { useRef, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import gsap from 'gsap';

/**
 * Split a string into individual <span> elements for character-level animation.
 */
function SplitChars({ text, className, style }) {
    return (
        <span className={className} style={{ ...style, display: 'inline-block' }}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className="split-char"
                    style={{ display: 'inline-block' }}
                >
                    {char}
                </span>
            ))}
        </span>
    );
}

export default function ScrollContent() {
    const scroll = useScroll();
    const heroRef = useRef();
    const uzielRef = useRef();

    // Scroll-synced opacity on footer image and blur effect
    // We remove the hero text blur and entrance animations as requested

    return (
        <div className="content-wrapper" style={{ padding: '0 10vw' }}>

            {/* SECCIÓN 1: Hero Section (Título Principal) */}
            <div className="scroll-section hero-section" style={{ position: 'relative', overflow: 'visible' }}>
                <div ref={heroRef} className="hero-text-wrapper" style={{ marginLeft: '-2vw' }}>
                    <h1 className="hero-title" style={{ margin: 0 }}>
                        <span style={{
                            background: '#000',
                            color: '#fff',
                            padding: '4px 12px',
                            fontSize: '0.25em',
                            borderRadius: '4px',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            marginBottom: '20px',
                            letterSpacing: '2px'
                        }}>DEVELOPER</span>
                        <div ref={uzielRef} style={{ display: 'flex', alignItems: 'center', fontSize: '4.5vw', fontWeight: '900', lineHeight: '0.9', transformOrigin: 'left' }}>
                            <span
                                style={{
                                    fontFamily: 'var(--font-uziel)',
                                    fontSize: '1.4em', // 10% larger than parent
                                    color: '#1a1a1a', // Solid color to eliminate perceived blur
                                    letterSpacing: '-0.02em',
                                    display: 'inline-block'
                                }}
                            >
                                UZIEL
                            </span>
                            <span style={{ fontFamily: 'var(--font-isaac)', fontSize: '1.4em', fontWeight: 'normal', color: '#1a1a1a', marginLeft: '2.5vw' }}>ISAAC</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-pech)', fontSize: '5.5vw', fontWeight: 'normal', lineHeight: '0.9', color: '#020202ff', transformOrigin: 'left', marginTop: '1vw', letterSpacing: '-0.02em' }}>
                            PECH BALAM
                        </div>
                    </h1>
                    <p className="hero-subtitle" style={{ marginTop: '30px', color: '#444', maxWidth: '400px' }}>
                        Nuestras innovadoras tecnologías de restauración digital allanan el camino para preservar la historia.
                    </p>
                </div>
            </div>

            {/* SECCIÓN 2: Espacio Hotspot 1 (Flores y Corona) - Aparece al llegar a la página 2 */}
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


