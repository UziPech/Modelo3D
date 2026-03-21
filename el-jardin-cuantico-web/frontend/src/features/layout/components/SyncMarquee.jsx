import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

/**
 * ScrollBridge - Componente que vive DENTRO del Canvas R3F.
 * Solo lee el scroll offset y lo escribe en un ref externo.
 * NO renderiza nada visual (retorna null).
 */
export function ScrollBridge({ scrollRef }) {
  const scroll = useScroll();

  useFrame(() => {
    if (scrollRef?.current !== undefined) {
      scrollRef.current = scroll.offset;
    }
  });

  return null; // No renderiza NADA en el árbol R3F
}
