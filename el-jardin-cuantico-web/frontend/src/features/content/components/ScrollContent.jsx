import React, { useRef, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import { useHotspotState } from '../../experience';
import VanillaTilt from 'vanilla-tilt';
// import 'animate.css'; // REMOVED: Causing visibility conflicts

// Componente Wrapper para Vanilla-Tilt
const TiltCard = ({ children, className, style }) => {
    const tiltRef = useRef(null);
    useEffect(() => {
        if (tiltRef.current) {
            VanillaTilt.init(tiltRef.current, {
                max: 15, // Inclinación máxima
                speed: 400, // Velocidad de transición
                glare: true, // Efecto de brillo
                "max-glare": 0.4, // Opacidad del brillo
                scale: 1.05, // Escala al hacer hover
                perspective: 1000,
            });
        }
    }, []);

    return (
        <div ref={tiltRef} className={className} style={style}>
            {children}
        </div>
    );
}

// Componente Tarjeta con Lógica de Aparición y Estilo Crystal
const Card = ({ data, scrollOpacity, isActive }) => {
    // Usamos scrollOpacity para determinar si la tarjeta debe animarse
    // const isVisible = scrollOpacity > 0; // REMOVED: Scroll logic disabled for stability

    return (
        <TiltCard
            className="hotspot-card"
            style={{
                // VISIBILITY GUARANTEE: Force opacity 1. 
                // Scroll animation is removed to ensure cards are ALWAYS visible.
                opacity: 1,
                pointerEvents: 'auto',
                // No transition needed for static opacity
            }}
        >
            {data && (
                <>
                    <h3>{data.title}</h3>
                    <p>{data.text}</p>
                </>
            )}
        </TiltCard>
    );
};

export default function ScrollContent() {
    const { activeHotspotId, HOTSPOT_DATA } = useHotspotState();
    const scroll = useScroll(); // Para animaciones basadas en el scroll

    // Función auxiliar para obtener el contenido
    const getCardContent = (id) => HOTSPOT_DATA.find(d => d.id === id);

    // Animación del título principal (fade out)
    const heroRef = useRef();

    // Función simplificada para la opacidad
    const getSectionOpacity = (index) => {
        const current = scroll.offset;

        // Card 1 (Flores): Aparece pronto (0.15) y se queda hasta la mitad (0.55)
        if (index === 2) {
            return current > 0.15 && current < 0.55 ? 1 : 0;
        }
        // Card 2 (Manto): Aparece en la mitad (0.45) hasta el final (0.85)
        if (index === 3) {
            return current > 0.45 && current < 0.85 ? 1 : 0;
        }
        // Card 3 (Base): Aparece al final (0.75)
        if (index === 4) {
            return current > 0.75 ? 1 : 0;
        }
        return 0;
    };

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
                                backgroundImage: 'linear-gradient(to top, #000000ff, #ffffffff)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                display: 'inline-block'
                            }}>UZIEL</span> <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-secondary)', fontWeight: '600', color: '#1a1a1a' }}>ISAAC</span>
                        </div>
                        <div style={{ fontSize: '6.42vw', fontWeight: '900', lineHeight: '0.8', color: '#020202ff', transform: 'scaleX(1.05)', transformOrigin: 'left', marginTop: '1vw' }}>
                            PECH BALAM
                        </div>
                    </h1>
                    <p className="hero-subtitle" style={{ marginTop: '30px', color: '#444', maxWidth: '400px' }}>
                        Nuestras innovadoras tecnologías de restauración digital allanan el camino para preservar la historia.
                    </p>
                </div>
            </div>

            {/* SECCIÓN 2: Hotspot 1 (Flores y Corona) - Aparece al llegar a la página 2 */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'flex-start', position: 'relative', overflow: 'visible' }}>
                <Card data={getCardContent(1)} scrollOpacity={getSectionOpacity(2)} isActive={activeHotspotId === 1} />
            </div>

            {/* SECCIÓN 3: Hotspot 2 (Manto Drapeado) - Aparece al llegar a la página 3 */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                <Card data={getCardContent(2)} scrollOpacity={getSectionOpacity(3)} isActive={activeHotspotId === 2} />
            </div>

            {/* SECCIÓN 4: Hotspot 3 (Base y Roca) - Aparece al llegar a la página 4 */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                <Card data={getCardContent(3)} scrollOpacity={getSectionOpacity(4)} isActive={activeHotspotId === 3} />

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

