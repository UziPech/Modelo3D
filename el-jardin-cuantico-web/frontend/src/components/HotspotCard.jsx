import React from 'react';

export default function HotspotCard({ data, onClose }) {
    if (!data) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 20,
            backdropFilter: 'blur(10px)'
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                }}
            >
                ×
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>{data.title}</h2>
            <p style={{ lineHeight: 1.6, color: '#555' }}>{data.text}</p>
        </div>
    );
}
