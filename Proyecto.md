1. Documentación del Diseño de Arquitectura
Comenzaremos definiendo la estructura de carpetas y la pila tecnológica, tal como lo solicitaste.

A. Estructura de Carpetas
La siguiente estructura separa claramente el Frontend (React Three Fiber) de cualquier posible Backend (aunque actualmente solo es un proyecto frontend, es bueno dejar la estructura):

/el-jardin-cuantico-web
├── /backend
│   └── (Aquí iría Node.js, Python, o cualquier API)
│
├── /frontend
│   ├── /public
│   │   ├── flore.glb         <-- ¡Tu modelo va aquí!
│   │   └── textures/
│   │
│   ├── /src
│   │   ├── /components       <-- Componentes React/HTML
│   │   │   ├── ScrollContent.jsx
│   │   │   ├── HotspotCard.jsx
│   │   │   └── Header.jsx
│   │   │
│   │   ├── /models           <-- Componentes 3D (R3F)
│   │   │   ├── EstatuaAnimada.jsx    <-- Lógica de Scroll
│   │   │   └── EstatuaMetalica.jsx   <-- Modelo y Material
│   │   │
│   │   ├── /logic            <-- Lógica de negocio (estados, constantes)
│   │   │   └── useHotspotState.js
│   │   │
│   │   ├── App.jsx           <-- Orquestador principal (Canvas y ScrollControls)
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
💡 2. Prompt con Documentación (Parte 1)
El siguiente prompt se centra en la lógica de negocio principal: cómo se gestiona la interacción entre los clics en el 3D y el contenido HTML, separándola del renderizado.

Instrucción para el Desarrollo de la Lógica Central
Necesito que documentes y crees el código para el archivo /frontend/src/logic/useHotspotState.js.

Objetivo: Crear un Custom Hook de React para gestionar el estado de los hotspots activos y centralizar la información. Esta es nuestra lógica de negocio.

Requisitos para el Código y la Documentación:

Función: useHotspotState(). Debe devolver el estado del hotspot activo (activeHotspotId), una función para activarlo (setActiveHotspotId), y los datos del hotspot (título, texto).

Estructura de Datos: Define un array de constantes, HOTSPOT_DATA, que contenga la información de las 3 secciones interactivas de tu estatua ("Flore").

Documentación (Comentarios): Incluye comentarios detallados sobre el propósito de la lógica, cómo se usa el hook (useState, useCallback), y cómo se mapean los IDs a la data.

Código Solicitado
Prompt para el Modelo:

Tarea: Implementar la lógica de negocio central del proyecto "Estatua Clásica" en React.

Ruta: /frontend/src/logic/useHotspotState.js

Tecnología: React Custom Hook.

JavaScript

import { useState, useMemo, useCallback } from 'react';
// 1. DEFINICIÓN DE LA LÓGICA DE NEGOCIO (HOTSPOT DATA) // Estos datos son la "información de negocio" que el 3D y el HTML deben mostrar. const HOTSPOT_DATA = [ // ID 1: Flores y Corona (Parte Superior) { id: 1, title: "Ofrenda de la Primavera", text: "El tocado de flores simboliza la deidad romana Flore, diosa de las flores, los jardines y la primavera. El estilo del drapeado es característico del período helenístico tardío.", cameraTarget: [0.5, 2.5, 0.2] // Posición de enfoque 3D }, // ID 2: Manto Drapeado (Parte Central) { id: 2, title: "El Velo Mojado (Wet Drapery)", text: "La técnica del 'paño mojado' fue popularizada por Fídias, creando un efecto ilusorio de ligereza y movimiento en la tela. Este detalle demuestra el virtuosismo del escultor.", cameraTarget: [0.0, 0.5, 0.1] }, // ID 3: Base y Roca (Parte Inferior) { id: 3, title: "Soporte y Firma", text: "La estatua original solía incluir firmas o dedicatorias en la base. La roca es un soporte estructural que a menudo se integraba en la narrativa visual, camuflando el punto de equilibrio.", cameraTarget: [0.1, -1.5, 0.3] } ];

/**

@function useHotspotState

@description Custom Hook para gestionar el estado del Hotspot activo y proveer sus datos asociados.

Centraliza la lógica de negocio para la interactividad. */ export const useHotspotState = () => { const [activeHotspotId, setActiveHotspotId] = useState(null);

// Mapea el ID activo a los datos completos del Hotspot const activeHotspotData = useMemo(() => { return HOTSPOT_DATA.find(data => data.id === activeHotspotId) || null; }, [activeHotspotId]);

// Función para alternar el estado (activar/desactivar el hotspot) const toggleHotspot = useCallback((id) => { setActiveHotspotId(prevId => (prevId === id ? null : id)); }, []);

return { HOTSPOT_DATA, // Exponemos toda la data para renderizar los botones 3D activeHotspotId, activeHotspotData, setActiveHotspotId, toggleHotspot // Una forma sencilla de activar/desactivar }; };
