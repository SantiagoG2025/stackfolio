import React, { useState } from 'react';

export default function Consulta() {
  const [formData, setFormData] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setErrorEmail('El formato de correo no es válido');
      return;
    }
    setErrorEmail('');
    setEnviando(true);

    setTimeout(() => {
      setEnviando(false);
      setExito(true);
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      setTimeout(() => setExito(false), 4000);
    }, 1200);
  };

  return (
    <section style={{ padding: '60px 20px', maxWidth: '700px', margin: '0 auto', color: '#f8fafc' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Déjanos tu consulta</h2>
        <p style={{ color: '#94a3b8' }}>Hablemos. Dejame tu consulta y te respondo a la brevedad.</p>
      </div>

      {exito && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#10b981',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          ¡Tu consulta fue enviada con éxito!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#1e1b3a',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        borderRadius: '18px',
        padding: '30px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: '#94a3b8' }}>Nombre completo</label>
          <input 
            type="text" required placeholder="Ej. Juan Pérez"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#120e24', border: '1px solid #94a3b8', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: '#94a3b8' }}>Correo electrónico</label>
          <input 
            type="email" required placeholder="juan.perez@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#120e24', border: '1px solid #94a3b8', color: '#fff', boxSizing: 'border-box' }}
          />
          {errorEmail && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errorEmail}</span>}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: '#94a3b8' }}>Mensaje</label>
          <textarea 
            rows="4" required placeholder="Escribe tu consulta aquí..."
            value={formData.mensaje}
            onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#120e24', border: '1px solid #94a3b8', color: '#fff', resize: 'vertical', boxSizing: 'border-box' }}
          ></textarea>
        </div>

        <button 
          type="submit" disabled={enviando}
          style={{
            width: '100%', padding: '12px', fontSize: '1rem',
            backgroundColor: '#8b5cf6', color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: '600',
            cursor: enviando ? 'not-allowed' : 'pointer'
          }}
        >
          {enviando ? 'Enviando...' : 'Enviar Consulta'}
        </button>
      </form>
    </section>
  );
}