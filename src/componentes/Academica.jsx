import React from 'react';

export default function Academica() {
  return (
    <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', color: '#f8fafc' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Capacidades Académicas y Aptitudes</h2>
        <p style={{ color: '#94a3b8' }}>Formación profesional y competencias clave en desarrollo</p>
      </div>

      <div style={{
        backgroundColor: '#1e1b3a',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        borderRadius: '16px',
        padding: '30px',
        borderLeft: '4px solid #8b5cf6'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#38bdf8' }}>
            Ingeniería de Software
          </h3>
          <span style={{
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            color: '#38bdf8',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            En curso / Nivel Avanzado
          </span>
        </div>

        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
          Institución Académica Superior
        </p>

        <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Áreas de Dominio Técnico:</h4>
        <ul style={{
          listStyleType: 'none',
          paddingLeft: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
          marginBottom: '30px'
        }}>
          {[
            "Algoritmos y Estructuras de Datos",
            "Bases de Datos Relacionales y Modelado SQL",
            "Desarrollo Web Frontend (React / Vite)",
            "Métodos y Análisis Numérico"
          ].map((competencia, index) => (
            <li key={index} style={{
              backgroundColor: '#120e24',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#94a3b8',
              border: '1px solid rgba(148, 163, 184, 0.1)'
            }}>
              ✓ {competencia}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}