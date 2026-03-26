---
description: Agregar un panel de control 3D (Debug) con Leva
---

# Añadir un Panel de Control 3D con Leva

Este flujo describe cómo inyectar rápidamente un panel de control en tiempo real (estilo Roblox Studio) para ajustar posiciones, rotaciones, escalas y otras propiedades de objetos 3D en React Three Fiber.

## 1. Instalar dependencias
Si no está instalado, agregar `leva` al proyecto:
```bash
npm install leva
```

## 2. Crear el componente `DebugPanel.jsx`
Crear un archivo (ej. `src/features/experience/components/DebugPanel.jsx`) que exporte los hooks de control:

```jsx
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
```

## 3. Integrar el panel fuera del Canvas
En tu archivo principal (ej. `App.jsx`), asegúrate de montar `<LevaPanel />` **fuera** de la etiqueta `<Canvas>`.

```jsx
import { LevaPanel } from './features/experience/components/DebugPanel';

function App() {
  return (
    <main>
      <LevaPanel />
      <Canvas>
        {/* Tu escena 3D aquí */}
      </Canvas>
    </main>
  );
}
```

## 4. Consumir el hook en tu modelo 3D
Dentro del componente que renderiza el modelo 3D, llama al hook para obtener los valores reactivos y aplícalos al objeto con `useFrame` o directamente en las props:

```jsx
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useObjectControls } from './DebugPanel';

export default function MiModelo() {
    const ref = useRef();
    const ctrl = useObjectControls('Cubo Mágico', { posX: 0, posY: 0, posZ: 0, scale: 1 });

    useFrame(() => {
        if (ref.current) {
            ref.current.position.set(ctrl.posX, ctrl.posY, ctrl.posZ);
            ref.current.rotation.set(
                THREE.MathUtils.degToRad(ctrl.rotX),
                THREE.MathUtils.degToRad(ctrl.rotY),
                THREE.MathUtils.degToRad(ctrl.rotZ)
            );
            ref.current.scale.setScalar(ctrl.escala);
        }
    });

    return (
        <group ref={ref}>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
        </group>
    );
}
```

## 5. Limpieza (Post-ajuste)
Una vez que hayas anotado los valores ideales, hardcodealos en los componentes `ref.current.position.set(...)`, borra el hook de `leva`, y elimina `<LevaPanel />` de la vista para optimizar la app en producción.
