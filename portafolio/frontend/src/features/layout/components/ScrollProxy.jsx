import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

/**
 * ScrollProxy — Lives INSIDE the R3F Canvas within <ScrollControls>.
 * Reads the Drei scroll offset every frame and writes it to a shared ref.
 * This allows DOM-side components (CurtainBackground) to consume the
 * same scroll progress without prop-drilling or manual rAF.
 *
 * Renders nothing — zero impact on the scene graph.
 */
export default function ScrollProxy({ progressRef }) {
  const scroll = useScroll();

  useFrame(() => {
    if (progressRef?.current !== undefined) {
      progressRef.current = scroll.offset;
    }
  });

  return null;
}
