import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ────────────────────────────────────────────
 * GitHub icon as a simplified SVG-like path
 * drawn on a 2D canvas for the CanvasTexture.
 * ──────────────────────────────────────────── */
function drawGitHubIcon(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);

  // Simplified GitHub octocat mark (circle + cat silhouette)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(12, 12, 10, 0, Math.PI * 2);
  ctx.fill();

  // Inner dark shape
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(12, 12, 8.5, 0, Math.PI * 2);
  ctx.fill();

  // Cat face
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  // Body
  ctx.arc(12, 13, 5, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(12, 8.5, 4, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.moveTo(8.5, 5);
  ctx.lineTo(7, 2.5);
  ctx.lineTo(10, 5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(15.5, 5);
  ctx.lineTo(17, 2.5);
  ctx.lineTo(14, 5);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(10.5, 8.5, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(13.5, 8.5, 0.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/* ────────────────────────────────────────────
 * Build offscreen CanvasTexture with pill BG,
 * GitHub icon and "UziPech" text.
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

  // ── GitHub icon ──
  drawGitHubIcon(ctx, 50, 52, 80);

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

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Distance from vertex to mouse position (in local XY)
    float dist = distance(pos.xy, u_mouse);
    float radius = 0.8;

    // Organic noise: simple sin-based displacement
    float noise = sin(pos.x * 8.0 + u_time * 2.0) * cos(pos.y * 6.0 + u_time * 1.5) * 0.04;

    // Attraction factor — closer vertices get pulled more
    float influence = smoothstep(radius, 0.0, dist) * u_hover;

    // Displace toward mouse in XY (subtle pull)
    vec2 dir = normalize(u_mouse - pos.xy + 0.001);
    pos.xy += dir * influence * 0.08;

    // Z displacement: organic peaks + mouse attraction
    pos.z += influence * 0.15 + noise * u_hover;

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
 * MatterPill — R3F 3D pill with vertex deformation
 *
 * Renders a subdivided PlaneGeometry textured with
 * a CanvasTexture pill, deformed by a custom shader
 * that reacts to mouse hover.
 * ════════════════════════════════════════════ */
export default function MatterPill() {
  const meshRef = useRef();
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);

  // ── Texture (memoised once) ──
  const texture = useMemo(() => createPillTexture(), []);

  // ── Shader uniforms (stable ref) ──
  const uniforms = useMemo(
    () => ({
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_time: { value: 0 },
      u_hover: { value: 0 },
      u_texture: { value: texture },
    }),
    [texture]
  );

  // ── Position: fixed top-left in camera space ──
  const position = useMemo(() => {
    const x = -viewport.width / 2 + 1.3;
    const y = viewport.height / 2 - 0.5;
    return [x, y, 0];
  }, [viewport.width, viewport.height]);

  // ── Per-frame uniform updates ──
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material;

    // Time
    mat.uniforms.u_time.value += delta;

    // Smooth hover lerp (0→1 on hover, 1→0 on leave)
    const target = hovered ? 1 : 0;
    mat.uniforms.u_hover.value = THREE.MathUtils.lerp(
      mat.uniforms.u_hover.value,
      target,
      delta * 6
    );

    // Mouse → local coordinates on the pill plane
    if (hovered) {
      const pointer = state.pointer; // normalised [-1, 1]
      const worldX = (pointer.x * viewport.width) / 2;
      const worldY = (pointer.y * viewport.height) / 2;
      // Convert to local space of the pill
      const localX = worldX - position[0];
      const localY = worldY - position[1];
      mat.uniforms.u_mouse.value.set(localX, localY);
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

  const handleClick = useCallback(() => {
    window.open('https://github.com/UziPech', '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <planeGeometry args={[2.2, 0.8, 64, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
