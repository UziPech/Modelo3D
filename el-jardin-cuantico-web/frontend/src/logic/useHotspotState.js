import { useState, useMemo, useCallback } from 'react';

// 1. DEFINICIÓN DE LA LÓGICA DE NEGOCIO (HOTSPOT DATA)
// Estos datos son la "información de negocio" que el 3D y el HTML deben mostrar.
export const HOTSPOT_DATA = [
    // ID 1: Flores y Corona (Parte Superior)
    {
        id: 1,
        title: "La Polifonía de la Polícroma",
        text: "El tocado de flores revela un secreto largamente olvidado: las esculturas griegas y romanas estaban ricamente pintadas. El análisis UV muestra rastros de pigmentos ocres y azules, recreando la vibrante apariencia original de Flore.",
        cameraTarget: [0.5, 2.5, 0.2] // Posición de enfoque 3D
    },
    // ID 2: Manto Drapeado (Parte Central)
    {
        id: 2,
        title: "El Virtuosismo del Paño Mojado",
        text: "Esta técnica de \"paño mojado\" (Wet Drapery), popularizada por escultores clásicos, requería una maestría inigualable. El estudio digital del draping nos permite simular con precisión cómo las túnicas caerían sobre el cuerpo, resaltando la forma sinuosas.",
        cameraTarget: [0.0, 0.5, 0.1]
    },
    // ID 3: Base y Roca (Parte Inferior)
    {
        id: 3,
        title: "Identidad y Contexto",
        text: "Las bases a menudo contenían la firma del artista y el contexto histórico, cruciales para datar la obra. La roca es un punto de equilibrio camuflado y una firma estilística que varía según la escuela de escultura (Ateniense, Romana o Helenística).",
        cameraTarget: [0.1, -1.5, 0.3]
    }
];

/**
 * @function useHotspotState
 * @description Custom Hook para gestionar el estado del Hotspot activo y proveer sus datos asociados.
 * Centraliza la lógica de negocio para la interactividad.
 */
export const useHotspotState = () => {
    const [activeHotspotId, setActiveHotspotId] = useState(null);

    // Mapea el ID activo a los datos completos del Hotspot
    const activeHotspotData = useMemo(() => {
        return HOTSPOT_DATA.find(data => data.id === activeHotspotId) || null;
    }, [activeHotspotId]);

    // Función para alternar el estado (activar/desactivar el hotspot)
    const toggleHotspot = useCallback((id) => {
        setActiveHotspotId(prevId => (prevId === id ? null : id));
    }, []);

    return {
        HOTSPOT_DATA, // Exponemos toda la data para renderizar los botones 3D
        activeHotspotId,
        activeHotspotData,
        setActiveHotspotId,
        toggleHotspot // Una forma sencilla de activar/desactivar
    };
};
