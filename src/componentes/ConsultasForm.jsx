
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Send,
  Mail,
  CheckCircle2,
  Clock,
  User,
  Eye,
  ExternalLink,
  X,
} from 'lucide-react';

const API_URL = 'http://localhost:5000';

export function ConsultasForm({ usuarioActual = null, isAdmin = false }) {
  const [consultas, setConsultas] = useState([]);
  const [nombre, setNombre] = useState(usuarioActual?.nombre || '');
  const [email, setEmail] = useState(usuarioActual?.email || '');
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [consultaAbierta, setConsultaAbierta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const estaLogueado = Boolean(usuarioActual?.email);
  const esAdminActivo = isAdmin || usuarioActual?.rol === 'admin';

  useEffect(() => {
    setNombre(usuarioActual?.nombre || '');
    setEmail(usuarioActual?.email || '');
  }, [usuarioActual]);

  const obtenerTokenCSRF = async () => {
    const respuesta = await fetch(`${API_URL}/api/auth/csrf`, {
      method: 'GET',
      credentials: 'include',
    });

    const datos = await respuesta.json();

    if (!respuesta.ok || !datos.csrf_token) {
      throw new Error('No se pudo obtener el token de seguridad.');
    }

    return datos.csrf_token;
  };

  const cargarConsultas = async () => {
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/contacto`, {
        method: 'GET',
        credentials: 'include',
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudieron cargar las consultas.');
      }

      setConsultas(datos.consultas || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (esAdminActivo) {
      cargarConsultas();
    }
  }, [esAdminActivo]);

  const handleEnviarConsulta = async (e) => {
    e.preventDefault();

    if (!estaLogueado && (!nombre.trim() || !email.trim())) {
      toast.error('Completá tu nombre y correo electrónico.');
      return;
    }

    if (!mensaje.trim()) {
      toast.error('Escribí el detalle de tu consulta.');
      return;
    }

    setEnviando(true);

    try {
      const token = await obtenerTokenCSRF();

      const respuesta = await fetch(`${API_URL}/api/contacto`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          asunto: asunto.trim(),
          mensaje: mensaje.trim(),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo enviar la consulta.');
      }

      toast.success('¡Consulta enviada correctamente!');

      setAsunto('');
      setMensaje('');

      if (esAdminActivo) {
        await cargarConsultas();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const marcarComoRespondido = async (consulta) => {
    try {
      const token = await obtenerTokenCSRF();

      const respuesta = await fetch(
        `${API_URL}/api/contacto/${consulta.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token,
          },
          body: JSON.stringify({
            respondido: !consulta.respondido,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo actualizar el estado.');
      }

      const consultaActualizada = {
        ...consulta,
        respondido: !consulta.respondido,
      };

      setConsultas((prev) =>
        prev.map((item) =>
          item.id === consulta.id ? consultaActualizada : item
        )
      );

      if (consultaAbierta?.id === consulta.id) {
        setConsultaAbierta(consultaActualizada);
      }

      toast.success('Estado de la consulta actualizado.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --------------------------------------------------
  // VISTA ADMINISTRADOR
  // --------------------------------------------------

  if (esAdminActivo) {
    const sinResponder = consultas.filter((c) => !c.respondido).length;

    return (
      <section
        id="consultas"
        style={{
          maxWidth: '1050px',
          margin: '40px auto',
          padding: '0 20px',
        }}
      >
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
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#F8FAFC',
                  margin: 0,
                }}
              >
                Bandeja de Consultas Recibidas
              </h2>

              <p
                style={{
                  color: '#94A3B8',
                  fontSize: '15px',
                  margin: '6px 0 0',
                }}
              >
                Consultas recibidas a través del formulario de contacto.
              </p>
            </div>

            <div
              style={{
                color: '#E2E8F0',
                backgroundColor: 'rgba(0, 243, 255, 0.08)',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              <strong style={{ color: '#00f3ff' }}>
                {sinResponder}
              </strong>{' '}
              {sinResponder === 1
                ? 'Mensaje sin responder'
                : 'Mensajes sin responder'}
            </div>
          </div>

          {cargando ? (
            <p style={{ color: '#94A3B8' }}>Cargando consultas...</p>
          ) : consultas.length === 0 ? (
            <p style={{ color: '#94A3B8' }}>
              Todavía no se recibieron consultas.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0 8px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      textAlign: 'left',
                      color: '#94A3B8',
                      fontSize: '12px',
                      letterSpacing: '1px',
                    }}
                  >
                    <th style={{ padding: '12px 18px' }}>FECHA</th>
                    <th style={{ padding: '12px 18px' }}>CONTACTO</th>
                    <th style={{ padding: '12px 18px' }}>CORREO ELECTRÓNICO</th>
                    <th style={{ padding: '12px 18px', textAlign: 'right' }}>
                      ACCIÓN
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {consultas.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setConsultaAbierta(item)}
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        cursor: 'pointer',
                      }}
                    >
                      <td
                        style={{
                          padding: '16px 18px',
                          color: '#CBD5E1',
                          fontSize: '14px',
                        }}
                      >
                        {!item.respondido && (
                          <span
                            title="Sin responder"
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#00f3ff',
                              display: 'inline-block',
                              marginRight: '8px',
                            }}
                          />
                        )}
                        {item.fecha}
                      </td>

                      <td
                        style={{
                          padding: '16px 18px',
                          color: '#F8FAFC',
                          fontWeight: '500',
                        }}
                      >
                        {item.nombre}
                      </td>

                      <td
                        style={{
                          padding: '16px 18px',
                          color: '#38BDF8',
                          fontSize: '14px',
                        }}
                      >
                        <Mail
                          size={16}
                          style={{
                            display: 'inline',
                            verticalAlign: 'middle',
                            marginRight: '8px',
                          }}
                        />
                        {item.email}
                      </td>

                      <td
                        style={{
                          padding: '16px 18px',
                          textAlign: 'right',
                        }}
                      >
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
                            cursor: 'pointer',
                          }}
                        >
                          <Eye size={14} /> Ver mensaje
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#00f3ff',
                      fontFamily: 'monospace',
                    }}
                  >
                    RECIBIDO EL {consultaAbierta.fecha}
                  </span>

                  <h3
                    style={{
                      margin: '4px 0',
                      color: '#F8FAFC',
                      fontSize: '19px',
                    }}
                  >
                    {consultaAbierta.asunto}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: '#94A3B8',
                      fontSize: '14px',
                    }}
                  >
                    De:{' '}
                    <strong style={{ color: '#E2E8F0' }}>
                      {consultaAbierta.nombre}
                    </strong>{' '}
                    ({consultaAbierta.email})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setConsultaAbierta(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
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
                  whiteSpace: 'pre-wrap',
                }}
              >
                {consultaAbierta.mensaje}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={() => marcarComoRespondido(consultaAbierta)}
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
                  }}
                >
                  <CheckCircle2 size={16} />
                  {consultaAbierta.respondido
                    ? 'Marcar como pendiente'
                    : 'Marcar como respondido'}
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    consultaAbierta.email
                  )}&su=${encodeURIComponent(
                    'Re: ' + consultaAbierta.asunto
                  )}`}
                  target="_blank"
                  rel="noreferrer"
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

  // --------------------------------------------------
  // FORMULARIO PÚBLICO: VISITANTE O USUARIO
  // --------------------------------------------------

  return (
    <section
      id="consultas"
      style={{
        maxWidth: '750px',
        margin: '50px auto',
        padding: '0 20px',
      }}
    >
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
          <span
            style={{
              color: '#00f3ff',
              fontFamily: 'monospace',
              fontSize: '13px',
              letterSpacing: '1px',
            }}
          >
            // CONTACTO DIRECTO
          </span>

          <h2
            style={{
              fontSize: '26px',
              color: '#F8FAFC',
              margin: '6px 0',
            }}
          >
            Enviar una Consulta
          </h2>

          <p
            style={{
              color: '#94A3B8',
              fontSize: '14px',
              margin: 0,
            }}
          >
            ¿Tenés una propuesta laboral o proyecto en mente? Escribinos
            directamente. No necesitás registrarte para contactarnos.
          </p>
        </div>

        <form
          onSubmit={handleEnviarConsulta}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#94A3B8',
                  fontSize: '13px',
                  marginBottom: '6px',
                }}
              >
                {estaLogueado ? 'Usuario conectado' : 'Tu nombre *'}
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
                }}
              >
                <User size={16} color="#00f3ff" />

                <input
                  type="text"
                  required
                  maxLength={100}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  readOnly={estaLogueado}
                  placeholder="Ingresá tu nombre"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#F8FAFC',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  color: '#94A3B8',
                  fontSize: '13px',
                  marginBottom: '6px',
                }}
              >
                Correo electrónico *
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
                }}
              >
                <Mail size={16} color="#00f3ff" />

                <input
                  type="email"
                  required
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={estaLogueado}
                  placeholder="tu correo electrónico"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#38BDF8',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: '#CBD5E1',
                fontSize: '13px',
                marginBottom: '6px',
              }}
            >
              Asunto
            </label>

            <input
              type="text"
              maxLength={200}
              placeholder="Ej: Propuesta de proyecto web / Entrevista técnica"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
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
            <label
              style={{
                display: 'block',
                color: '#CBD5E1',
                fontSize: '13px',
                marginBottom: '6px',
              }}
            >
              Mensaje *
            </label>

            <textarea
              rows="4"
              required
              maxLength={5000}
              placeholder="Contanos los detalles de tu consulta o propuesta..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span
              style={{
                color: '#64748B',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Clock size={14} />
              Tiempo estimado de respuesta: menos de 24 hs
            </span>

            <button
              type="submit"
              disabled={enviando}
              style={{
                backgroundColor: '#00f3ff',
                color: '#030a16',
                border: 'none',
                padding: '11px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: enviando ? 'wait' : 'pointer',
                opacity: enviando ? 0.6 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Send size={16} />
              {enviando ? 'Enviando...' : 'Enviar Consulta'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
