import React from 'react';
import { useControls, folder, Leva } from 'leva';

export function useObjectControls(name, defaults) {
    return useControls(name, {
        position: folder({
            posX: { value: defaults.posX || 0, min: -20, max: 20, step: 0.1, label: 'X' },
            posY: { value: defaults.posY || 0, min: -20, max: 20, step: 0.1, label: 'Y' },
            posZ: { value: defaults.posZ || 0, min: -20, max: 20, step: 0.1, label: 'Z' },
        }),
        rotation: folder({
            rotX: { value: defaults.rotX || 0, min: -180, max: 180, step: 1, label: 'Rot X°' },
            rotY: { value: defaults.rotY || 0, min: -180, max: 180, step: 1, label: 'Rot Y°' },
            rotZ: { value: defaults.rotZ || 0, min: -180, max: 180, step: 1, label: 'Rot Z°' },
        }),
        scale: folder({
            escala: { value: defaults.scale || 1, min: 0.1, max: 20, step: 0.1, label: 'Escala' },
        })
    });
}

export function LevaPanel() {
    return <Leva collapsed={false} fill={false} drag={true} titleBar={{ title: '🛠️ Propiedades 3D' }} />;
}
