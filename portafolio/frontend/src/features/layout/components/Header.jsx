import React from 'react';

export default function Header() {
    return (
        <header className="main-header">
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.1em' }}>
                {/* Posible logotipo temporalmente vacío */}
            </h1>
            <nav className="nav-links">
                <a href="#" className="nav-link">About</a>
                <a href="#" className="nav-link">Gallery</a>
            </nav>
        </header>
    );
}
