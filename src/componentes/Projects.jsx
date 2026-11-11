import React, { useState } from 'react';

export default function Projects() {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const proyectos = [
    {
      id: 'stackfolio',
      titulo: 'STACKFOLIO // CYBER AUTH',
      categoria: 'frontend',
      tagline: 'Sistema de autenticación y portafolio modular neón.',
      descripcion: 'Plataforma web desacoplada con animaciones en canvas de Matrix digital y guardián felino programado puramente en vectores SVG.',
      tech: ['React', 'Vite', 'JavaScript', 'SVG Vectorial', 'CSS3'],
      metricas: { Renderizado: '60 FPS', Componentes: '12 React UI', Estado: '100% Modulado' },
      detalles: 'Implementa lógica de validación de campos en tiempo real, cambio dinámico de visibilidad de credenciales y estados interactivos visuales.',
      destacado: true
    },
    {
      id: 'saltavet',
      titulo: 'SGA-SALTAVET',
      categoria: 'fullstack',
      tagline: 'Plataforma de gestión y telemetría administrativa.',
      descripcion: 'Dashboard institucional diseñado para el control de flujos de datos, gestión de módulos y optimización de arquitectura frontend.',
      tech: ['React', 'Tailwind CSS', 'DataTables', 'Git/GitHub'],
      metricas: { Módulos: '8 Vistas', Arquitectura: 'Frontend / REST', Cobertura: 'Alta' },
      detalles: 'Desarrollo en equipo con especificación completa de requerimientos técnicos, capex/opex y prototipado estructural.',
      destacado: true
    },
    {
      id: 'matrix-engine',
      titulo: 'NEON CANVAS ENGINE',
      categoria: 'engine',
      tagline: 'Motor de renderizado visual de lluvia digital.',
      descripcion: 'Componente ligero sobre HTML5 Canvas que genera efectos de lluvia de caracteres neón optimizado para no consumir recursos excesivos de CPU.',
      tech: ['JavaScript ES6+', 'HTML5 Canvas', 'Performance API'],
      metricas: { Uso_CPU: '< 2%', Memoria: '3.4 MB', Latencia: '0ms' },
      detalles: 'Calcula columnas dinámicas según la resolución de pantalla del cliente y reutiliza buffers de dibujo.',
      destacado: false
    },
    {
      id: 'parcial-l4',
      titulo: 'PARCIAL L4 // VALIDATOR',
      categoria: 'frontend',
      tagline: 'Módulo de registro con restricciones de alta seguridad.',
      descripcion: 'Aplicación cliente con reglas de validación en tiempo real, indicadores de longitud de cadena y restricción estricta de 8 caracteres.',
      tech: ['React', 'Vite', 'State Hooks', 'CSS Modules'],
      metricas: { Validación: 'Strict 8-Char', Feedback: 'Realtime', Error_Rate: '0%' },
      detalles: 'Diseñado bajo la especificación exacta de requisitos cliente con feedback inmediato al usuario sobre errores de formato.',
      destacado: false
    },
    {
      id: 'calculus-viz',
      titulo: 'ADVANCED CALCULUS VIZ',
      categoria: 'engine',
      tagline: 'Visualizador matemático para cálculo avanzado.',
      descripcion: 'Herramienta gráfica interactiva desarrollada para simular ecuaciones diferenciales y curvas de nivel en entorno web.',
      tech: ['JavaScript', 'Canvas 2D', 'MathFX', 'CSS Grid'],
      metricas: { Precisión: 'Float64', Algoritmo: 'Runge-Kutta', Render: 'Vectorial' },
      detalles: 'Permite ingresar coeficientes de funciones diferenciales y renderizar gráficos de dispersión con cálculo de derivadas.',
      destacado: false
    },
    {
      id: 'trail-tracker',
      titulo: 'SPORTS & METRICS DASHBOARD',
      categoria: 'fullstack',
      tagline: 'Telemetría de rendimiento físico y carreras 42K.',
      descripcion: 'Panel de seguimiento y analítica de datos atléticos para el registro de tiempos, altimetría y mapa de rutas de trail running.',
      tech: ['React', 'ChartJS', 'Tailwind CSS', 'REST API'],
      metricas: { Distancia: '42K Marathon', Telemetría: 'GPS Data', Sync: 'Auto' },
      detalles: 'Visualización de datos de elevación y frecuencia cardíaca sincronizados con rutas de montaña.',
      destacado: false
    }
  ];

  const proyectosFiltrados = categoriaActiva === 'todos' 
    ? proyectos 
    : proyectos.filter(p => p.categoria === categoriaActiva);

  return (
    <section style={{
      backgroundColor: '#030a16',
      minHeight: '100vh',
      padding: '40px 20px',
      color: '#00f3ff',
      fontFamily: 'monospace, sans-serif'
    }}>
      <style>{`
        .card-project {
          background: rgba(4, 18, 38, 0.85);
          border: 1px solid rgba(0, 243, 255, 0.25);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card-project:hover {
          transform: translateY(-6px);
          border-color: #00f3ff;
          box-shadow: 0 0 25px rgba(0, 243, 255, 0.3);
        }
        .filter-btn {
          background: transparent;
          border: 1px solid rgba(0, 243, 255, 0.4);
          color: #00f3ff;
          padding: 8px 18px;
          border-radius: 6px;
          font-family: monospace;
          cursor: pointer;
          font-weight: bold;
          font-size: 0.85rem;
          letter-spacing: 1px;
          transition: all 0.2s ease;
        }
        .filter-btn.active, .filter-btn:hover {
          background: #00f3ff;
          color: #030a16;
          box-shadow: 0 0 15px #00f3ff;
        }
      `}</style>

      {/* ENCABEZADO DE ALTO IMPACTO (HERO SHOWCASE) */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 40px auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(0, 243, 255, 0.1)',
          border: '1px solid #00f3ff',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          letterSpacing: '2px',
          marginBottom: '15px'
        }}>
          // INGENIERÍA INFORMÁTICA - UCASAL //
        </div>

        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '900',
          letterSpacing: '4px',
          color: '#00f3ff',
          textShadow: '0 0 20px rgba(0, 243, 255, 0.6)',
          margin: '0 0 10px 0'
        }}>
          [ PORTAFOLIO PROFESIONAL ]
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Desarrollo de software frontend, arquitectura de componentes modulares y sistemas con estética Cyberpunk de alta densidad visual.
        </p>

        {/* METRICAS DE PANEL CIBERNÉTICO */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '30px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'PROYECTOS ACTIVOS', val: '06 SYSTEM MODULES' },
            { label: 'TECNOLOGÍAS CORE', val: 'REACT / VITE / JS' },
            { label: 'CONTROL DE VERSIONES', val: 'GIT & GITHUB' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(2, 10, 24, 0.85)',
              border: '1px solid rgba(0, 243, 255, 0.3)',
              padding: '12px 20px',
              borderRadius: '8px',
              minWidth: '200px'
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#00ff66', textShadow: '0 0 8px #00ff66' }}>{item.val}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1px', marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTROS TIPO TERMINAL */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto 35px auto',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'todos', label: '[ TODOS LOS MÓDULOS ]' },
          { id: 'frontend', label: '[ FRONTEND & REACT ]' },
          { id: 'fullstack', label: '[ SISTEMAS & DASHBOARDS ]' },
          { id: 'engine', label: '[ ENGINE & CANVAS ]' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setCategoriaActiva(f.id)}
            className={`filter-btn ${categoriaActiva === f.id ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* GRILLA DE 6 TARJETAS COMPLETAS */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '25px'
      }}>
        {proyectosFiltrados.map((proy) => (
          <div key={proy.id} className="card-project">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#00ff66',
                  border: '1px solid #00ff66',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}>
                  {proy.categoria.toUpperCase()}
                </span>
                {proy.destacado && (
                  <span style={{ fontSize: '0.7rem', color: '#ff0055', letterSpacing: '1px', fontWeight: 'bold' }}>
                    ★ DESTACADO
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#00f3ff', marginBottom: '8px', letterSpacing: '1px', textShadow: '0 0 10px rgba(0, 243, 255, 0.4)' }}>
                {proy.titulo}
              </h3>

              <p style={{ color: '#00b8d4', fontSize: '0.85rem', marginBottom: '12px', fontWeight: 'bold' }}>
                {proy.tagline}
              </p>

              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                {proy.descripcion}
              </p>
            </div>

            <div>
              {/* BADGES TECNOLÓGICOS */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {proy.tech.map((t, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(0, 243, 255, 0.08)',
                    color: '#00f3ff',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setProyectoSeleccionado(proy)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'rgba(0, 243, 255, 0.12)',
                  border: '1px solid #00f3ff',
                  color: '#00f3ff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                  transition: 'all 0.2s ease'
                }}
              >
                INSPECCIONAR MÉTRICAS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE MÉTRICAS CIBERNÉTICAS */}
      {proyectoSeleccionado && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(3, 10, 22, 0.92)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#041226',
            border: '2px solid #00f3ff',
            boxShadow: '0 0 35px rgba(0, 243, 255, 0.4)',
            borderRadius: '12px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            position: 'relative'
          }}>
            <button
              onClick={() => setProyectoSeleccionado(null)}
              style={{
                position: 'absolute',
                top: '12px', right: '15px',
                background: 'none',
                border: 'none',
                color: '#ff0055',
                fontSize: '1.4rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>

            <h3 style={{ color: '#00f3ff', fontSize: '1.4rem', marginBottom: '8px', letterSpacing: '2px' }}>
              {proyectoSeleccionado.titulo}
            </h3>
            <p style={{ color: '#00ff66', fontSize: '0.85rem', marginBottom: '18px' }}>
              // ESPECIFICACIÓN DE TELEMETRÍA Y ARQUITECTURA //
            </p>

            <div style={{
              backgroundColor: '#020a18',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 243, 255, 0.2)',
              marginBottom: '18px'
            }}>
              {Object.entries(proyectoSeleccionado.metricas).map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#94a3b8', textTransform: 'uppercase' }}>{k}:</span>
                  <span style={{ color: '#00f3ff', fontWeight: 'bold' }}>{v}</span>
                </div>
              ))}
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '22px' }}>
              {proyectoSeleccionado.detalles}
            </p>

            <button
              onClick={() => setProyectoSeleccionado(null)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#00f3ff',
                color: '#030a16',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: 'pointer',
                letterSpacing: '2px'
              }}
            >
              CERRAR MÓDULO
            </button>
          </div>
        </div>
      )}
    </section>
  );
}