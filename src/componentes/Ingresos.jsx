import React, { useState } from 'react';

export function Ingresos() {
  const [filtroFrecuencia, setFiltroFrecuencia] = useState('todos');

  // Datos simulados de ingresos (con DNI enmascarado por seguridad según consigna)
  const registrosIngresos = [
    { id: 1, usuario: 'María Fernanda López', email: 'mflopez.rrhh@techsalta.com', dniEnmascarado: '••.•••.842', cantidadIngresos: 14, ultimoAcceso: '19/11/2026 - 18:10', prospectoActivo: true },
    { id: 2, usuario: 'Lucas Mateo Aráoz', email: 'laraoz.dev@gmail.com', dniEnmascarado: '••.•••.319', cantidadIngresos: 3, ultimoAcceso: '19/11/2026 - 15:42', prospectoActivo: false },
    { id: 3, usuario: 'Sofía Valentina Ruiz', email: 'sruiz.talent@globant-rec.ar', dniEnmascarado: '••.•••.905', cantidadIngresos: 11, ultimoAcceso: '19/11/2026 - 12:05', prospectoActivo: true },
    { id: 4, usuario: 'Martín Ezequiel Sosa', email: 'msosa.ucasal@hotmail.com', dniEnmascarado: '••.•••.614', cantidadIngresos: 2, ultimoAcceso: '18/11/2026 - 21:30', prospectoActivo: false },
    { id: 5, usuario: 'Carolina Andrea Méndez', email: 'cmendez@nortesoftware.com.ar', dniEnmascarado: '••.•••.127', cantidadIngresos: 9, ultimoAcceso: '18/11/2026 - 17:19', prospectoActivo: true },
    { id: 6, usuario: 'Diego Nicolás Torres', email: 'dtorres99@yahoo.com.ar', dniEnmascarado: '••.•••.488', cantidadIngresos: 1, ultimoAcceso: '17/11/2026 - 10:15', prospectoActivo: false },
  ];

  // Datos para el gráfico semanal de accesos
  const accesosSemanales = [
    { dia: 'LUN', total: 18 },
    { dia: 'MAR', total: 24 },
    { dia: 'MIÉ', total: 21 },
    { dia: 'JUE', total: 35 },
    { dia: 'VIE', total: 42 },
    { dia: 'SÁB', total: 29 },
    { dia: 'DOM', total: 40 },
  ];

  const maxAccesos = Math.max(...accesosSemanales.map((d) => d.total));

  const registrosFiltrados = registrosIngresos.filter((r) => {
    if (filtroFrecuencia === 'prospectos') return r.prospectoActivo;
    if (filtroFrecuencia === 'estandar') return !r.prospectoActivo;
    return true;
  });

  const totalSesiones = registrosIngresos.reduce((acc, item) => acc + item.cantidadIngresos, 0);
  const totalProspectos = registrosIngresos.filter((r) => r.prospectoActivo).length;

  return (
    <section
      style={{
        maxWidth: '1100px',
        margin: '30px auto',
        padding: '30px 20px',
        color: '#00f3ff',
        fontFamily: 'monospace, sans-serif',
      }}
    >
      <style>{`
        .fila-estandar {
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(0, 243, 255, 0.15);
        }
        .fila-estandar:hover {
          background-color: rgba(0, 243, 255, 0.14);
          box-shadow: inset 3px 0 0 #00f3ff;
        }
        .fila-prospecto {
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255, 136, 0, 0.25);
          background-color: rgba(255, 136, 0, 0.05);
        }
        .fila-prospecto:hover {
          background-color: rgba(255, 136, 0, 0.2);
          box-shadow: inset 3px 0 0 #ff8800;
        }
      `}</style>

      {/* ENCABEZADO */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(74, 255, 176, 0.1)',
            border: '1px solid #4affb0',
            color: '#4affb0',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}
        >
          // TELEMETRÍA DE ACCESOS & AUDITORÍA ADMIN //
        </div>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: '900',
            letterSpacing: '3px',
            color: '#00f3ff',
            textShadow: '0 0 15px rgba(0, 243, 255, 0.5)',
            margin: 0,
          }}
        >
          [ PANEL DE INGRESOS AL SISTEMA ]
        </h2>
      </div>

      {/* TARJETAS RESUMEN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ background: '#041226', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>USUARIOS REGISTRADOS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00f3ff', marginTop: '6px' }}>{registrosIngresos.length}</div>
        </div>
        <div style={{ background: '#041226', border: '1px solid rgba(0,255,102,0.3)', borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SESIONES TOTALES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00ff66', marginTop: '6px' }}>{totalSesiones}</div>
        </div>
        <div style={{ background: '#041226', border: '1px solid rgba(255,136,0,0.4)', borderRadius: '10px', padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>PROSPECTOS ACTIVOS (+8 INGRESOS)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff8800', marginTop: '6px' }}>{totalProspectos}</div>
        </div>
      </div>

      {/* GRÁFICO VECTORIAL DE INGRESOS SEMANALES */}
      <div
        style={{
          background: 'rgba(4, 18, 38, 0.9)',
          border: '1px solid rgba(0, 243, 255, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', letterSpacing: '1.5px', color: '#00f3ff' }}>
            &gt; GRÁFICO DE FLUJO DE INGRESOS (ÚLTIMOS 7 DÍAS)
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#00ff66' }}>● TELEMETRÍA EN VIVO</span>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 700 220" style={{ width: '100%', minWidth: '500px', height: 'auto', display: 'block' }}>
            {/* Líneas guía horizontales */}
            {[0, 1, 2, 3, 4].map((step) => {
              const y = 170 - step * 35;
              return (
                <line
                  key={step}
                  x1="40"
                  y1={y}
                  x2="670"
                  y2={y}
                  stroke="rgba(0, 243, 255, 0.12)"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Barras del gráfico */}
            {accesosSemanales.map((item, idx) => {
              const barWidth = 48;
              const gap = 38;
              const x = 65 + idx * (barWidth + gap);
              const barHeight = (item.total / maxAccesos) * 130;
              const y = 170 - barHeight;
              const esPico = item.total >= 35;

              return (
                <g key={item.dia}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill={esPico ? 'rgba(255, 136, 0, 0.35)' : 'rgba(0, 243, 255, 0.25)'}
                    stroke={esPico ? '#ff8800' : '#00f3ff'}
                    strokeWidth="2"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    fill={esPico ? '#ff8800' : '#00ff66'}
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {item.total}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y="195"
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {item.dia}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* TABLA DE FRECUENCIA DE INGRESOS */}
      <div
        style={{
          background: 'rgba(4, 18, 38, 0.9)',
          border: '1px solid rgba(0, 243, 255, 0.3)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', letterSpacing: '1.5px', color: '#00f3ff' }}>
            &gt; TABLA DE FRECUENCIA DE USUARIOS
          </h3>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'todos', label: 'TODOS' },
              { id: 'prospectos', label: 'PROSPECTOS ACTIVOS (NARANJA)' },
              { id: 'estandar', label: 'ESTÁNDAR (CYAN)' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFiltroFrecuencia(btn.id)}
                style={{
                  background: filtroFrecuencia === btn.id ? '#00f3ff' : 'transparent',
                  color: filtroFrecuencia === btn.id ? '#030a16' : '#00f3ff',
                  border: '1px solid #00f3ff',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0, 243, 255, 0.4)', color: '#94a3b8' }}>
                <th style={{ padding: '12px' }}>USUARIO / RECLUTADOR</th>
                <th style={{ padding: '12px' }}>CORREO</th>
                <th style={{ padding: '12px' }}>DNI (PROTEGIDO)</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>INGRESOS</th>
                <th style={{ padding: '12px' }}>ÚLTIMO ACCESO</th>
                <th style={{ padding: '12px' }}>CLASIFICACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((reg) => (
                <tr key={reg.id} className={reg.prospectoActivo ? 'fila-prospecto' : 'fila-estandar'}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: reg.prospectoActivo ? '#ffae42' : '#e2e8f0' }}>
                    {reg.usuario}
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{reg.email}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{reg.dniEnmascarado}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: reg.prospectoActivo ? '#ff8800' : '#00f3ff' }}>
                    {reg.cantidadIngresos}x
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{reg.ultimoAcceso}</td>
                  <td style={{ padding: '12px' }}>
                    {reg.prospectoActivo ? (
                      <span
                        style={{
                          backgroundColor: 'rgba(255, 136, 0, 0.2)',
                          color: '#ff8800',
                          border: '1px solid #ff8800',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                        }}
                      >
                        ★ PROSPECTO ACTIVO
                      </span>
                    ) : (
                      <span
                        style={{
                          backgroundColor: 'rgba(0, 243, 255, 0.1)',
                          color: '#00f3ff',
                          border: '1px solid rgba(0, 243, 255, 0.4)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                        }}
                      >
                        ESTÁNDAR
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}