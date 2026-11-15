import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Lock, Send, Mail, CheckCircle2, Clock, User, Eye, ExternalLink, X } from 'lucide-react';

const CONSULTAS_INICIALES = [
  {
    id: 1,
    fecha: '06/11/2026 - 10:15',
    nombre: 'Juan Manuel Pérez',
    email: 'juan.perez@techsolutions.com',
    asunto: 'Desarrollo de plataforma web corporativa',
    mensaje: 'Hola, nos interesó mucho su perfil técnico y proyectos en React. ¿Tienen disponibilidad para una reunión esta semana?',
    respondido: false,
  },
  {
    id: 2,
    fecha: '06/11/2026 - 09:40',
    nombre: 'Sofía Aldana',
    email: 'sofia.aldana@empresa.com.ar',
    asunto: 'Propuesta laboral Fullstack Junior/Semi-Senior',
    mensaje: 'Buenas tardes, vimos su portafolio y nos gustaría invitarlos a un proceso de selección para nuestro equipo de desarrollo.',
    respondido: false,
  },
  {
    id: 3,
    fecha: '05/11/2026 - 18:22',
    nombre: 'Roberto Gómez',
    email: 'rgomez.dev@gmail.com',
    asunto: 'Consulta sobre arquitectura y base de datos',
    mensaje: 'Excelente trabajo en los proyectos publicados. Quería consultar qué stack utilizan para el despliegue en producción.',
    respondido: false,
  },
  {
    id: 4,
    fecha: '04/11/2026 - 14:05',
    nombre: 'Mariana Castillo',
    email: 'mcastillo_rrhh@globalit.com',
    asunto: 'Contacto de Recursos Humanos - GlobalIT',
    mensaje: 'Hola, guardamos su contacto en nuestra base de talentos IT para futuras búsquedas en Salta y modalidad remota.',
    respondido: true,
  },
];

export function ConsultasForm({
  usuarioActual = null,
  isAdmin = false,
  onIrALogin,
}) {
  const [consultas, setConsultas] = useState(() => {
    try {
      const guardadas = localStorage.getItem('stackfolio_consultas');
      return guardadas ? JSON.parse(guardadas) : CONSULTAS_INICIALES;
    } catch {
      return CONSULTAS_INICIALES;
    }
  });

  useEffect(() => {
    localStorage.setItem('stackfolio_consultas', JSON.stringify(consultas));
  }, [consultas]);

  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [filaSeleccionada, setFilaSeleccionada] = useState(2);
  const [consultaAbierta, setConsultaAbierta] = useState(null);

  const esAdminActivo = isAdmin || usuarioActual?.rol === 'admin';
  const estaLogueado = Boolean(usuarioActual && (usuarioActual.email || usuarioActual.nombre));

  const obtenerFechaActual = () => {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const mins = String(ahora.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} - ${horas}:${mins}`;
  };

  const handleEnviarConsulta = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      toast.error('Por favor escribí el detalle de tu consulta antes de enviar.');
      return;
    }

    const nuevaConsulta = {
      id: Date.now(),
      fecha: obtenerFechaActual(),
      nombre: usuarioActual.nombre || usuarioActual.username || 'Usuario Registrado',
      email: usuarioActual.email,
      asunto: asunto.trim() || 'Consulta general desde Portafolio',
      mensaje: mensaje.trim(),
      respondido: false,
    };

    setConsultas([nuevaConsulta, ...consultas]);
    setAsunto('');
    setMensaje('');
    toast.success('¡Consulta enviada con éxito! Ya figura en la bandeja del administrador.');
  };

  const marcarComoRespondido = (id) => {
    setConsultas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, respondido: !c.respondido } : c))
    );
    if (consultaAbierta && consultaAbierta.id === id) {
      setConsultaAbierta((prev) => ({ ...prev, respondido: !prev.respondido }));
    }
    toast.info('Estado del mensaje actualizado.');
  };

  // VISTA ADMINISTRADOR: BANDEJA DE CONSULTAS RECIBIDAS
  if (esAdminActivo) {
    const sinResponder = consultas.filter((c) => !c.respondido).length;

    return (
      <section id="consultas" style={{ maxWidth: '1050px', margin: '40px auto', padding: '0 20px' }}>
        <div
          style={{
            backgroundColor: '#0b1526',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            borderRadius: '14px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#F8FAFC', margin: 0 }}>
                Bandeja de Consultas Recibidas
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '15px', margin: '6px 0 0 0' }}>
                Consultas enviadas a través del formulario de contacto.
              </p>
            </div>

            <div
              style={{
                color: '#E2E8F0',
                fontSize: '15px',
                fontWeight: '500',
                backgroundColor: 'rgba(0, 243, 255, 0.08)',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              <strong style={{ color: '#00f3ff' }}>{sinResponder}</strong>{' '}
              {sinResponder === 1 ? 'Mensaje sin responder' : 'Mensajes sin responder'}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#94A3B8', fontSize: '12px', letterSpacing: '1px' }}>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>FECHA</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>NOMBRE DEL CONTACTO</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600' }}>CORREO ELECTRÓNICO (GMAIL)</th>
                  <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map((item) => {
                  const activa = filaSeleccionada === item.id;
                  return (
                    <tr
                      key={item.id}
                      onMouseEnter={() => setFilaSeleccionada(item.id)}
                      onClick={() => setConsultaAbierta(item)}
                      style={{
                        backgroundColor: activa ? 'rgba(0, 243, 255, 0.10)' : 'rgba(15, 23, 42, 0.65)',
                        boxShadow: activa
                          ? 'inset 0 0 0 1.5px #00f3ff, 0 0 18px rgba(0, 243, 255, 0.25)'
                          : 'inset 0 0 0 1px rgba(148, 163, 184, 0.12)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <td style={{ padding: '16px 18px', color: '#CBD5E1', fontSize: '14px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {!item.respondido && (
                            <span
                              title="Sin responder"
                              style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00f3ff', display: 'inline-block' }}
                            />
                          )}
                          {item.fecha}
                        </div>
                      </td>

                      <td style={{ padding: '16px 18px', color: '#F8FAFC', fontWeight: '500', fontSize: '15px' }}>
                        {item.nombre}
                      </td>

                      <td style={{ padding: '16px 18px', color: '#38BDF8', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={16} color="#38BDF8" />
                          <span>{item.email}</span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 18px', textAlign: 'right', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConsultaAbierta(item);
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(0, 243, 255, 0.4)',
                            color: '#00f3ff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Eye size={14} /> Ver mensaje
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {consultaAbierta && (
            <div
              style={{
                marginTop: '24px',
                backgroundColor: '#070f1d',
                border: '1px solid #00f3ff',
                borderRadius: '10px',
                padding: '22px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#00f3ff', fontFamily: 'monospace' }}>
                    RECIBIDO EL {consultaAbierta.fecha}
                  </span>
                  <h3 style={{ margin: '4px 0', color: '#F8FAFC', fontSize: '19px' }}>
                    {consultaAbierta.asunto}
                  </h3>
                  <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>
                    De: <strong style={{ color: '#E2E8F0' }}>{consultaAbierta.nombre}</strong> ({consultaAbierta.email})
                  </p>
                </div>
                <button
                  onClick={() => setConsultaAbierta(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#E2E8F0',
                  lineHeight: '1.6',
                  fontSize: '14px',
                }}
              >
                {consultaAbierta.mensaje}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => marcarComoRespondido(consultaAbierta.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #10B981',
                    color: '#10B981',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                  }}
                >
                  <CheckCircle2 size={16} />
                  {consultaAbierta.respondido ? 'Marcar como pendiente' : 'Marcar como respondido'}
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(consultaAbierta.email)}&su=${encodeURIComponent('Re: ' + consultaAbierta.asunto)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    if (!consultaAbierta.respondido) marcarComoRespondido(consultaAbierta.id);
                  }}
                  style={{
                    backgroundColor: '#00f3ff',
                    color: '#030a16',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Responder en Gmail <ExternalLink size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // VISTA VISITANTE SIN SESIÓN vs USUARIO LOGUEADO REAL
  return (
    <section id="consultas" style={{ maxWidth: '750px', margin: '50px auto', padding: '0 20px' }}>
      <div
        style={{
          backgroundColor: '#0b1526',
          border: '1px solid rgba(0, 243, 255, 0.25)',
          borderRadius: '14px',
          padding: '32px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <span style={{ color: '#00f3ff', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>
            // CONTACTO DIRECTO
          </span>
          <h2 style={{ fontSize: '26px', color: '#F8FAFC', margin: '6px 0' }}>
            Enviar una Consulta
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            ¿Tenés una propuesta laboral o proyecto en mente? Escribinos directamente desde tu cuenta.
          </p>
        </div>

        {!estaLogueado ? (
          <div
            style={{
              textAlign: 'center',
              padding: '36px 20px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px dashed rgba(0, 243, 255, 0.35)',
              borderRadius: '10px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 243, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
              }}
            >
              <Lock size={24} color="#00f3ff" />
            </div>
            <h3 style={{ color: '#F8FAFC', fontSize: '18px', margin: '0 0 8px 0' }}>
              Iniciá sesión para enviar consultas
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              Para evitar spam y responderte directamente a tu correo verificado, necesitás ingresar con tu cuenta de usuario.
            </p>
            {onIrALogin && (
              <button
                type="button"
                onClick={onIrALogin}
                style={{
                  backgroundColor: '#00f3ff',
                  color: '#030a16',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              >
                [ IR A INICIAR SESIÓN ]
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleEnviarConsulta} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', marginBottom: '6px' }}>
                  Usuario conectado
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#F8FAFC',
                    fontSize: '14px',
                  }}
                >
                  <User size={16} color="#00f3ff" />
                  <span>{usuarioActual.nombre || usuarioActual.username}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', marginBottom: '6px' }}>
                  Correo electrónico de respuesta
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#38BDF8',
                    fontSize: '14px',
                  }}
                >
                  <Mail size={16} color="#00f3ff" />
                  <span>{usuarioActual.email}</span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '13px', marginBottom: '6px' }}>
                Asunto
              </label>
              <input
                type="text"
                placeholder="Ej: Propuesta de proyecto web / Entrevista técnica"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#070f1d',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  padding: '11px 14px',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '13px', marginBottom: '6px' }}>
                Mensaje *
              </label>
              <textarea
                rows="4"
                required
                placeholder="Contanos los detalles de tu consulta o propuesta..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#070f1d',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  color: '#F8FAFC',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ color: '#64748B', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Tiempo estimado de respuesta: menos de 24 hs
              </span>

              <button
                type="submit"
                style={{
                  backgroundColor: '#00f3ff',
                  color: '#030a16',
                  border: 'none',
                  padding: '11px 24px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Send size={16} /> Enviar Consulta
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}