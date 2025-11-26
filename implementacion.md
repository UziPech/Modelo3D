Paso 7: Generación de Contenido para las Tarjetas
Para que el proyecto tenga sustancia, generaremos el texto detallado para las tres secciones de hotspots definidas en useHotspotState.js y para la narrativa principal del scroll.

A. Título Principal (Sección 1)
Título: POTENCIANDO EL LEGADO ARTÍSTICO Bajada: Nuestras innovadoras tecnologías de restauración digital allanan el camino para preservar la historia.

B. Contenido de Hotspots (Lógica de Negocio)
Este texto se integrará en el array HOTSPOT_DATA en /frontend/src/logic/useHotspotState.js.

Hotspot 1: Flores y Corona (Parte Superior)
Título: La Polifonía de la Polícroma

Texto: El tocado de flores revela un secreto largamente olvidado: las esculturas griegas y romanas estaban ricamente pintadas. El análisis UV muestra rastros de pigmentos ocres y azules, recreando la vibrante apariencia original de Flore.

Hotspot 2: Manto Drapeado (Parte Central)
Título: El Virtuosismo del Paño Mojado

Texto: Esta técnica de "paño mojado" (Wet Drapery), popularizada por escultores clásicos, requería una maestría inigualable. El estudio digital del draping nos permite simular con precisión cómo las túnicas caerían sobre el cuerpo, resaltando la forma sinuosas.

Hotspot 3: Base y Roca (Parte Inferior)
Título: Identidad y Contexto

Texto: Las bases a menudo contenían la firma del artista y el contexto histórico, cruciales para datar la obra. La roca es un punto de equilibrio camuflado y una firma estilística que varía según la escuela de escultura (Ateniense, Romana o Helenística). 
El efecto crystal o vidrio esmerilado (transparencia + desenfoque) es puramente un efecto de CSS. La coordinación con el scroll requiere que las tarjetas se posicionen en las diferentes secciones 100vh.

1. El CSS del Efecto Crystal
Este CSS debe estar disponible globalmente (e.g., en index.css).

CSS

/* /frontend/src/index.css (Asegura estas clases) */

.scroll-section {
    /* Altura que define cada página de scroll */
    height: 100vh; 
    width: 100%;
    /* Centrar contenido horizontalmente */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.hotspot-card {
    /* Propiedades del efecto Glassmorphism (Crystal) */
    background-color: rgba(255, 255, 255, 0.25); /* Fondo blanco con 25% opacidad */
    backdrop-filter: blur(12px); /* El filtro de desenfoque es la clave */
    -webkit-backdrop-filter: blur(12px); /* Compatibilidad con Safari */
    
    /* Estilo del contenedor */
    border: 1px solid rgba(255, 255, 255, 0.18); /* Borde sutil y semitransparente */
    border-radius: 16px;
    padding: 2.5em; /* Buen espaciado */
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
    
    /* Fuente y contraste */
    color: #000000; 
    max-width: 450px;
    z-index: 100;
}

.hotspot-card h3 {
    margin-top: 0;
    font-size: 1.5em;
    font-weight: 600;
}
2. Implementación de ScrollContent.jsx con el Contenido
Asegúrate de que este componente use la lógica de negocio y el contenido generado para las tres secciones de hotspots. Usaremos la función useScroll dentro de este componente para aplicar animaciones de transparencia HTML basadas en el scroll (similar al video), más allá de la activación por clic.

JavaScript

// /frontend/src/components/ScrollContent.jsx
import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei'; // Importar useScroll aquí también
import { useHotspotState } from '../logic/useHotspotState';

export function ScrollContent() {
  const { activeHotspotId, HOTSPOT_DATA } = useHotspotState();
  const scroll = useScroll(); // Para animaciones basadas en el scroll

  // Función auxiliar para obtener el contenido
  const getCardContent = (id) => HOTSPOT_DATA.find(d => d.id === id);

  // Animación del título principal (fade out)
  const heroRef = useRef();

  // Función para obtener la opacidad del contenido en función de la posición de scroll
  const getSectionOpacity = (index) => {
    // 4 secciones (0, 1, 2, 3). 'index' empieza en 1.
    const startScroll = (index - 1) / 4;
    const endScroll = index / 4;
    
    // Muestra la tarjeta en su sección
    if (scroll.offset >= startScroll && scroll.offset < endScroll) {
      return 1;
    }
    // Fade out suave al salir de la sección
    if (scroll.offset < startScroll || scroll.offset >= endScroll) {
      return 0.2; 
    }
    return 0;
  };


  return (
    <div className="content-wrapper" style={{ padding: '0 10vw' }}>

      {/* SECCIÓN 1: Hero Section (Título Principal) */}
      <div className="scroll-section" style={{ alignItems: 'flex-start' }}>
        <div ref={heroRef} style={{ transition: 'opacity 0.5s', opacity: scroll.offset > 0.1 ? 0 : 1 }}>
          <p style={{ color: '#555', fontSize: '1.2em', margin: 0 }}>PROYECTO FLORE</p>
          <h1 style={{ color: 'black', fontSize: '4em', margin: '0.2em 0' }}>
            POTENCIANDO EL LEGADO ARTÍSTICO
          </h1>
          <p style={{ color: '#333', fontSize: '1.3em', maxWidth: '600px' }}>
            Nuestras innovadoras tecnologías de restauración digital allanan el camino para preservar la historia.
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: Hotspot 1 (Flores y Corona) - Aparece al llegar a la página 2 */}
      <div className="scroll-section">
        <Card data={getCardContent(1)} scrollOpacity={getSectionOpacity(2)} isActive={activeHotspotId === 1} />
      </div>

      {/* SECCIÓN 3: Hotspot 2 (Manto Drapeado) - Aparece al llegar a la página 3 */}
      <div className="scroll-section">
        <Card data={getCardContent(2)} scrollOpacity={getSectionOpacity(3)} isActive={activeHotspotId === 2} />
      </div>

      {/* SECCIÓN 4: Hotspot 3 (Base y Roca) - Aparece al llegar a la página 4 */}
      <div className="scroll-section">
        <Card data={getCardContent(3)} scrollOpacity={getSectionOpacity(4)} isActive={activeHotspotId === 3} />
      </div>

    </div>
  );
}

// Componente Tarjeta con Lógica de Aparición y Estilo Crystal
const Card = ({ data, scrollOpacity, isActive }) => {
    // El 'scrollOpacity' hace que la tarjeta se difumine al salir de su sección 100vh
    // El 'isActive' se usa para darle un estilo adicional al ser clickeada.
    
    const finalOpacity = isActive ? 1 : scrollOpacity;
    
    return (
        <div 
            className="hotspot-card" 
            style={{ 
                opacity: finalOpacity, 
                transition: 'opacity 0.5s, transform 0.5s',
                transform: `scale(${isActive ? 1.05 : 1})`, // Pequeño efecto de zoom al hacer clic
            }}
        >
            {data && (
                <>
                    <h3>{data.title}</h3>
                    <p>{data.text}</p>
                </>
            )}
        </div>
    );
};
✅ Resumen de la Implementación Final:
Efecto Crystal: Logrado con las propiedades backdrop-filter: blur(12px); y rgba(255, 255, 255, 0.25) en el CSS de .hotspot-card.

Scroll HTML: El componente ScrollContent usa la función getSectionOpacity para que las tarjetas aparezcan suavemente (opacidad) a medida que entran y salen de la vista (similares al efecto del video).

Contenido y Lógica: Se usaron los textos generados, vinculados al useHotspotState y al scroll.

Tu proyecto ahora tiene la arquitectura completa: Estatua Metálica 3D con Fade y Transformación a Mármol, Hotspots con Zoom de Cámara, y Tarjetas HTML con efecto Crystal y animación de scroll.