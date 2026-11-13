import React, { useState } from 'react';
import { Pencil, Save, X, Plus, ShieldCheck, User } from 'lucide-react';

export const AptitudesAcademicas = ({ defaultIsAdmin = false }) => {
  // Estado para alternar entre modo Visitante y Administrador
  const [isAdmin, setIsAdmin] = useState(defaultIsAdmin);

  // Lista de diccionarios / clave-valor formativos
  const [estudios, setEstudios] = useState([
    {
      id: 1,
      titulo: 'Ingeniería en Informática',
      institucion: 'Universidad Católica de Salta',
      estado: 'En curso - 3er año',
      competencias: 'Bases de Datos SQL, Algoritmos, React, Python'
    },
    {
      id: 2,
      titulo: 'Formación Complementaria',
      institucion: 'Cursos & Certificaciones Técnicas',
      estado: 'Acreditado',
      competencias: 'Modelado Relacional SSMS, Git/GitHub, Análisis Numérico'
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    titulo: '',
    institucion: '',
    estado: '',
    competencias: ''
  });

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = (id) => {
    setEstudios(estudios.map((item) => (item.id === id ? editForm : item)));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveNew = () => {
    if (newEntry.titulo.trim()) {
      setEstudios([...estudios, { ...newEntry, id: Date.now() }]);
      setNewEntry({ titulo: '', institucion: '', estado: '', competencias: '' });
      setIsAdding(false);
    }
  };

  return (
    <section style={{ maxWidth: '850px', margin: '40px auto', padding: '0 16px' }}>
      {/* Contenedor tipo Ventana de Editor */}
      <div
        style={{
          backgroundColor: '#1E1B3A',
          borderRadius: '12px',
          border: '1px solid #334155',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        {/* Barra superior de la ventana */}
        <div
          style={{
            backgroundColor: '#120E24',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {/* Botones de ventana + pestaña */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>

            <span
              style={{
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
              }}
            >
              formacion_academica
            </span>
          </div>

          {/* Switch de Rol: Alterna entre Visitante y Administrador */}
          <button
            onClick={() => {
              setIsAdmin(!isAdmin);
              setEditingId(null);
              setIsAdding(false);
            }}
            title="Alternar vista para pruebas"
            style={{
              backgroundColor: isAdmin ? 'rgba(139, 92, 246, 0.2)' : 'rgba(51, 65, 85, 0.4)',
              border: `1px solid ${isAdmin ? '#8B5CF6' : '#475569'}`,
              color: isAdmin ? '#C084FC' : '#94A3B8',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {isAdmin ? (
              <>
                <ShieldCheck size={14} color="#8B5CF6" /> Modo: Administrador
              </>
            ) : (
              <>
                <User size={14} color="#94A3B8" /> Modo: Visitante (Lectura)
              </>
            )}
          </button>
        </div>

        {/* Cuerpo del Editor */}
        <div style={{ padding: '24px 20px', fontFamily: 'Consolas, monospace', fontSize: '14px', lineHeight: '1.6' }}>
          {estudios.map((item, index) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: index !== estudios.length - 1 ? '1px dashed #334155' : 'none'
                }}
              >
                {/* Cabecera del bloque formativo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>formacion</span>
                    <span style={{ color: '#F8FAFC', fontWeight: '600' }}>{item.titulo}</span>
                  </div>

                  {/* Acciones de edición visibles únicamente para el Administrador */}
                  {isAdmin && !isEditing && (
                    <button
                      onClick={() => startEdit(item)}
                      title="Editar registro"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    >
                      <Pencil size={15} color="#94A3B8" />
                    </button>
                  )}

                  {isAdmin && isEditing && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => saveEdit(item.id)}
                        title="Guardar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Save size={16} color="#10B981" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        title="Cancelar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <X size={16} color="#EF4444" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Contenedor indentado con la barra morada estructural a la izquierda */}
                <div style={{ borderLeft: '2px solid #8B5CF6', paddingLeft: '14px', marginLeft: '6px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      <label style={{ color: '#94A3B8', fontSize: '12px' }}>
                        Título:
                        <input
                          type="text"
                          value={editForm.titulo}
                          onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                          style={{ width: '100%', backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px', marginTop: '2px' }}
                        />
                      </label>
                      <label style={{ color: '#94A3B8', fontSize: '12px' }}>
                        Institución:
                        <input
                          type="text"
                          value={editForm.institucion}
                          onChange={(e) => setEditForm({ ...editForm, institucion: e.target.value })}
                          style={{ width: '100%', backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px', marginTop: '2px' }}
                        />
                      </label>
                      <label style={{ color: '#94A3B8', fontSize: '12px' }}>
                        Estado:
                        <input
                          type="text"
                          value={editForm.estado}
                          onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                          style={{ width: '100%', backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px', marginTop: '2px' }}
                        />
                      </label>
                      <label style={{ color: '#94A3B8', fontSize: '12px' }}>
                        Competencias Clave:
                        <input
                          type="text"
                          value={editForm.competencias}
                          onChange={(e) => setEditForm({ ...editForm, competencias: e.target.value })}
                          style={{ width: '100%', backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px', marginTop: '2px' }}
                        />
                      </label>
                    </div>
                  ) : (
                    /* Vista de lectura con puntos suspensivos que marcan la distancia de indentación */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#475569', letterSpacing: '2px', userSelect: 'none', marginRight: '6px' }}>····</span>
                        <span style={{ color: '#0EA5E9', minWidth: '110px' }}>institucion:</span>
                        <span style={{ color: '#F8FAFC' }}>{item.institucion}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#475569', letterSpacing: '2px', userSelect: 'none', marginRight: '6px' }}>····</span>
                        <span style={{ color: '#0EA5E9', minWidth: '110px' }}>estado:</span>
                        <span style={{ color: '#38BDF8' }}>{item.estado}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#475569', letterSpacing: '2px', userSelect: 'none', marginRight: '6px' }}>····</span>
                        <span style={{ color: '#0EA5E9', minWidth: '110px' }}>competencias:</span>
                        <span style={{ color: '#94A3B8' }}>{item.competencias}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Botón Administrador: Agregar nuevo registro */}
          {isAdmin && (
            <div>
              {isAdding ? (
                <div style={{ borderLeft: '2px solid #10B981', paddingLeft: '14px', marginLeft: '6px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Título / Carrera"
                      value={newEntry.titulo}
                      onChange={(e) => setNewEntry({ ...newEntry, titulo: e.target.value })}
                      style={{ backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px' }}
                    />
                    <input
                      type="text"
                      placeholder="Institución"
                      value={newEntry.institucion}
                      onChange={(e) => setNewEntry({ ...newEntry, institucion: e.target.value })}
                      style={{ backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px' }}
                    />
                    <input
                      type="text"
                      placeholder="Estado (ej. En curso, Graduado)"
                      value={newEntry.estado}
                      onChange={(e) => setNewEntry({ ...newEntry, estado: e.target.value })}
                      style={{ backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px' }}
                    />
                    <input
                      type="text"
                      placeholder="Competencias clave"
                      value={newEntry.competencias}
                      onChange={(e) => setNewEntry({ ...newEntry, competencias: e.target.value })}
                      style={{ backgroundColor: '#120E24', color: '#F8FAFC', border: '1px solid #0EA5E9', borderRadius: '4px', padding: '6px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                      <button
                        onClick={saveNew}
                        style={{ backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                      >
                        <Save size={14} /> Guardar
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        style={{ backgroundColor: '#334155', color: '#F8FAFC', border: 'none', borderRadius: '4px', padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                      >
                        <X size={14} /> Cancelar
                      </button>
                    </div>
                  </div>
                </div>
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
                  <Plus size={16} /> Agregar nuevo registro académico
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};