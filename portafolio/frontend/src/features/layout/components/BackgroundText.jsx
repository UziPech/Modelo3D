import React from 'react';

/**
 * BackgroundText — Massive typography that sits BEHIND everything.
 *
 * z-index: -2   (behind FloatingModels at -1, behind CurtainBackground at 0)
 *
 * It is fully revealed when the CurtainBackground clip-path drops.
 * The user prefers the text to be statically present "antes de hacer scrolling" 
 * so when the curtain falls, it's already there in its majestic position.
 */
export default function BackgroundText() {
  return (
    <div className="background-text" style={{ 
      opacity: 1, 
      transform: 'translateY(0)', 
      willChange: 'auto' // No longer animating, better performance
    }}>
      <h2 className="background-text__heading">
        INNOVA,<br />
        CONSTRUYE CONMIGO,<br />
        DESCUBRE EL VALOR.
      </h2>
    </div>
  );
}
