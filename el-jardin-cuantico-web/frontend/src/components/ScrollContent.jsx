import React, { useRef, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import { useHotspotState } from '../logic/useHotspotState';
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
            <div className="scroll-section" style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <div ref={heroRef} style={{ transition: 'opacity 0.5s', opacity: scroll.offset > 0.1 ? 0 : 1 }}>
                    <p style={{
                        color: '#888',
                        fontSize: '1em',
                        margin: '0 0 0.5em 0',
                        letterSpacing: '0.1em',
                        fontWeight: '600',
                        background: '#e0e0e0',
                        display: 'inline-block',
                        padding: '0.2em 0.5em',
                        borderRadius: '4px'
                    }}>Portafolio - Website</p>
                    <h1 style={{
                        color: '#1a1a1a',
                        fontSize: '5em',
                        margin: '0',
                        lineHeight: '0.9',
                        fontWeight: '800',
                        textTransform: 'uppercase'
                    }}>
                        DEVELOPER<br />UZIEL ISAAC<br />PECH BALAM
                    </h1>
                    <p style={{
                        color: '#555',
                        fontSize: '1.2em',
                        maxWidth: '500px',
                        marginTop: '1.5em',
                        lineHeight: '1.4'
                    }}>
                        Nuestras innovadoras tecnologías de restauración digital allanan el camino para preservar la historia.
                    </p>
                </div>
            </div>

            {/* SECCIÓN 2: Hotspot 1 (Flores y Corona) - Aparece al llegar a la página 2 */}
            <div className="scroll-section" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
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
