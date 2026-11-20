import React, { useState } from 'react';
import { toast } from 'sonner';

export default function Projects({ usuarioActual, onIrALogin }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const estaLogueado = Boolean(usuarioActual);

  const proyectos = [
    {
      id: 'stackfolio',
      titulo: 'STACKFOLIO // CYBER AUTH',
      categoria: 'frontend',
      tagline: 'Sistema de autenticación y portafolio modular neón.',
      descripcion: 'Plataforma web desacoplada con animaciones en canvas de Matrix digital y guardián felino programado puramente en vectores SVG.',
      tech: ['React', 'Vite', 'JavaScript', 'SVG', 'CSS3'],
      metricas: { Renderizado: '60 FPS', Componentes: '12 React UI', Estado: '100% Modulado' },
      detalles: 'Implementa lógica de validación de campos en tiempo real, cambio dinámico de visibilidad de credenciales y estados interactivos visuales.',
      repoUrl: 'https://github.com/SantiagoG2025/stackfolio',
      demoUrl: 'https://stackfolio-demo.vercel.app',
      destacado: true
    },
    {
      id: 'saltavet',
      titulo: 'SGA-SALTAVET',
      categoria: 'fullstack',
      tagline: 'Plataforma de gestión y telemetría administrativa.',
      descripcion: 'Dashboard institucional diseñado para el control de flujos de datos, gestión de módulos y optimización de arquitectura frontend.',
      tech: ['React', 'Tailwind CSS', 'DataTables', 'Git'],
      metricas: { Módulos: '8 Vistas', Arquitectura: 'Frontend / REST', Cobertura: 'Alta' },
      detalles: 'Desarrollo en equipo con especificación completa de requerimientos técnicos, capex/opex y prototipado estructural.',
      repoUrl: 'https://github.com/SantiagoG2025/sga-saltavet',
      demoUrl: 'https://sga-saltavet.vercel.app',
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
      repoUrl: 'https://github.com/SantiagoG2025/neon-canvas-engine',
      demoUrl: 'https://neon-canvas-engine.vercel.app',
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
      repoUrl: 'https://github.com/SantiagoG2025/parcial-l4-validator',
      demoUrl: 'https://parcial-l4-validator.vercel.app',
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
      repoUrl: 'https://github.com/SantiagoG2025/calculus-viz',
      demoUrl: 'https://calculus-viz.vercel.app',
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
      repoUrl: 'https://github.com/SantiagoG2025/sports-metrics-dashboard',
      demoUrl: 'https://sports-metrics.vercel.app',
      destacado: false
    }
  ];

  const proyectosFiltrados = categoriaActiva === 'todos'
    ? proyectos
    : proyectos.filter((p) => p.categoria === categoriaActiva);

  const manejarAccesoProtegido = (e, accion, proy = null) => {
    if (!estaLogueado) {
      if (e) e.preventDefault();
      toast.warning('Acceso restringido: Iniciá sesión o registrate para abrir enlaces y detalles de los proyectos.');
      if (onIrALogin) onIrALogin();
      return;
    }
    if (accion === 'modal' && proy) {
      setProyectoSeleccionado(proy);
    }
  };

  return (
    <section
      translate="no"
      style={{
        backgroundColor: '#030a16',
        padding: '50px 24px',
        color: '#00f3ff',
        fontFamily: 'monospace, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        .sf-grid-proyectos {
          max-width: 1140px !important;
          margin: 0 auto !important;
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important;
          gap: 24px !important;
        }
        .sf-card-project {
          background: rgba(6, 22, 46, 0.92) !important;
          border: 1px solid rgba(0, 243, 255, 0.35) !important;
          border-radius: 12px !important;
          padding: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease !important;
          box-sizing: border-box !important;
        }
        .sf-card-project:hover {
          transform: translateY(-5px) !important;
          border-color: #00f3ff !important;
          box-shadow: 0 0 25px rgba(0, 243, 255, 0.3) !important;
        }
        .sf-filter-btn {
          background: rgba(4, 18, 38, 0.8) !important;
          border: 1px solid rgba(0, 243, 255, 0.45) !important;
          color: #00f3ff !important;
          padding: 9px 18px !important;
          border-radius: 6px !important;
          font-family: monospace !important;
          cursor: pointer !important;
          font-weight: bold !important;
          font-size: 0.82rem !important;
          letter-spacing: 1px !important;
        }
        .sf-filter-btn.active, .sf-filter-btn:hover {
          background: #00f3ff !important;
          color: #030a16 !important;
          box-shadow: 0 0 14px rgba(0, 243, 255, 0.6) !important;
        }
        .sf-link-btn {
          flex: 1 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 9px 10px !important;
          border-radius: 6px !important;
          font-size: 0.78rem !important;
          font-weight: bold !important;
          text-decoration: none !important;
          font-family: monospace !important;
          cursor: pointer !important;
          box-sizing: border-box !important;
        }
      `}</style>

      {/* ENCABEZADO */}
      <div style={{ maxWidth: '1140px', margin: '0 auto 36px auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(0, 243, 255, 0.1)',
            border: '1px solid #00f3ff',
            padding: '5px 16px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            letterSpacing: '2px',
            marginBottom: '14px',
          }}
        >
          // INGENIERÍA INFORMÁTICA - UCASAL //
        </div>

        <h1
          style={{
            fontSize: '2.6rem',
            fontWeight: '900',
            letterSpacing: '4px',
            color: '#00f3ff',
            textShadow: '0 0 20px rgba(0, 243, 255, 0.6)',
            margin: '0 0 8px 0',
          }}
        >
          SANTIAGO GÓMEZ
        </h1>

        <div
          style={{
            fontSize: '1rem',
            color: '#00ff66',
            letterSpacing: '2px',
            fontWeight: 'bold',
            marginBottom: '14px',
          }}
        >
          [ FULL STACK DEVELOPER &amp; SOFTWARE ARCHITECT ]
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.98rem', maxWidth: '680px', margin: '0 auto 22px auto', lineHeight: '1.6' }}>
          Desarrollo de software frontend y backend, arquitectura de componentes modulares y sistemas con estética Cyberpunk de alta densidad visual.
        </p>

        {/* BANNER DE ESTADO DE SESIÓN */}
        <div
          style={{
            display: 'inline-block',
            padding: '8px 18px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            backgroundColor: estaLogueado ? 'rgba(0, 255, 102, 0.12)' : 'rgba(255, 102, 139, 0.12)',
            border: `1px solid ${estaLogueado ? '#00ff66' : '#ff668b'}`,
            color: estaLogueado ? '#00ff66' : '#ff668b',
          }}
        >
          {estaLogueado
            ? '🔓 SESIÓN VERIFICADA: ENLACES DE REPOSITORIO Y DEMOS DESBLOQUEADOS'
            : '🔒 MODO VISITANTE: INICIÁ SESIÓN PARA DESBLOQUEAR LOS LINKS DE PROYECTOS'}
        </div>
      </div>

      {/* FILTROS */}
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto 32px auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 'todos', label: '[ TODOS LOS MÓDULOS ]' },
          { id: 'frontend', label: '[ FRONTEND & REACT ]' },
          { id: 'fullstack', label: '[ SISTEMAS & DASHBOARDS ]' },
          { id: 'engine', label: '[ ENGINE & CANVAS ]' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setCategoriaActiva(f.id)}
            className={`sf-filter-btn ${categoriaActiva === f.id ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* GRILLA DE TARJETAS */}
      <div className="sf-grid-proyectos">
        {proyectosFiltrados.map((proy) => (
          <div key={proy.id} className="sf-card-project">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#00ff66',
                    border: '1px solid #00ff66',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                  }}
                >
                  {proy.categoria.toUpperCase()}
                </span>
                {proy.destacado && (
                  <span style={{ fontSize: '0.72rem', color: '#ff0055', letterSpacing: '1px', fontWeight: 'bold' }}>
                    ★ DESTACADO
                  </span>
                )}
              </div>

              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#00f3ff',
                  margin: '0 0 8px 0',
                  letterSpacing: '1px',
                }}
              >
                {proy.titulo}
              </h3>

              <p style={{ color: '#38bdf8', fontSize: '0.85rem', margin: '0 0 12px 0', fontWeight: 'bold' }}>
                {proy.tagline}
              </p>

              <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: '1.5', margin: '0 0 18px 0' }}>
                {proy.descripcion}
              </p>
            </div>

            <div>
              {/* BADGES */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {proy.tech.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.72rem',
                      backgroundColor: 'rgba(0, 243, 255, 0.08)',
                      color: '#00f3ff',
                      border: '1px solid rgba(0, 243, 255, 0.35)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* BOTONES DE ENLACES CON TRABA */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <a
                  href={estaLogueado ? proy.repoUrl : '#login-requerido'}
                  target={estaLogueado ? '_blank' : undefined}
                  rel={estaLogueado ? 'noopener noreferrer' : undefined}
                  onClick={(e) => manejarAccesoProtegido(e, 'link')}
                  className="sf-link-btn"
                  style={{
                    backgroundColor: estaLogueado ? 'rgba(0, 255, 102, 0.14)' : 'rgba(15, 23, 42, 0.9)',
                    border: `1px solid ${estaLogueado ? '#00ff66' : '#475569'}`,
                    color: estaLogueado ? '#00ff66' : '#94a3b8',
                  }}
                >
                  {estaLogueado ? '↗ GITHUB' : '🔒 GITHUB'}
                </a>

                <a
                  href={estaLogueado ? proy.demoUrl : '#login-requerido'}
                  target={estaLogueado ? '_blank' : undefined}
                  rel={estaLogueado ? 'noopener noreferrer' : undefined}
                  onClick={(e) => manejarAccesoProtegido(e, 'link')}
                  className="sf-link-btn"
                  style={{
                    backgroundColor: estaLogueado ? 'rgba(0, 243, 255, 0.14)' : 'rgba(15, 23, 42, 0.9)',
                    border: `1px solid ${estaLogueado ? '#00f3ff' : '#475569'}`,
                    color: estaLogueado ? '#00f3ff' : '#94a3b8',
                  }}
                >
                  {estaLogueado ? '↗ DEMO' : '🔒 DEMO'}
                </a>
              </div>

              <button
                onClick={(e) => manejarAccesoProtegido(e, 'modal', proy)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: estaLogueado ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255, 102, 139, 0.12)',
                  border: `1px solid ${estaLogueado ? '#00f3ff' : '#ff668b'}`,
                  color: estaLogueado ? '#00f3ff' : '#ff668b',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                }}
              >
                {estaLogueado ? 'INSPECCIONAR MÉTRICAS' : '🔒 INICIAR SESIÓN PARA VER'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE MÉTRICAS */}
      {proyectoSeleccionado && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(3, 10, 22, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#041226',
              border: '2px solid #00f3ff',
              boxShadow: '0 0 35px rgba(0, 243, 255, 0.4)',
              borderRadius: '12px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setProyectoSeleccionado(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#ff0055',
                fontSize: '1.4rem',
                cursor: 'pointer',
                fontWeight: 'bold',
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
            <div
              style={{
                backgroundColor: '#020a18',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(0, 243, 255, 0.2)',
                marginBottom: '18px',
              }}
            >
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
                letterSpacing: '2px',
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