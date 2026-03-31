Parte 2: Componente 3D (/frontend/src/models/EstatuaAnimada.jsx)
Este archivo combina el modelo, el material metálico, la lógica de clic y la animación de scroll en un solo lugar.

1. El Componente Base (EstatuaMetalica)
Primero, vamos a refactorizar tu código de carga en un componente simple y reutilizable.

JavaScript

// /frontend/src/models/EstatuaMetalica.jsx
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three'; 
import React, { useRef } from 'react';

// Componente que renderiza el modelo 'Flore' con el material metálico PBR.
export function EstatuaMetalica({ onHotspotClick, HOTSPOT_DATA }) {
  // Carga del modelo GLB (asegúrate que la ruta sea correcta)
  const gltf = useGLTF('/flore.glb'); 
  const modelRef = useRef();

  // 1. Aplicar el material metálico a todas las mallas
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      // MeshStandardMaterial soporta metalness y opacity para el fade
      child.material = new THREE.MeshStandardMaterial({
        color: '#aaaaaa',      
        metalness: 1.0,         
        roughness: 0.2,         
        transparent: true,      // ¡Crucial para el efecto de difuminado!
        opacity: 1.0,           // Empezamos opaco
      });
    }
  });

  return (
    <group ref={modelRef} scale={1.5} position={[0, -1.0, 0]}> 
      <primitive object={gltf.scene} /> 

      {/* 2. Hotspots: Añadir las esferas invisibles para detectar clics */}
      {HOTSPOT_DATA.map((hotspot) => (
        <mesh 
          key={hotspot.id}
          position={hotspot.cameraTarget}
          onClick={() => onHotspotClick(hotspot.id)} // Llama a la lógica de negocio
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial 
            color={'#FFFFFF'}
            transparent 
            opacity={0.0} // Completamente invisible
          />
        </mesh>
      ))}

      {/* Iluminación de Entorno para reflejos */}
      <Environment preset="studio" background={false} /> 
    </group>
  );
}

// Para que R3F pre-cargue el modelo
useGLTF.preload('/flore.glb');
2. El Animador de Scroll (EstatuaAnimada)
Este componente utiliza el hook useScroll para vincular la posición de desplazamiento a la opacidad y posición del modelo 3D.

JavaScript

// /frontend/src/models/EstatuaAnimada.jsx
import { useScroll, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import { EstatuaMetalica } from './EstatuaMetalica'; // Importar el componente base
import { useHotspotState } from '../logic/useHotspotState'; // Importar la lógica

/**
 * @function EstatuaAnimada
 * @description Componente contenedor que aplica la lógica de scroll, rotación y clics
 * a la Estatua 'Flore'.
 */
export function EstatuaAnimada() {
  const { toggleHotspot, HOTSPOT_DATA } = useHotspotState(); // Lógica de negocio
  const scroll = useScroll(); // Hook de Drei para obtener la posición del scroll (0 a 1)
  const groupRef = useRef(); // Referencia al grupo que contiene el modelo y los hotspots

  useFrame(() => {
    if (!groupRef.current) return;

    // 1. ROTACIÓN DINÁMICA: Rotar lentamente en la Sección 1 (scroll.offset < 0.25)
    // Usamos el offset del scroll para que la rotación disminuya
    const rotationSpeed = Math.max(0, 0.005 * (1 - scroll.offset * 4));
    groupRef.current.rotation.y += rotationSpeed; 

    // 2. EFECTO DE DIFUMINADO (FADE OUT):
    // El modelo debe empezar a difuminarse al entrar en la página 2 (scroll.offset > 0.25)
    
    // Calcula qué porcentaje del fade ha ocurrido (0 a 1)
    // Empieza a 0.25 (Página 2) y termina en 0.50 (Mitad de Página 2)
    const fadeStart = 0.25;
    const fadeEnd = 0.50;
    const fadeRange = fadeEnd - fadeStart;

    // Calculamos el progreso del fade dentro del rango definido
    const fadeProgress = THREE.MathUtils.clamp(
      (scroll.offset - fadeStart) / fadeRange,
      0, 
      1
    );

    // 3. APLICAR OPACIDAD:
    const opacity = 1 - fadeProgress; // 1 (opaco) -> 0 (transparente)
    
    // Recorrer todos los materiales y aplicar la opacidad
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material.transparent) {
        child.material.opacity = opacity;
        // La escala y posición también se pueden vincular a fadeProgress
        const scaleFactor = 1 - (fadeProgress * 0.3);
        groupRef.current.scale.set(scaleFactor * 1.5, scaleFactor * 1.5, scaleFactor * 1.5);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 4. Controles de Cámara (Solo en la Sección 1, deshabilitados al scrollear) */}
      <OrbitControls 
        enabled={scroll.offset < 0.2} // Deshabilita los controles de usuario si no está en la primera vista
        enableDamping 
        dampingFactor={0.05} 
      />
      
      {/* Pasar la lógica de clic y los datos al componente base */}
      <EstatuaMetalica onHotspotClick={toggleHotspot} HOTSPOT_DATA={HOTSPOT_DATA} />
    </group>
  );
}
🚀 Paso Final: Componente Orquestador y HTML
Solo queda armar el contenedor principal y el contenido HTML que se desliza.

1. App.jsx (Orquestador)
JavaScript

// /frontend/src/App.jsx
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { EstatuaAnimada } from './models/EstatuaAnimada';
import { ScrollContent } from './components/ScrollContent';
import { Suspense } from 'react';

export default function App() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 40 }} 
      style={{ background: '#ffffff' }}
    >
      <Suspense fallback={null}>
        {/* ScrollControls: Define 4 secciones verticales */}
        <ScrollControls pages={4} damping={0.1}> 
          
          {/* El 3D animado */}
          <EstatuaAnimada />
          
          {/* El Contenido HTML superpuesto */}
          <Scroll html>
            <ScrollContent />
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
2. ScrollContent.jsx (Las Tarjetas con Transparencia)
Aquí es donde usas la lógica de negocio y aplicas los estilos de transparencia.

JavaScript

// /frontend/src/components/ScrollContent.jsx
import React from 'react';
import { useHotspotState } from '../logic/useHotspotState';

// 💡 Nota: Asegúrate de tener CSS para las clases '.scroll-section' y '.hotspot-card'
// con las propiedades de blur y transparencia que definimos.

export function ScrollContent() {
  const { activeHotspotId, HOTSPOT_DATA } = useHotspotState();

  // Función para obtener los datos de la tarjeta activa
  const getCardContent = (id) => HOTSPOT_DATA.find(d => d.id === id);

  return (
    <div className="content-wrapper" style={{ padding: '0 10vw' }}>

      {/* SECCIÓN 1: Hero (La estatua es visible y rota) */}
      <div className="scroll-section hero-section">
        <h1 style={{ color: 'black', fontSize: '4em', marginTop: '15vh' }}>
          EXPLORACIÓN DE FLORE
        </h1>
        <p style={{ color: 'black', fontSize: '1.2em' }}>
          Gira para explorar la escultura o desplázate para la narrativa histórica.
        </p>
      </div>

      {/* SECCIÓN 2: Hotspot 1 (Aparece mientras la estatua se difumina) */}
      <div className="scroll-section">
        <Card data={getCardContent(1)} isVisible={activeHotspotId === 1} position="top-right" />
      </div>

      {/* SECCIÓN 3: Hotspot 2 */}
      <div className="scroll-section">
        <Card data={getCardContent(2)} isVisible={activeHotspotId === 2} position="center-left" />
      </div>

      {/* SECCIÓN 4: Hotspot 3 */}
      <div className="scroll-section">
        <Card data={getCardContent(3)} isVisible={activeHotspotId === 3} position="bottom-right" />
      </div>

    </div>
  );
}

// Componente simple de Tarjeta con efecto de transparencia (Backdrop-filter)
const Card = ({ data, isVisible, position }) => (
  <div 
    className={`hotspot-card ${position}`} 
    style={{
      opacity: isVisible ? 1 : 0.5, // Resalta la tarjeta activa
      transition: 'opacity 0.5s',
      // Estilos para el efecto de "vidrio esmerilado"
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      padding: '30px',
      borderRadius: '10px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      color: 'black',
      margin: '20vh 0', // Espaciado para que se vean en el scroll
    }}
  >
    {data ? (
      <>
        <h3>{data.title}</h3>
        <p>{data.text}</p>
      </>
    ) : (
      <h3>Haz click en un punto de la estatua o continúa explorando.</h3>
    )}
  </div>
);
✅ El Resultado Final:
Tienes una arquitectura completa donde:

Modelo y Metal: EstatuaMetalica.jsx carga tu modelo flore.glb y le da un aspecto metálico.

Lógica: useHotspotState.js maneja toda la data y el estado de los hotspots.

Animación: EstatuaAnimada.jsx vincula el scroll a la opacidad, la escala y la rotación del 3D, creando el efecto de difuminado narrativo.

UI: ScrollContent.jsx muestra las tarjetas con el efecto de transparencia (backdrop-filter) y reacciona a los clics detectados por el 3D.

¡Hemos cubierto todos los detalles! ¿Necesitas ayuda con el CSS básico para las clases .scroll-section y .hotspot-card o prefieres centrarte en la implementación del código?