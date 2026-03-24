import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Hud, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/* ────────────────────────────────────────────
 * GitHub icon as a simplified SVG-like path
 * drawn on a 2D canvas for the CanvasTexture.
 * ──────────────────────────────────────────── */
/* ────────────────────────────────────────────
 * Build offscreen CanvasTexture with pill BG,
 * custom avatar image and "UziPech" text.
 * ──────────────────────────────────────────── */
function createPillTexture() {
  const w = 512;
  const h = 192;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // ── Rounded-rect background ──
  const r = h / 2; // pill radius
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.arcTo(w, 0, w, r, r);
  ctx.arcTo(w, h, w - r, h, r);
  ctx.lineTo(r, h);
  ctx.arcTo(0, h, 0, h - r, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.fill();

  // ── Subtle border ──
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ── Avatar Placeholder ──
  ctx.save();
  ctx.fillStyle = '#222222';
  ctx.beginPath();
  // Centramos horizontalmente a 96 (radio del pill = 192/2) y reducimos radio a 50
  ctx.arc(96, h / 2, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── Async Image Loading ──
  const img = new window.Image();
  img.src = '/assets/images/perfile.jpg'; // Apuntando a la nueva imagen de perfil
  img.crossOrigin = 'anonymous';
  
  img.onerror = () => {
    console.warn("No se pudo cargar la imagen en /assets/images/perfile.jpg. Verifica su existencia y extensión.");
  };

  img.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(96, h / 2, 50, 0, Math.PI * 2);
    ctx.clip(); // Aplicar máscara circular
    // Dibujamos la imagen exactamente en el recuadro que enmarca el círculo centrada
    ctx.drawImage(img, 96 - 50, h / 2 - 50, 100, 100);
    ctx.restore();
    tex.needsUpdate = true;
  };

  // ── Text ──
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 64px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('UziPech', 175, h / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ────────────────────────────────────────────
 * GLSL Vertex Shader
 * Deforms vertices toward u_mouse with organic
 * noise peaks, scaled by u_hover (0→1).
 * ──────────────────────────────────────────── */
const vertexShader = /* glsl */ `
  uniform vec2  u_mouse;
  uniform float u_time;
  uniform float u_hover;
  uniform float u_scale;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Distance from vertex to mouse position (in local XY)
    float dist = distance(pos.xy, u_mouse);
    // Reducción del radio geométrico para recuperar el efecto de bulto local asintótico, 0.375 coincide con la nueva proporción 0.9 width
    float radius = 0.38 * u_scale; 

    // Organic noise (frecuencia se adapta inversamente al scale y amplitud directamente)
    float noise = sin(pos.x * (16.0 / u_scale) + u_time * 2.0) * cos(pos.y * (12.0 / u_scale) + u_time * 1.5) * 0.03 * u_scale;

    // Attraction factor
    float influence = smoothstep(radius, 0.0, dist) * u_hover;

    // Displace in XY
    vec2 dir = normalize(u_mouse - pos.xy + 0.001);
    pos.xy += dir * influence * 0.06 * u_scale;

    // Z displacement 
    pos.z += influence * 0.12 * u_scale + noise * u_hover;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/* ────────────────────────────────────────────
 * GLSL Fragment Shader
 * Samples the CanvasTexture with alpha.
 * ──────────────────────────────────────────── */
const fragmentShader = /* glsl */ `
  uniform sampler2D u_texture;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(u_texture, vUv);
    if (texColor.a < 0.01) discard;
    gl_FragColor = texColor;
  }
`;

/* ════════════════════════════════════════════
 * MatterPillMesh — R3F 3D pill with vertex deformation
 *
 * Renders a subdivided PlaneGeometry textured with
 * a CanvasTexture pill, deformed by a custom shader
 * that reacts to mouse hover. Ocupa viewport local del HUD.
 * ════════════════════════════════════════════ */
function MatterPillMesh() {
  const meshRef = useRef();
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  const targetMouse = useRef(new THREE.Vector2(0, 0));

  // ── Texture (memoised once) ──
  const texture = useMemo(() => createPillTexture(), []);

  // ── Shader uniforms (stable ref) ──
  const uniforms = useMemo(
    () => ({
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_time: { value: 0 },
      u_hover: { value: 0 },
      u_scale: { value: 1.0 },
      u_texture: { value: texture },
    }),
    [texture]
  );

  // ── Cómputo Responsivo de Escala y Tamaño ──
  const baseWidth = 0.9; // Tamaño base ligeramente más pequeño para no verse ruidoso/gigante
  const baseHeight = baseWidth / 2.75; 
  
  // En mobile (viewport.width más pequeño), reduciremos dinámicamente el tamaño
  // Restauramos la fórmula dinámica original para recuperar la responsividad y el efecto a diferentes anchos
  const responsiveScale = Math.min(1.3, Math.max(0.65, viewport.width * 0.15));
  
  const width = baseWidth * responsiveScale;
  const height = baseHeight * responsiveScale;

  // ── Position: fixed top-left in camera space ──
  const position = useMemo(() => {
    // Escalar dinámicamente también su anclaje a la izquierda, conservando márgenes consistentes
    // Un margen más amplio para despegarlo del borde izquierdo y que no se corte
    const marginX = 1.0 * responsiveScale; // Mayor margen horizontal para evitar corte
    const marginY = 0.45 * responsiveScale; // Mantener margen vertical original
    const x = -viewport.width / 2 + (width / 2) + marginX; 
    const y = viewport.height / 2 - (height / 2) - marginY; 
    return [x, y, 0];
  }, [viewport.width, viewport.height, width, height, responsiveScale]);

  // ── Per-frame uniform updates ──
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material;

    // Uniformes básicos
    mat.uniforms.u_time.value += delta;
    mat.uniforms.u_scale.value = responsiveScale; // Informar al shader sobre la escala dinámica

    // Smooth hover lerp (0→1 on hover, 1→0 on leave)
    const target = hovered ? 1 : 0;
    mat.uniforms.u_hover.value = THREE.MathUtils.lerp(
      mat.uniforms.u_hover.value,
      target,
      delta * 6
    );

    // Atracción magnética basada en evento exacto
    if (hovered) {
      mat.uniforms.u_mouse.value.lerp(targetMouse.current, delta * 15);
    }
  });

  // ── Interaction handlers ──
  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (meshRef.current && hovered) {
      // Usamos el punto de intersección exacto del HUD para gravedad perfecta
      const localPoint = meshRef.current.worldToLocal(e.point.clone());
      targetMouse.current.set(localPoint.x, localPoint.y);
    }
  }, [hovered]);

  const handleClick = useCallback(() => {
    window.open('https://github.com/UziPech', '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      renderOrder={100} // Prioridad sobre otros elementos del HUD si los hubiera
    >
      <planeGeometry args={[width, height, 64, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false} // Siempre dibujar encima del resto de la escena principal
        depthWrite={false}
      />
    </mesh>
  );
}

/* Envolvemos en un HUD para que quede anclado a la pantalla y sin heredar rotaciones de la escena */
export default function MatterPill() {
  return (
    <Hud renderPriority={2}>
      {/* Misma configuración de la cámara principal para mantener proporciones fov={40} position={[0,0,8]} */}
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      <MatterPillMesh />
    </Hud>
  );
}
