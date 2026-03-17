import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  SiReact,
  SiNextdotjs,
  SiFlutter,
  SiRust,
  SiSupabase,
  SiTailwindcss,
  SiNodedotjs
} from 'react-icons/si';

import './Marquee.css';

const Marquee = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const techData = [
    { name: 'React', icon: <SiReact /> },
    { name: 'Next.js', icon: <SiNextdotjs /> },
    { name: 'Flutter', icon: <SiFlutter /> },
    { name: 'Rust', icon: <SiRust /> },
    { name: 'Supabase', icon: <SiSupabase /> },
    { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
    { name: 'Node.js', icon: <SiNodedotjs /> },
  ];

  // Triplicamos para suavizar más el bucle si es necesario
  const displayData = [...techData, ...techData, ...techData];

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    // Asegurar que el layout esté listo antes de medir
    requestAnimationFrame(() => {
      // Calculamos el ancho exacto del contenido original (1 tercio del total)
      const totalWidth = track.scrollWidth / 3;

      gsap.to(track, {
        x: -totalWidth,
        duration: 20, // Un poco más lento para suavidad
        ease: 'linear', // 'linear' es mejor que 'none' en versiones recientes, aunque son sinónimos
        repeat: -1,
      });
    });
  }, { scope: containerRef });

  return (
    <div className="marquee-container" ref={containerRef}>
      <div className="marquee-track" ref={trackRef}>
        {displayData.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`marquee-card ${isEven ? 'dark' : 'light'}`}
            >
              <div className="marquee-icon">
                {item.icon}
              </div>
              <div className="marquee-text">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marquee;
