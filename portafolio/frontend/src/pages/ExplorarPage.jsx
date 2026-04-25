import React from 'react';
import { Link } from 'react-router-dom';
import SpriteExperience from '../features/experience/components/SpriteExperience';
import './ExplorarPage.css';

/**
 * ExplorarPage — full-page sprite-sheet experience.
 * Using native scroll to ensure 0ms input lag and instant scrub interaction.
 */
export default function ExplorarPage() {
  return (
    <div className="explorar-page">
      {/* Back button */}
      <Link to="/" className="awwwards-back-btn" aria-label="Volver al inicio">
        <span className="back-arrow">←</span>
        <span className="back-text">VOLVER</span>
      </Link>

      <SpriteExperience />
    </div>
  );
}
