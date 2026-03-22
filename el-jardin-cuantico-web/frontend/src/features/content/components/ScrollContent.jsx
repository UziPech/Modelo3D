import React, { useRef, useEffect } from 'react';
import { useScroll } from '@react-three/drei';

export default function ScrollContent() {
    const scroll = useScroll(); // Para animaciones basadas en el scroll

    // Animación del título principal (fade out)
    const heroRef = useRef();



    return (
        <div className="content-wrapper" style={{ padding: '0 10vw' }}>

            {/* SECCIÓN 1: Hero Section (Título Principal) */}
            <div className="scroll-section hero-section" style={{ position: 'relative', overflow: 'visible' }}>
                <div ref={heroRef} className="hero-text-wrapper" style={{ transition: 'opacity 0.5s', opacity: Math.max(0, 1 - scroll.offset * 12), marginLeft: '-2vw' }}>
                    <p className="hero-badge" style={{ display: 'none' }}>UziPech-Website</p>
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
                        <div style={{ fontSize: '5.35vw', fontWeight: '900', lineHeight: '0.8', transform: 'scaleX(1.05)', transformOrigin: 'left' }}>
                            <span style={{
                                fontFamily: 'var(--font-uziel)',
                                backgroundImage: 'linear-gradient(to top, #333333, #ffffff)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                display: 'inline-block'
                            }}>UZIEL</span> <span style={{ fontFamily: 'var(--font-isaac)', fontSize: '1.4em', fontWeight: 'normal', color: '#1a1a1a', verticalAlign: 'middle', marginLeft: '0.2vw' }}>ISAAC</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-pech)', fontSize: '6.42vw', fontWeight: 'normal', lineHeight: '0.8', color: '#020202ff', transform: 'scaleX(1.05)', transformOrigin: 'left', marginTop: '1vw' }}>
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

