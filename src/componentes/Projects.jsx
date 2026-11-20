import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function Projects({ usuarioActual, onIrALogin }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  // Estados exclusivos de administrador
  const [mostrarCrearArriba, setMostrarCrearArriba] = useState(false);
  const [proyectoEditandoId, setProyectoEditandoId] = useState(null);
  const editorInferiorRef = useRef(null);

  const formVacio = {
    titulo: '',
    categoria: 'frontend',
    tagline: '',
    descripcion: '',
    tech: 'React, Vite, JavaScript',
    repoUrl: 'https://github.com/SantiagoG2025/',
    demoUrl: 'https://',
    destacado: false
  };

  const [formCrear, setFormCrear] = useState(formVacio);
  const [formEditar, setFormEditar] = useState(formVacio);

  const estaLogueado = Boolean(usuarioActual);
  const esAdmin = usuarioActual?.rol === 'admin';

  const proyectosIniciales = [
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

  const [proyectos, setProyectos] = useState(() => {
    const guardados = localStorage.getItem('stackfolio_proyectos_v2');
    return guardados ? JSON.parse(guardados) : proyectosIniciales;
  });

  useEffect(() => {
    localStorage.setItem('stackfolio_proyectos_v2', JSON.stringify(proyectos));
  }, [proyectos]);

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

  // --- CREAR PROYECTO DESDE ARRIBA ---
  const handleCrearProyecto = (e) => {
    e.preventDefault();
    if (!formCrear.titulo.trim() || !formCrear.descripcion.trim()) {
      toast.error('Completá título y descripción del proyecto.');
      return;
    }
    const techArray = formCrear.tech.split(',').map((t) => t.trim()).filter(Boolean);
    const nuevo = {
      id: `proy-${Date.now()}`,
      titulo: formCrear.titulo.toUpperCase(),
      categoria: formCrear.categoria,
      tagline: formCrear.tagline || 'Módulo incorporado desde panel de administración.',
      descripcion: formCrear.descripcion,
      tech: techArray.length ? techArray : ['React'],
      metricas: { Estado: 'Activo', Origen: 'Admin', Seguridad: 'Verificada' },
      detalles: formCrear.descripcion,
      repoUrl: formCrear.repoUrl || 'https://github.com/SantiagoG2025/stackfolio',
      demoUrl: formCrear.demoUrl || 'https://stackfolio-demo.vercel.app',
      destacado: formCrear.destacado
    };

    setProyectos((prev) => [nuevo, ...prev]);

    fetch('http://127.0.0.1:5000/api/proyectos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        titulo: nuevo.titulo,
        categoria: nuevo.categoria,
        tagline: nuevo.tagline,
        descripcion: nuevo.descripcion,
        tecnologias: techArray.join(', '),
        url_repositorio: nuevo.repoUrl,
        url_demo: nuevo.demoUrl,
        destacado: nuevo.destacado ? 1 : 0
      })
    }).catch(() => {});

    setFormCrear(formVacio);
    setMostrarCrearArriba(false);
    toast.success('Proyecto creado y publicado en el portafolio.');
  };

  // --- ABRIR EDITOR INFERIOR AL TOCAR LAPICITO ---
  const abrirEditorInferior = (proy) => {
    setProyectoEditandoId(proy.id);
    setFormEditar({
      titulo: proy.titulo,
      categoria: proy.categoria,
      tagline: proy.tagline || '',
      descripcion: proy.descripcion,
      tech: Array.isArray(proy.tech) ? proy.tech.join(', ') : proy.tech,
      repoUrl: proy.repoUrl,
      demoUrl: proy.demoUrl,
      destacado: Boolean(proy.destacado)
    });
    setTimeout(() => {
      editorInferiorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  // --- GUARDAR CAMBIOS DESDE EDITOR INFERIOR ---
  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    if (!formEditar.titulo.trim() || !formEditar.descripcion.trim()) {
      toast.error('Completá título y descripción.');
      return;
    }
    const techArray = formEditar.tech.split(',').map((t) => t.trim()).filter(Boolean);

    setProyectos((prev) =>
      prev.map((p) =>
        p.id === proyectoEditandoId
          ? {
              ...p,
              titulo: formEditar.titulo.toUpperCase(),
              categoria: formEditar.categoria,
              tagline: formEditar.tagline,
              descripcion: formEditar.descripcion,
              detalles: formEditar.descripcion,
              tech: techArray.length ? techArray : p.tech,
              repoUrl: formEditar.repoUrl,
              demoUrl: formEditar.demoUrl,
              destacado: formEditar.destacado
            }
          : p
      )
    );

    fetch(`http://127.0.0.1:5000/api/proyectos/${proyectoEditandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        titulo: formEditar.titulo.toUpperCase(),
        categoria: formEditar.categoria,
        tagline: formEditar.tagline,
        descripcion: formEditar.descripcion,
        tecnologias: techArray.join(', '),
        url_repositorio: formEditar.repoUrl,
        url_demo: formEditar.demoUrl,
        destacado: formEditar.destacado ? 1 : 0
      })
    }).catch(() => {});

    setProyectoEditandoId(null);
    toast.success('Proyecto actualizado correctamente.');
  };

  // --- ELIMINAR PROYECTO DESDE EDITOR INFERIOR ---
  const handleEliminarProyecto = () => {
    if (!proyectoEditandoId) return;
    setProyectos((prev) => prev.filter((p) => p.id !== proyectoEditandoId));
    fetch(`http://127.0.0.1:5000/api/proyectos/${proyectoEditandoId}`, {
      method: 'DELETE',
      credentials: 'include'
    }).catch(() => {});
    setProyectoEditandoId(null);
    toast.success('Proyecto eliminado del portafolio.');
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
          position: relative !important;
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
        .sf-card-project.editando {
          border: 1.5px solid #fbbf24 !important;
          box-shadow: 0 0 22px rgba(251, 191, 36, 0.35) !important;
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
        .sf-admin-box {
          max-width: 780px !important;
          margin: 24px auto !important;
          background: rgba(6, 22, 46, 0.96) !important;
          border: 1px solid #00f3ff !important;
          border-radius: 12px !important;
          padding: 24px !important;
          box-shadow: 0 0 28px rgba(0, 243, 255, 0.25) !important;
          box-sizing: border-box !important;
          text-align: left !important;
        }
        .sf-admin-input {
          width: 100% !important;
          box-sizing: border-box !important;
          background: #020a18 !important;
          border: 1px solid rgba(0, 243, 255, 0.4) !important;
          border-radius: 6px !important;
          padding: 9px 12px !important;
          color: #e2e8f0 !important;
          font-family: monospace !important;
          font-size: 0.85rem !important;
          outline: none !important;
        }
        .sf-pencil-icon {
          position: absolute !important;
          top: 12px !important;
          right: 12px !important;
          width: 30px !important;
          height: 30px !important;
          border-radius: 6px !important;
          background: rgba(251, 191, 36, 0.14) !important;
          border: 1px solid rgba(251, 191, 36, 0.65) !important;
          color: #fbbf24 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          font-size: 0.85rem !important;
          padding: 0 !important;
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

        {/* BOTÓN ARRIBA DE TODO PARA CREAR NUEVO PROYECTO (SOLO ADMIN) */}
        {esAdmin && (
          <div style={{ marginTop: '18px' }}>
            <button
              type="button"
              onClick={() => setMostrarCrearArriba((prev) => !prev)}
              style={{
                backgroundColor: mostrarCrearArriba ? '#00ff66' : 'rgba(0, 255, 102, 0.14)',
                border: '1px solid #00ff66',
                color: mostrarCrearArriba ? '#030a16' : '#00ff66',
                padding: '10px 22px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(0, 255, 102, 0.25)',
              }}
            >
              {mostrarCrearArriba ? '✕ CERRAR FORMULARIO DE CREACIÓN' : '+ CREAR NUEVO PROYECTO'}
            </button>
          </div>
        )}

        {/* RECUADRO DESPLEGABLE ARRIBA PARA CREAR PROYECTO NUEVO */}
        {esAdmin && mostrarCrearArriba && (
          <form onSubmit={handleCrearProyecto} className="sf-admin-box">
            <div style={{ color: '#00ff66', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '16px', letterSpacing: '1px' }}>
              // ALTA DE NUEVO MÓDULO EN PORTAFOLIO //
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>TÍTULO *</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  placeholder="Ej: API CLOUD GESTIÓN"
                  value={formCrear.titulo}
                  onChange={(e) => setFormCrear({ ...formCrear, titulo: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>CATEGORÍA</label>
                <select
                  className="sf-admin-input"
                  value={formCrear.categoria}
                  onChange={(e) => setFormCrear({ ...formCrear, categoria: e.target.value })}
                >
                  <option value="frontend">FRONTEND &amp; REACT</option>
                  <option value="fullstack">SISTEMAS &amp; DASHBOARDS</option>
                  <option value="engine">ENGINE &amp; CANVAS</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>SUBTÍTULO / TAGLINE</label>
              <input
                type="text"
                className="sf-admin-input"
                placeholder="Breve resumen técnico..."
                value={formCrear.tagline}
                onChange={(e) => setFormCrear({ ...formCrear, tagline: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>DESCRIPCIÓN *</label>
              <textarea
                rows={2}
                className="sf-admin-input"
                placeholder="Descripción funcional del proyecto..."
                value={formCrear.descripcion}
                onChange={(e) => setFormCrear({ ...formCrear, descripcion: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>TECNOLOGÍAS (COMAS)</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  value={formCrear.tech}
                  onChange={(e) => setFormCrear({ ...formCrear, tech: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>URL REPOSITORIO</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  value={formCrear.repoUrl}
                  onChange={(e) => setFormCrear({ ...formCrear, repoUrl: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>URL DEMO</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  value={formCrear.demoUrl}
                  onChange={(e) => setFormCrear({ ...formCrear, demoUrl: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
                <label style={{ fontSize: '0.8rem', color: '#ff0055', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <input
                    type="checkbox"
                    checked={formCrear.destacado}
                    onChange={(e) => setFormCrear({ ...formCrear, destacado: e.target.checked })}
                  />
                  ★ MARCAR COMO DESTACADO
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMostrarCrearArriba(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #475569',
                  color: '#94a3b8',
                  padding: '9px 16px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              >
                CANCELAR
              </button>
              <button
                type="submit"
                style={{
                  background: '#00ff66',
                  border: 'none',
                  color: '#030a16',
                  padding: '9px 20px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                💾 GUARDAR PROYECTO
              </button>
            </div>
          </form>
        )}
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

      {/* GRILLA DE TARJETAS EN 3 COLUMNAS */}
      <div className="sf-grid-proyectos">
        {proyectosFiltrados.map((proy) => (
          <div
            key={proy.id}
            className={`sf-card-project ${proyectoEditandoId === proy.id ? 'editando' : ''}`}
          >
            {/* ÍCONO LAPICITO EN LA ESQUINA SUPERIOR DERECHA (SOLO ADMIN) */}
            {esAdmin && (
              <button
                type="button"
                title="Modificar este proyecto"
                onClick={() => abrirEditorInferior(proy)}
                className="sf-pencil-icon"
              >
                ✏️
              </button>
            )}

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingRight: esAdmin ? '36px' : '0',
                }}
              >
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

      {/* RECUADRO INFERIOR (AL FINAL DE TODOS LOS PROYECTOS) AL TOCAR EL LAPICITO */}
      {esAdmin && proyectoEditandoId !== null && (
        <div ref={editorInferiorRef} style={{ marginTop: '40px' }}>
          <form
            onSubmit={handleGuardarEdicion}
            className="sf-admin-box"
            style={{ borderColor: '#fbbf24', boxShadow: '0 0 28px rgba(251, 191, 36, 0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '1px' }}>
                ✏️ MODIFICAR PROYECTO: {formEditar.titulo}
              </span>
              <button
                type="button"
                onClick={() => setProyectoEditandoId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                [ CERRAR ✕ ]
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>TÍTULO *</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  value={formEditar.titulo}
                  onChange={(e) => setFormEditar({ ...formEditar, titulo: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>CATEGORÍA</label>
                <select
                  className="sf-admin-input"
                  value={formEditar.categoria}
                  onChange={(e) => setFormEditar({ ...formEditar, categoria: e.target.value })}
                >
                  <option value="frontend">FRONTEND &amp; REACT</option>
                  <option value="fullstack">SISTEMAS &amp; DASHBOARDS</option>
                  <option value="engine">ENGINE &amp; CANVAS</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>SUBTÍTULO / TAGLINE</label>
              <input
                type="text"
                className="sf-admin-input"
                value={formEditar.tagline}
                onChange={(e) => setFormEditar({ ...formEditar, tagline: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>DESCRIPCIÓN *</label>
              <textarea
                rows={3}
                className="sf-admin-input"
                value={formEditar.descripcion}
                onChange={(e) => setFormEditar({ ...formEditar, descripcion: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>TECNOLOGÍAS (COMAS)</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  value={formEditar.tech}
                  onChange={(e) => setFormEditar({ ...formEditar, tech: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>URL REPOSITORIO</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  value={formEditar.repoUrl}
                  onChange={(e) => setFormEditar({ ...formEditar, repoUrl: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '5px' }}>URL DEMO</label>
                <input
                  type="text"
                  className="sf-admin-input"
                  value={formEditar.demoUrl}
                  onChange={(e) => setFormEditar({ ...formEditar, demoUrl: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
                <label style={{ fontSize: '0.8rem', color: '#ff0055', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <input
                    type="checkbox"
                    checked={formEditar.destacado}
                    onChange={(e) => setFormEditar({ ...formEditar, destacado: e.target.checked })}
                  />
                  ★ MARCAR COMO DESTACADO
                </label>
              </div>
            </div>

            {/* PARTE INFERIOR DEL RECUADRO: ICONO DE GUARDADO O ELIMINAR */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(71, 85, 105, 0.5)',
              }}
            >
              <button
                type="button"
                onClick={handleEliminarProyecto}
                style={{
                  background: 'rgba(255, 0, 85, 0.14)',
                  border: '1px solid #ff0055',
                  color: '#ff668b',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                🗑️ ELIMINAR PROYECTO
              </button>

              <button
                type="submit"
                style={{
                  background: '#fbbf24',
                  border: 'none',
                  color: '#030a16',
                  padding: '10px 22px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                💾 GUARDAR CAMBIOS
              </button>
            </div>
          </form>
        </div>
      )}

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