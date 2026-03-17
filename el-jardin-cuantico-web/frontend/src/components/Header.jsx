import React from 'react';

export default function Header() {
    return (
        <header style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            padding: '2rem',
            zIndex: 10,
            pointerEvents: 'none', // Permite hacer clic a través del header
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.1em' }}>

            </h1>
            <nav style={{ pointerEvents: 'auto' }}>
                <a href="#" style={{ color: 'white', textDecoration: 'none', marginLeft: '2rem' }}>About</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none', marginLeft: '2rem' }}>Gallery</a>
            </nav>
        </header>
    );
}
