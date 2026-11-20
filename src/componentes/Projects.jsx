import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Projects({ usuarioActual, onIrALogin }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  // Estados de administración (solo visibles si usuarioActual?.rol === 'admin')
  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [creandoNuevo, setCreandoNuevo] = useState(false);
  const [formProyecto, setFormProyecto] = useState({
    titulo: '',
    categoria: 'frontend',
    tagline: '',
    descripcion: '',
    tech: '',
    repoUrl: '',
    demoUrl: '',
    destacado: false
  });

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

  // Guarda cambios en localStorage para que persistan incluso en Vercel sin backend local
  useEffect(() => {
    localStorage.setItem('stackfolio_proyectos', JSON.stringify(proyectos));
  }, [proyectos]);

  // Sincroniza con SQL Server / Flask si el backend local está activo
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

  // --- FUNCIONES DE ADMINISTRADOR ---
  const abrirNuevoProyecto = () => {
    setProyectoEditando(null);
    setCreandoNuevo(true);
    setFormProyecto({
      titulo: '',
      categoria: 'frontend',
      tagline: '',
      descripcion: '',
      tech: 'React, Vite, Tailwind CSS',
      repoUrl: 'https://github.com/SantiagoG2025/',
      demoUrl: 'https://',
      destacado: false
    });
  };

  const abrirEdicion = (proyecto) => {
    setCreandoNuevo(false);
    setProyectoEditando(proyecto.id);
    setFormProyecto({
      titulo: proyecto.titulo,
      categoria: proyecto.categoria,
      tagline: proyecto.tagline,
      descripcion: proyecto.descripcion,
      tech: Array.isArray(proyecto.tech) ? proyecto.tech.join(', ') : proyecto.tech,
      repoUrl: proyecto.repoUrl,
      demoUrl: proyecto.demoUrl,
      destacado: Boolean(proyecto.destacado)
    });
  };

  const cerrarModalAdmin = () => {
    setProyectoEditando(null);
    setCreandoNuevo(false);
  };

  const guardarProyectoAdmin = async (e) => {
    e.preventDefault();
    if (!formProyecto.titulo.trim() || !formProyecto.descripcion.trim()) {
      toast.error('Completá al menos el título y la descripción del proyecto');
      return;
    }

    const techArray = formProyecto.tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (creandoNuevo) {
      const nuevo = {
        id: Date.now(),
        titulo: formProyecto.titulo.toUpperCase(),
        categoria: formProyecto.categoria,
        tagline: formProyecto.tagline || 'Módulo agregado por administrador.',
        descripcion: formProyecto.descripcion,
        tech: techArray.length ? techArray : ['React'],
        metricas: { Estado: 'Nuevo', Origen: 'Panel Admin', Seguridad: 'Activa' },
        detalles: formProyecto.descripcion,
        repoUrl: formProyecto.repoUrl || 'https://github.com/SantiagoG2025/stackfolio',
        demoUrl: formProyecto.demoUrl || 'https://stackfolio-demo.vercel.app',
        destacado: formProyecto.destacado
      };

      setProyectos((prev) => [nuevo, ...prev]);

      // Intenta persistir en Flask / SQL Server si está activo
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

      toast.success('Proyecto creado y publicado en el portafolio');
    } else {
      setProyectos((prev) =>
        prev.map((p) =>
          p.id === proyectoEditando
            ? {
                ...p,
                titulo: formProyecto.titulo.toUpperCase(),
                categoria: formProyecto.categoria,
                tagline: formProyecto.tagline,
                descripcion: formProyecto.descripcion,
                detalles: formProyecto.descripcion,
                tech: techArray.length ? techArray : p.tech,
                repoUrl: formProyecto.repoUrl,
                demoUrl: formProyecto.demoUrl,
                destacado: formProyecto.destacado
              }
            : p
        )
      );

      // Intenta actualizar en Flask / SQL Server si está activo
      fetch(`http://127.0.0.1:5000/api/proyectos/${proyectoEditando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titulo: formProyecto.titulo.toUpperCase(),
          categoria: formProyecto.categoria,
          tagline: formProyecto.tagline,
          descripcion: formProyecto.descripcion,
          tecnologias: techArray.join(', '),
          url_repositorio: formProyecto.repoUrl,
          url_demo: formProyecto.demoUrl,
          destacado: formProyecto.destacado ? 1 : 0
        })
      }).catch(() => {});

      toast.success('Proyecto actualizado correctamente');
    }

    cerrarModalAdmin();
  };

  const eliminarProyectoAdmin = (id, titulo) => {
    setProyectos((prev) => prev.filter((p) => p.id !== id));
    fetch(`http://127.0.0.1:5000/api/proyectos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).catch(() => {});
    toast.success(`Proyecto "${titulo}" eliminado`);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10 text-cyan-50 font-mono">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 mb-3 text-xs tracking-widest uppercase border border-cyan-400/50 rounded-full bg-cyan-950/40 text-cyan-300">
          // INGENIERÍA INFORMÁTICA - UCASAL //
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
          SANTIAGO GÓMEZ
        </h1>
        <p className="mt-2 text-sm tracking-widest text-emerald-400 font-semibold">
          [ FULL STACK DEVELOPER & SOFTWARE ARCHITECT ]
        </p>
        <p className="max-w-2xl mx-auto mt-3 text-xs md:text-sm text-slate-300 leading-relaxed">
          Desarrollo de software frontend y backend, arquitectura de componentes modulares y sistemas con estética Cyberpunk de alta densidad visual.
        </p>

        {/* Banner de estado según rol */}
        {!estaLogueado && (
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-500/50 bg-rose-950/30 text-rose-300 text-xs">
            <span>🔒 MODO VISITANTE: INICIÁ SESIÓN PARA DESBLOQUEAR LOS LINKS DE PROYECTOS</span>
          </div>
        )}

        {esAdmin && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-lg border border-amber-400/60 bg-amber-950/30 text-amber-300 text-xs">
              ⚡ MODO ADMINISTRADOR ACTIVO: PODÉS EDITAR, CREAR O ELIMINAR PROYECTOS
            </span>
            <button
              onClick={abrirNuevoProyecto}
              className="px-4 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition cursor-pointer"
            >
              + NUEVO PROYECTO
            </button>
          </div>
        )}
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {[
          { id: 'todos', label: '[ TODOS LOS MÓDULOS ]' },
          { id: 'frontend', label: '[ FRONTEND & REACT ]' },
          { id: 'fullstack', label: '[ SISTEMAS & DASHBOARDS ]' },
          { id: 'engine', label: '[ ENGINE & CANVAS ]' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider border transition cursor-pointer ${
              categoriaActiva === cat.id
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                : 'bg-slate-900/70 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grilla de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectosFiltrados.map((proyecto) => (
          <article
            key={proyecto.id}
            className="flex flex-col justify-between p-5 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition shadow-[0_0_20px_rgba(6,182,212,0.08)]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded border border-emerald-400/50 bg-emerald-950/40 text-emerald-300">
                  {proyecto.categoria}
                </span>
                {proyecto.destacado && (
                  <span className="text-[11px] font-bold text-rose-400 tracking-wider">
                    ★ DESTACADO
                  </span>
                )}
              </div>

              <h2 className="text-lg font-extrabold text-cyan-300 tracking-wide mb-2">
                {proyecto.titulo}
              </h2>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {proyecto.descripcion}
              </p>

              {/* Tecnologías */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proyecto.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-cyan-200 border border-cyan-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              {/* Botones de enlaces (bloqueados para visitantes) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={(e) => manejarAccesoLink(e, proyecto.repoUrl, 'repositorio GitHub')}
                  className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    estaLogueado
                      ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/25'
                      : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:border-rose-400/60 hover:text-rose-300'
                  }`}
                >
                  {estaLogueado ? '📂 CÓDIGO GIT' : '🔒 CÓDIGO GIT'}
                </button>

                <button
                  onClick={(e) => manejarAccesoLink(e, proyecto.demoUrl, 'despliegue en vivo')}
                  className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    estaLogueado
                      ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200 hover:bg-emerald-500/25'
                      : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:border-rose-400/60 hover:text-rose-300'
                  }`}
                >
                  {estaLogueado ? '🚀 DEMO LIVE' : '🔒 DEMO LIVE'}
                </button>
              </div>

              <button
                onClick={() => setProyectoSeleccionado(proyecto)}
                className="w-full py-1.5 rounded-lg text-[11px] text-slate-300 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
              >
                [ INSPECCIONAR MÉTRICAS ]
              </button>

              {/* Controles exclusivos para el Administrador */}
              {esAdmin && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-500/30">
                  <button
                    onClick={() => abrirEdicion(proyecto)}
                    className="py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/20 border border-amber-400/70 text-amber-200 hover:bg-amber-500/30 transition cursor-pointer"
                  >
                    ✏️ EDITAR
                  </button>
                  <button
                    onClick={() => eliminarProyectoAdmin(proyecto.id, proyecto.titulo)}
                    className="py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/20 border border-rose-400/70 text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
                  >
                    🗑️ ELIMINAR
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Modal de Inspección de Métricas */}
      {proyectoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg p-6 rounded-xl bg-slate-900 border border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-extrabold text-cyan-300">
                {proyectoSeleccionado.titulo}
              </h3>
              <button
                onClick={() => setProyectoSeleccionado(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                [ X ]
              </button>
            </div>
            <p className="text-xs text-emerald-400 mb-3">{proyectoSeleccionado.tagline}</p>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {proyectoSeleccionado.detalles}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(proyectoSeleccionado.metricas || {}).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded bg-slate-950 border border-cyan-500/20 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">{k}</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setProyectoSeleccionado(null)}
              className="w-full py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              CERRAR INSPECCIÓN
            </button>
          </div>
        </div>
      )}

      {/* Modal de Edición / Creación para Administrador */}
      {(proyectoEditando !== null || creandoNuevo) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <form
            onSubmit={guardarProyectoAdmin}
            className="w-full max-w-lg p-6 rounded-xl bg-slate-900 border border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.25)] space-y-3"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-base font-extrabold text-amber-300">
                {creandoNuevo ? '+ AGREGAR NUEVO PROYECTO' : '✏️ EDITAR PROYECTO'}
              </h3>
              <button
                type="button"
                onClick={cerrarModalAdmin}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                [ CERRAR ]
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-cyan-300 mb-1">Título del proyecto *</label>
              <input
                type="text"
                value={formProyecto.titulo}
                onChange={(e) => setFormProyecto({ ...formProyecto, titulo: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-cyan-300 mb-1">Categoría</label>
                <select
                  value={formProyecto.categoria}
                  onChange={(e) => setFormProyecto({ ...formProyecto, categoria: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                >
                  <option value="frontend">Frontend & React</option>
                  <option value="fullstack">Sistemas & Dashboards</option>
                  <option value="engine">Engine & Canvas</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="inline-flex items-center gap-2 text-xs text-rose-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formProyecto.destacado}
                    onChange={(e) => setFormProyecto({ ...formProyecto, destacado: e.target.checked })}
                  />
                  ★ Marcar como Destacado
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-cyan-300 mb-1">Descripción *</label>
              <textarea
                rows={3}
                value={formProyecto.descripcion}
                onChange={(e) => setFormProyecto({ ...formProyecto, descripcion: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-cyan-300 mb-1">Tecnologías (separadas por coma)</label>
              <input
                type="text"
                value={formProyecto.tech}
                onChange={(e) => setFormProyecto({ ...formProyecto, tech: e.target.value })}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-cyan-300 mb-1">URL Repositorio GitHub</label>
                <input
                  type="text"
                  value={formProyecto.repoUrl}
                  onChange={(e) => setFormProyecto({ ...formProyecto, repoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-cyan-300 mb-1">URL Demo Live</label>
                <input
                  type="text"
                  value={formProyecto.demoUrl}
                  onChange={(e) => setFormProyecto({ ...formProyecto, demoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={cerrarModalAdmin}
                className="w-1/2 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-lg bg-amber-400 text-slate-950 text-xs font-extrabold hover:bg-amber-300 cursor-pointer"
              >
                GUARDAR CAMBIOS
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}