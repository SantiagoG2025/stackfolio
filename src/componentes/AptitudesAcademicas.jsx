import React, { useState, useEffect } from 'react';
import {
  Pencil,
  Save,
  X,
  Plus,
  ShieldCheck,
  User
} from 'lucide-react';

const API_URL = 'http://localhost:5000';

export const AptitudesAcademicas = ({ defaultIsAdmin = false }) => {

  // El rol proviene de la sesión autenticada.
  // No se permite alternar manualmente entre roles.
  const isAdmin = defaultIsAdmin;

  const [estudios, setEstudios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const [newEntry, setNewEntry] = useState({
    titulo: '',
    institucion: '',
    estado: '',
    competencias: ''
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // =============================================
  // CARGAR FORMACIÓN DESDE FLASK / SQL SERVER
  // =============================================

  const cargarEstudios = async () => {
    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(`${API_URL}/api/formacion`, {
        method: 'GET',
        credentials: 'include'
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || 'No se pudo cargar la formación académica.'
        );
      }

      setEstudios(
        Array.isArray(datos) ? datos : datos.formaciones || []
      );

    } catch (err) {
      console.error('Error al cargar formación:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstudios();
  }, []);

  // =============================================
  // OBTENER TOKEN CSRF
  // =============================================

  const obtenerCsrf = async () => {
    const respuesta = await fetch(`${API_URL}/api/auth/csrf`, {
      method: 'GET',
      credentials: 'include'
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el token de seguridad.');
    }

    return datos.csrf_token;
  };

  // =============================================
  // EDITAR REGISTRO
  // =============================================

  const startEdit = (item) => {
    setEditingId(item.id_formacion);

    setEditForm({
      titulo: item.titulo || '',
      institucion: item.institucion || '',
      estado: item.estado || '',
      competencias: item.competencias || ''
    });

    setIsAdding(false);
  };

  // =============================================
  // GUARDAR MODIFICACIONES
  // =============================================

  const saveEdit = async (e) => {
    e.preventDefault();

    if (!isAdmin || guardando) return;

    try {
      setGuardando(true);
      setError('');

      const csrfToken = await obtenerCsrf();

      const respuesta = await fetch(
        `${API_URL}/api/formacion/${editingId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify(editForm)
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo actualizar el registro.');
      }

      setEditingId(null);
      setEditForm({});

      await cargarEstudios();

    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  // =============================================
  // CANCELAR EDICIÓN
  // =============================================

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // =============================================
  // AGREGAR NUEVO REGISTRO
  // =============================================

  const saveNew = async (e) => {
    e.preventDefault();

    if (!isAdmin || guardando) return;

    if (!newEntry.titulo.trim()) {
      setError('El título de la formación es obligatorio.');
      return;
    }

    try {
      setGuardando(true);
      setError('');

      const csrfToken = await obtenerCsrf();

      const respuesta = await fetch(`${API_URL}/api/formacion`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(newEntry)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo agregar la formación.');
      }

      setNewEntry({
        titulo: '',
        institucion: '',
        estado: '',
        competencias: ''
      });

      setIsAdding(false);

      await cargarEstudios();

    } catch (err) {
      console.error('Error al agregar formación:', err);
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  // =============================================
  // CAMBIAR CAMPOS
  // =============================================

  const cancelarNuevo = () => {
    setIsAdding(false);

    setNewEntry({
      titulo: '',
      institucion: '',
      estado: '',
      competencias: ''
    });
  };

  // =============================================
  // INTERFAZ
  // =============================================

  return (
    <section style={{
      maxWidth: '850px',
      margin: '40px auto',
      padding: '0 16px'
    }}>

      {/* Contenedor tipo Ventana de Editor */}
      <div style={{
        backgroundColor: '#1E1B3A',
        borderRadius: '12px',
        border: '1px solid #334155',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>

        {/* Barra superior */}
        <div style={{
          backgroundColor: '#120E24',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155',
          flexWrap: 'wrap',
          gap: '8px'
        }}>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#EF4444'
            }}></span>

            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#F59E0B'
            }}></span>

            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10B981'
            }}></span>

            <span style={{
              marginLeft: '12px',
              backgroundColor: '#1E1B3A',
              color: '#38BDF8',
              padding: '4px 12px',
              borderRadius: '6px 6px 0 0',
              fontSize: '13px',
              fontWeight: '500',
              borderTop: '1px solid #334155',
              borderLeft: '1px solid #334155',
              borderRight: '1px solid #334155'
            }}>
              formacion_academica
            </span>
          </div>

          {/* Indicador de rol sin selector manual */}
          <div style={{
            backgroundColor: isAdmin
              ? 'rgba(139, 92, 246, 0.2)'
              : 'rgba(51, 65, 85, 0.4)',
            border: `1px solid ${isAdmin ? '#8B5CF6' : '#475569'}`,
            color: isAdmin ? '#C084FC' : '#94A3B8',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isAdmin ? (
              <>
                <ShieldCheck size={14} color="#8B5CF6" />
                Modo: Administrador
              </>
            ) : (
              <>
                <User size={14} color="#94A3B8" />
                Modo: Solo lectura
              </>
            )}
          </div>
        </div>

        {/* Cuerpo del Editor */}
        <div style={{
          padding: '24px 20px',
          fontFamily: 'Consolas, monospace',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>

          {error && (
            <div style={{
              color: '#FCA5A5',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '18px',
              fontFamily: 'Arial, sans-serif'
            }}>
              {error}
            </div>
          )}

          {cargando ? (
            <p style={{ color: '#94A3B8' }}>
              Cargando formación académica...
            </p>
          ) : (
            <>
              {estudios.map((item, index) => {
                const isEditing = editingId === item.id_formacion;

                return (
                  <div
                    key={item.id_formacion}
                    style={{
                      marginBottom: '24px',
                      paddingBottom: '20px',
                      borderBottom: index !== estudios.length - 1
                        ? '1px dashed #334155'
                        : 'none'
                    }}
                  >

                    {/* Cabecera del bloque formativo */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{
                          color: '#8B5CF6',
                          fontWeight: 'bold'
                        }}>
                          formacion
                        </span>

                        <span style={{
                          color: '#F8FAFC',
                          fontWeight: '600'
                        }}>
                          {item.titulo}
                        </span>
                      </div>

                      {isAdmin && !isEditing && (
                        <button
                          onClick={() => startEdit(item)}
                          title="Editar registro"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Pencil size={15} color="#94A3B8" />
                        </button>
                      )}

                      {isAdmin && isEditing && (
                        <div style={{
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <button
                            onClick={saveEdit}
                            disabled={guardando}
                            title="Guardar"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Save size={16} color="#10B981" />
                          </button>

                          <button
                            onClick={cancelEdit}
                            title="Cancelar"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={16} color="#EF4444" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Contenedor indentado */}
                    <div style={{
                      borderLeft: '2px solid #8B5CF6',
                      paddingLeft: '14px',
                      marginLeft: '6px'
                    }}>

                      {isEditing ? (
                        <form
                          onSubmit={saveEdit}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            marginTop: '8px'
                          }}
                        >
                          <label style={estiloLabel}>
                            Título:
                            <input
                              type="text"
                              value={editForm.titulo}
                              onChange={(e) => setEditForm({
                                ...editForm,
                                titulo: e.target.value
                              })}
                              required
                              style={estiloInput}
                            />
                          </label>

                          <label style={estiloLabel}>
                            Institución:
                            <input
                              type="text"
                              value={editForm.institucion}
                              onChange={(e) => setEditForm({
                                ...editForm,
                                institucion: e.target.value
                              })}
                              required
                              style={estiloInput}
                            />
                          </label>

                          <label style={estiloLabel}>
                            Estado:
                            <input
                              type="text"
                              value={editForm.estado}
                              onChange={(e) => setEditForm({
                                ...editForm,
                                estado: e.target.value
                              })}
                              required
                              style={estiloInput}
                            />
                          </label>

                          <label style={estiloLabel}>
                            Competencias Clave:
                            <textarea
                              value={editForm.competencias}
                              onChange={(e) => setEditForm({
                                ...editForm,
                                competencias: e.target.value
                              })}
                              style={{
                                ...estiloInput,
                                resize: 'vertical'
                              }}
                              rows="3"
                            />
                          </label>

                          <button
                            type="submit"
                            disabled={guardando}
                            style={botonGuardar}
                          >
                            <Save size={14} />
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                          </button>
                        </form>
                      ) : (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <div style={estiloLinea}>
                            <span style={puntos}>····</span>
                            <span style={nombreCampo}>institucion:</span>
                            <span style={{ color: '#F8FAFC' }}>
                              {item.institucion}
                            </span>
                          </div>

                          <div style={estiloLinea}>
                            <span style={puntos}>····</span>
                            <span style={nombreCampo}>estado:</span>
                            <span style={{ color: '#38BDF8' }}>
                              {item.estado}
                            </span>
                          </div>

                          <div style={estiloLinea}>
                            <span style={puntos}>····</span>
                            <span style={nombreCampo}>competencias:</span>
                            <span style={{
                              color: '#94A3B8',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {item.competencias}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {estudios.length === 0 && !isAdding && (
                <p style={{ color: '#94A3B8' }}>
                  No hay registros académicos disponibles.
                </p>
              )}

              {/* Agregar nuevo registro: solo administrador */}
              {isAdmin && (
                <div>
                  {isAdding ? (
                    <form
                      onSubmit={saveNew}
                      style={{
                        borderLeft: '2px solid #10B981',
                        paddingLeft: '14px',
                        marginLeft: '6px',
                        marginTop: '12px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <input
                          type="text"
                          placeholder="Título / Carrera"
                          value={newEntry.titulo}
                          onChange={(e) => setNewEntry({
                            ...newEntry,
                            titulo: e.target.value
                          })}
                          required
                          style={estiloInput}
                        />

                        <input
                          type="text"
                          placeholder="Institución"
                          value={newEntry.institucion}
                          onChange={(e) => setNewEntry({
                            ...newEntry,
                            institucion: e.target.value
                          })}
                          required
                          style={estiloInput}
                        />

                        <input
                          type="text"
                          placeholder="Estado (ej. En curso, Graduado)"
                          value={newEntry.estado}
                          onChange={(e) => setNewEntry({
                            ...newEntry,
                            estado: e.target.value
                          })}
                          required
                          style={estiloInput}
                        />

                        <textarea
                          placeholder="Competencias clave"
                          value={newEntry.competencias}
                          onChange={(e) => setNewEntry({
                            ...newEntry,
                            competencias: e.target.value
                          })}
                          rows="3"
                          style={{
                            ...estiloInput,
                            resize: 'vertical'
                          }}
                        />

                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: '4px'
                        }}>
                          <button
                            type="submit"
                            disabled={guardando}
                            style={botonGuardar}
                          >
                            <Save size={14} />
                            {guardando ? 'Guardando...' : 'Guardar'}
                          </button>

                          <button
                            type="button"
                            onClick={cancelarNuevo}
                            style={botonCancelar}
                          >
                            <X size={14} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsAdding(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B5CF6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        padding: '8px 0',
                        fontFamily: 'inherit'
                      }}
                    >
                      <Plus size={16} />
                      Agregar nuevo registro académico
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// =============================================
// ESTILOS
// =============================================

const estiloLabel = {
  color: '#94A3B8',
  fontSize: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '3px'
};

const estiloInput = {
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: '#120E24',
  color: '#F8FAFC',
  border: '1px solid #0EA5E9',
  borderRadius: '4px',
  padding: '7px'
};

const estiloLinea = {
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap'
};

const puntos = {
  color: '#475569',
  letterSpacing: '2px',
  userSelect: 'none',
  marginRight: '6px'
};

const nombreCampo = {
  color: '#0EA5E9',
  minWidth: '110px'
};

const botonGuardar = {
  backgroundColor: '#10B981',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '13px'
};

const botonCancelar = {
  backgroundColor: '#334155',
  color: '#F8FAFC',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '13px'
};