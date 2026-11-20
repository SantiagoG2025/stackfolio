import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function Projects({ usuarioActual, onIrALogin }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  // Estados de administración
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

  const proyectosBase = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
    const guardados = localStorage.getItem('stackfolio_proyectos');
    return guardados ? JSON.parse(guardados) : proyectosBase;
  });

  useEffect(() => {
    localStorage.setItem('stackfolio_proyectos', JSON.stringify(proyectos));
  }, [proyectos]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/proyectos', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapeados = data.map((p, i) => ({
            id: p.id_proyecto || i + 1,
            titulo: p.titulo,
            categoria: p.categoria || 'fullstack',
            tagline: p.tagline || 'Módulo conectado a SQL Server',
            descripcion: p.descripcion,
            tech: p.tecnologias ? p.tecnologias.split(',').map((t) => t.trim()) : ['React', 'SQL Server'],
            metricas: { Base_Datos: 'SQL Server', Estado: 'Sincronizado', Rol: 'Protegido' },
            detalles: p.descripcion,
            repoUrl: p.url_repositorio || 'https://github.com/SantiagoG2025/stackfolio',
            demoUrl: p.url_demo || 'https://stackfolio-demo.vercel.app',
            destacado: Boolean(p.destacado),
          }));
          setProyectos(mapeados);
        }
      })
      .catch(() => {});
  }, []);

  const proyectosFiltrados = categoriaActiva === 'todos'
    ? proyectos
    : proyectos.filter((p) => p.categoria === categoriaActiva);

  const manejarAccesoLink = (e, url, tipo) => {
    if (!estaLogueado) {
      e.preventDefault();
      toast.error(`Acceso bloqueado: iniciá sesión para ver el ${tipo}`);
      if (onIrALogin) onIrALogin();
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Crear proyecto desde el panel superior desplegable
  const handleCrearProyecto = (e) => {
    e.preventDefault();
    if (!formCrear.titulo.trim() || !formCrear.descripcion.trim()) {
      toast.error('Completá título y descripción');
      return;
    }
    const techArray = formCrear.tech.split(',').map((t) => t.trim()).filter(Boolean);
    const nuevo = {
      id: Date.now(),
      titulo: formCrear.titulo.toUpperCase(),
      categoria: formCrear.categoria,
      tagline: formCrear.tagline || 'Módulo agregado desde panel administrador.',
      descripcion: formCrear.descripcion,
      tech: techArray.length ? techArray : ['React'],
      metricas: { Estado: 'Activo', Origen: 'Admin', Seguridad: 'Protegido' },
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
    toast.success('Proyecto creado y publicado');
  };

  // Abrir editor inferior al tocar el lapicito de una tarjeta
  const seleccionarParaEditar = (proyecto) => {
    setProyectoEditandoId(proyecto.id);
    setFormEditar({
      titulo: proyecto.titulo,
      categoria: proyecto.categoria,
      tagline: proyecto.tagline || '',
      descripcion: proyecto.descripcion,
      tech: Array.isArray(proyecto.tech) ? proyecto.tech.join(', ') : proyecto.tech,
      repoUrl: proyecto.repoUrl,
      demoUrl: proyecto.demoUrl,
      destacado: Boolean(proyecto.destacado)
    });
    setTimeout(() => {
      editorInferiorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  // Guardar modificación desde el recuadro inferior
  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    if (!formEditar.titulo.trim() || !formEditar.descripcion.trim()) {
      toast.error('Completá título y descripción');
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
    toast.success('Cambios guardados correctamente');
  };

  // Eliminar desde el botón inferior del recuadro de edición
  const handleEliminarDesdeEditor = () => {
    if (!proyectoEditandoId) return;
    setProyectos((prev) => prev.filter((p) => p.id !== proyectoEditandoId));
    fetch(`http://127.0.0.1:5000/api/proyectos/${proyectoEditandoId}`, {
      method: 'DELETE',
      credentials: 'include'
    }).catch(() => {});
    setProyectoEditandoId(null);
    toast.success('Proyecto eliminado del portafolio');
  };

  // Estilos puros (no dependen de Tailwind)
  const s = {
    container: {
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '36px 20px 60px',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: '#e2e8f0'
    },
    header: { textAlign: 'center', marginBottom: '28px' },
    pillTop: {
      display: 'inline-block',
      padding: '5px 16px',
      fontSize: '11px',
      letterSpacing: '0.14em',
      color: '#38bdf8',
      border: '1px solid rgba(56,189,248,0.45)',
      borderRadius: '999px',
      background: 'rgba(14,165,233,0.08)',
      marginBottom: '12px'
    },
    title: {
      fontSize: 'clamp(28px, 5vw, 44px)',
      fontWeight: 800,
      letterSpacing: '0.12em',
      color: '#22d3ee',
      textShadow: '0 0 18px rgba(34,211,238,0.55)',
      margin: '0 0 8px'
    },
    subtitle: {
      fontSize: '13px',
      letterSpacing: '0.14em',
      color: '#34d399',
      fontWeight: 700,
      margin: '0 0 12px'
    },
    desc: {
      maxWidth: '640px',
      margin: '0 auto',
      fontSize: '13px',
      color: '#94a3b8',
      lineHeight: 1.6
    },
    visitorBanner: {
      display: 'inline-block',
      marginTop: '18px',
      padding: '9px 18px',
      borderRadius: '8px',
      border: '1px solid rgba(244,63,94,0.5)',
      background: 'rgba(244,63,94,0.1)',
      color: '#fda4af',
      fontSize: '12px'
    },
    adminTopBar: {
      marginTop: '18px',
      display: 'flex',
      justifyContent: 'center'
    },
    btnCrearTop: {
      padding: '10px 22px',
      borderRadius: '8px',
      border: '1px solid #34d399',
      background: mostrarCrearArriba ? '#34d399' : 'rgba(16,185,129,0.14)',
      color: mostrarCrearArriba ? '#041019' : '#6ee7b7',
      fontWeight: 800,
      fontSize: '12px',
      letterSpacing: '0.08em',
      cursor: 'pointer',
      boxShadow: '0 0 16px rgba(52,211,153,0.25)'
    },
    formBox: {
      maxWidth: '760px',
      margin: '20px auto 30px',
      padding: '22px',
      borderRadius: '14px',
      background: 'rgba(8,16,30,0.94)',
      border: '1px solid #22d3ee',
      boxShadow: '0 0 24px rgba(34,211,238,0.18)'
    },
    formTitle: {
      fontSize: '14px',
      fontWeight: 800,
      color: '#22d3ee',
      letterSpacing: '0.08em',
      marginBottom: '14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    formGrid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
      marginBottom: '12px'
    },
    label: {
      display: 'block',
      fontSize: '11px',
      color: '#7dd3fc',
      marginBottom: '5px'
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '9px 12px',
      borderRadius: '8px',
      background: '#040a14',
      border: '1px solid rgba(56,189,248,0.35)',
      color: '#f1f5f9',
      fontSize: '12px',
      fontFamily: 'inherit',
      outline: 'none'
    },
    filtersRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '28px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
      gap: '22px'
    },
    card: (seleccionada) => ({
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '22px',
      borderRadius: '14px',
      background: 'rgba(9,18,34,0.9)',
      border: seleccionada ? '1.5px solid #fbbf24' : '1px solid rgba(34,211,238,0.28)',
      boxShadow: seleccionada
        ? '0 0 22px rgba(251,191,36,0.25)'
        : '0 0 20px rgba(6,182,212,0.08)'
    }),
    pencilBtn: {
      position: 'absolute',
      top: '14px',
      right: '14px',
      width: '30px',
      height: '30px',
      borderRadius: '8px',
      border: '1px solid rgba(251,191,36,0.55)',
      background: 'rgba(251,191,36,0.12)',
      color: '#fcd34d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      cursor: 'pointer'
    },
    cardTopMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '12px',
      paddingRight: esAdmin ? '36px' : '0'
    },
    catBadge: {
      padding: '3px 9px',
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      borderRadius: '5px',
      border: '1px solid rgba(52,211,153,0.5)',
      background: 'rgba(16,185,129,0.12)',
      color: '#6ee7b7'
    },
    starBadge: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#fb7185'
    },
    cardTitle: {
      fontSize: '17px',
      fontWeight: 800,
      color: '#22d3ee',
      margin: '0 0 8px',
      letterSpacing: '0.04em'
    },
    cardDesc: {
      fontSize: '12.5px',
      color: '#cbd5e1',
      lineHeight: 1.55,
      margin: '0 0 14px'
    },
    techWrap: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '16px'
    },
    techChip: {
      padding: '3px 8px',
      fontSize: '10.5px',
      borderRadius: '5px',
      background: 'rgba(15,23,42,0.9)',
      border: '1px solid rgba(56,189,248,0.28)',
      color: '#bae6fd'
    },
    cardFooter: {
      borderTop: '1px solid rgba(51,65,85,0.6)',
      paddingTop: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    linkBtnsRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px'
    },
    btnLink: (activo, color) => ({
      padding: '8px 10px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: 700,
      fontFamily: 'inherit',
      cursor: 'pointer',
      border: activo
        ? `1px solid ${color}`
        : '1px solid rgba(100,116,139,0.45)',
      background: activo
        ? color === '#22d3ee'
          ? 'rgba(34,211,238,0.12)'
          : 'rgba(52,211,153,0.12)'
        : 'rgba(15,23,42,0.8)',
      color: activo ? '#e0f2fe' : '#94a3b8'
    }),
    btnInspect: {
      width: '100%',
      padding: '7px',
      borderRadius: '8px',
      fontSize: '11px',
      fontFamily: 'inherit',
      background: 'rgba(30,41,59,0.65)',
      border: '1px solid rgba(71,85,105,0.6)',
      color: '#cbd5e1',
      cursor: 'pointer'
    }
  };

  return (
    <section style={s.container}>
      {/* Encabezado */}
      <div style={s.header}>
        <span style={s.pillTop}>// INGENIERÍA INFORMÁTICA - UCASAL //</span>
        <h1 style={s.title}>SANTIAGO GÓMEZ</h1>
        <p style={s.subtitle}>[ FULL STACK DEVELOPER & SOFTWARE ARCHITECT ]</p>
        <p style={s.desc}>
          Desarrollo de software frontend y backend, arquitectura de componentes modulares y sistemas con estética Cyberpunk de alta densidad visual.
        </p>

        {!estaLogueado && (
          <div style={s.visitorBanner}>
            🔒 MODO VISITANTE: INICIÁ SESIÓN PARA DESBLOQUEAR LOS LINKS DE PROYECTOS
          </div>
        )}

        {/* Botón superior exclusivo para Admin */}
        {esAdmin && (
          <div style={s.adminTopBar}>
            <button
              type="button"
              onClick={() => setMostrarCrearArriba((prev) => !prev)}
              style={s.btnCrearTop}
            >
              {mostrarCrearArriba ? '✕ CERRAR FORMULARIO' : '+ CREAR NUEVO PROYECTO'}
            </button>
          </div>
        )}
      </div>

      {/* Formulario desplegable ARRIBA para crear proyecto nuevo */}
      {esAdmin && mostrarCrearArriba && (
        <form onSubmit={handleCrearProyecto} style={s.formBox}>
          <div style={s.formTitle}>
            <span>+ CREAR NUEVO PROYECTO EN PORTAFOLIO</span>
          </div>

          <div style={s.formGrid2}>
            <div>
              <label style={s.label}>Título del proyecto *</label>
              <input
                type="text"
                placeholder="Ej: SISTEMA GESTIÓN CLOUD"
                value={formCrear.titulo}
                onChange={(e) => setFormCrear({ ...formCrear, titulo: e.target.value })}
                style={s.input}
                required
              />
            </div>
            <div>
              <label style={s.label}>Categoría</label>
              <select
                value={formCrear.categoria}
                onChange={(e) => setFormCrear({ ...formCrear, categoria: e.target.value })}
                style={s.input}
              >
                <option value="frontend">Frontend & React</option>
                <option value="fullstack">Sistemas & Dashboards</option>
                <option value="engine">Engine & Canvas</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={s.label}>Descripción *</label>
            <textarea
              rows={2}
              placeholder="Describí brevemente qué resuelve el proyecto..."
              value={formCrear.descripcion}
              onChange={(e) => setFormCrear({ ...formCrear, descripcion: e.target.value })}
              style={s.input}
              required
            />
          </div>

          <div style={s.formGrid2}>
            <div>
              <label style={s.label}>Tecnologías (separadas por coma)</label>
              <input
                type="text"
                value={formCrear.tech}
                onChange={(e) => setFormCrear({ ...formCrear, tech: e.target.value })}
                style={s.input}
              />
            </div>
            <div>
              <label style={s.label}>URL Repositorio GitHub</label>
              <input
                type="text"
                value={formCrear.repoUrl}
                onChange={(e) => setFormCrear({ ...formCrear, repoUrl: e.target.value })}
                style={s.input}
              />
            </div>
          </div>

          <div style={s.formGrid2}>
            <div>
              <label style={s.label}>URL Demo en Vivo</label>
              <input
                type="text"
                value={formCrear.demoUrl}
                onChange={(e) => setFormCrear({ ...formCrear, demoUrl: e.target.value })}
                style={s.input}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
              <label style={{ fontSize: '12px', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formCrear.destacado}
                  onChange={(e) => setFormCrear({ ...formCrear, destacado: e.target.checked })}
                />
                ★ Marcar como Destacado
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setMostrarCrearArriba(false)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid #475569',
                background: 'transparent',
                color: '#cbd5e1',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: '1px solid #34d399',
                background: '#34d399',
                color: '#041019',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              💾 GUARDAR NUEVO PROYECTO
            </button>
          </div>
        </form>
      )}

      {/* Filtros de categoría */}
      <div style={s.filtersRow}>
        {[
          { id: 'todos', label: '[ TODOS LOS MÓDULOS ]' },
          { id: 'frontend', label: '[ FRONTEND & REACT ]' },
          { id: 'fullstack', label: '[ SISTEMAS & DASHBOARDS ]' },
          { id: 'engine', label: '[ ENGINE & CANVAS ]' }
        ].map((cat) => {
          const activa = categoriaActiva === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoriaActiva(cat.id)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: 'pointer',
                border: activa ? '1px solid #22d3ee' : '1px solid rgba(34,211,238,0.28)',
                background: activa ? '#22d3ee' : 'rgba(9,18,34,0.85)',
                color: activa ? '#041019' : '#67e8f9',
                boxShadow: activa ? '0 0 16px rgba(34,211,238,0.45)' : 'none'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grilla de Proyectos */}
      <div style={s.grid}>
        {proyectosFiltrados.map((proyecto) => (
          <article
            key={proyecto.id}
            style={s.card(proyectoEditandoId === proyecto.id)}
          >
            {/* Ícono lapicito discreto en la esquina superior derecha (solo Admin) */}
            {esAdmin && (
              <button
                type="button"
                title="Modificar este proyecto"
                onClick={() => seleccionarParaEditar(proyecto)}
                style={s.pencilBtn}
              >
                ✏️
              </button>
            )}

            <div>
              <div style={s.cardTopMeta}>
                <span style={s.catBadge}>{proyecto.categoria}</span>
                {proyecto.destacado && <span style={s.starBadge}>★ DESTACADO</span>}
              </div>

              <h2 style={s.cardTitle}>{proyecto.titulo}</h2>
              <p style={s.cardDesc}>{proyecto.descripcion}</p>

              <div style={s.techWrap}>
                {proyecto.tech.map((t, idx) => (
                  <span key={idx} style={s.techChip}>{t}</span>
                ))}
              </div>
            </div>

            <div style={s.cardFooter}>
              <div style={s.linkBtnsRow}>
                <button
                  type="button"
                  onClick={(e) => manejarAccesoLink(e, proyecto.repoUrl, 'repositorio GitHub')}
                  style={s.btnLink(estaLogueado, '#22d3ee')}
                >
                  {estaLogueado ? '📂 CÓDIGO GIT' : '🔒 CÓDIGO GIT'}
                </button>
                <button
                  type="button"
                  onClick={(e) => manejarAccesoLink(e, proyecto.demoUrl, 'despliegue en vivo')}
                  style={s.btnLink(estaLogueado, '#34d399')}
                >
                  {estaLogueado ? '🚀 DEMO LIVE' : '🔒 DEMO LIVE'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setProyectoSeleccionado(proyecto)}
                style={s.btnInspect}
              >
                [ INSPECCIONAR MÉTRICAS ]
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Recuadro INFERIOR (al final de todos los proyectos) al tocar el lapicito */}
      {esAdmin && proyectoEditandoId !== null && (
        <div ref={editorInferiorRef} style={{ marginTop: '38px' }}>
          <form
            onSubmit={handleGuardarEdicion}
            style={{
              ...s.formBox,
              border: '1px solid #fbbf24',
              boxShadow: '0 0 26px rgba(251,191,36,0.18)'
            }}
          >
            <div style={{ ...s.formTitle, color: '#fcd34d' }}>
              <span>✏️ MODIFICANDO PROYECTO: {formEditar.titulo}</span>
              <button
                type="button"
                onClick={() => setProyectoEditandoId(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                [ CERRAR ✕ ]
              </button>
            </div>

            <div style={s.formGrid2}>
              <div>
                <label style={s.label}>Título del proyecto *</label>
                <input
                  type="text"
                  value={formEditar.titulo}
                  onChange={(e) => setFormEditar({ ...formEditar, titulo: e.target.value })}
                  style={s.input}
                  required
                />
              </div>
              <div>
                <label style={s.label}>Categoría</label>
                <select
                  value={formEditar.categoria}
                  onChange={(e) => setFormEditar({ ...formEditar, categoria: e.target.value })}
                  style={s.input}
                >
                  <option value="frontend">Frontend & React</option>
                  <option value="fullstack">Sistemas & Dashboards</option>
                  <option value="engine">Engine & Canvas</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={s.label}>Descripción *</label>
              <textarea
                rows={3}
                value={formEditar.descripcion}
                onChange={(e) => setFormEditar({ ...formEditar, descripcion: e.target.value })}
                style={s.input}
                required
              />
            </div>

            <div style={s.formGrid2}>
              <div>
                <label style={s.label}>Tecnologías (separadas por coma)</label>
                <input
                  type="text"
                  value={formEditar.tech}
                  onChange={(e) => setFormEditar({ ...formEditar, tech: e.target.value })}
                  style={s.input}
                />
              </div>
              <div>
                <label style={s.label}>URL Repositorio GitHub</label>
                <input
                  type="text"
                  value={formEditar.repoUrl}
                  onChange={(e) => setFormEditar({ ...formEditar, repoUrl: e.target.value })}
                  style={s.input}
                />
              </div>
            </div>

            <div style={s.formGrid2}>
              <div>
                <label style={s.label}>URL Demo en Vivo</label>
                <input
                  type="text"
                  value={formEditar.demoUrl}
                  onChange={(e) => setFormEditar({ ...formEditar, demoUrl: e.target.value })}
                  style={s.input}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', paddingTop: '18px' }}>
                <label style={{ fontSize: '12px', color: '#fda4af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formEditar.destacado}
                    onChange={(e) => setFormEditar({ ...formEditar, destacado: e.target.checked })}
                  />
                  ★ Marcar como Destacado
                </label>
              </div>
            </div>

            {/* Parte inferior del recuadro: icono de Guardar o Eliminar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(71,85,105,0.5)'
              }}
            >
              <button
                type="button"
                onClick={handleEliminarDesdeEditor}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid rgba(244,63,94,0.65)',
                  background: 'rgba(244,63,94,0.14)',
                  color: '#fda4af',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🗑️ ELIMINAR PROYECTO
              </button>

              <button
                type="submit"
                style={{
                  padding: '9px 22px',
                  borderRadius: '8px',
                  border: '1px solid #fbbf24',
                  background: '#fbbf24',
                  color: '#041019',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                💾 GUARDAR CAMBIOS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Inspección de Métricas */}
      {proyectoSeleccionado && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(2,6,15,0.85)',
            padding: '16px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '24px',
              borderRadius: '14px',
              background: '#081122',
              border: '1px solid #22d3ee',
              boxShadow: '0 0 30px rgba(34,211,238,0.28)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#22d3ee' }}>
                {proyectoSeleccionado.titulo}
              </h3>
              <button
                type="button"
                onClick={() => setProyectoSeleccionado(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 700 }}
              >
                [ X ]
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#34d399', margin: '0 0 10px' }}>
              {proyectoSeleccionado.tagline}
            </p>
            <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 16px' }}>
              {proyectoSeleccionado.detalles}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {Object.entries(proyectoSeleccionado.metricas || {}).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#040a14',
                    border: '1px solid rgba(34,211,238,0.2)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{k}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#22d3ee', marginTop: '4px' }}>{v}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setProyectoSeleccionado(null)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#22d3ee',
                color: '#041019',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              CERRAR INSPECCIÓN
            </button>
          </div>
        </div>
      )}
    </section>
  );
}