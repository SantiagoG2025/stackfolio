import React, { useState } from 'react';
import { Send, LogIn, UserPlus, UserCheck, UserX, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export const ConsultasForm = ({ defaultIsLoggedIn = false }) => {
  // Estado para alternar entre usuario logueado o visitante para pruebas
  const [isLoggedIn, setIsLoggedIn] = useState(defaultIsLoggedIn);

  // Datos simulados de la sesión activa
  const [currentUser] = useState({
    username: 'Sofía Aldana',
    email: 'sofia.aldana@empresa.com.ar'
  });

  // Campos del formulario simplificado
  const [formData, setFormData] = useState({
    asunto: '',
    mensaje: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.asunto.trim() || !formData.mensaje.trim()) {
      toast.error('Por favor, completá tanto el asunto como tu pregunta.');
      return;
    }

    setIsSubmitting(true);

    // Simulación de envío al backend
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('¡Consulta enviada con éxito!');
      setFormData({ asunto: '', mensaje: '' });
    }, 800);
  };

  return (
    <section style={{ maxWidth: '650px', margin: '40px auto', padding: '0 16px' }}>
      {/* Barra superior con alternador de estado de sesión para pruebas */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{
            backgroundColor: isLoggedIn ? 'rgba(14, 165, 233, 0.15)' : 'rgba(51, 65, 85, 0.4)',
            border: `1px solid ${isLoggedIn ? '#0EA5E9' : '#475569'}`,
            color: isLoggedIn ? '#38BDF8' : '#94A3B8',
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isLoggedIn ? (
            <>
              <UserCheck size={14} color="#0EA5E9" /> Sesión: Activa ({currentUser.username})
            </>
          ) : (
            <>
              <UserX size={14} color="#94A3B8" /> Sesión: Sin Iniciar (Visitante)
            </>
          )}
        </button>
      </div>

      {/* Contenedor principal de la tarjeta de consultas */}
      <div
        style={{
          backgroundColor: '#1E1B3A',
          borderRadius: '16px',
          border: '1px solid #334155',
          padding: '32px 28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          position: 'relative'
        }}
      >
        {!isLoggedIn ? (
          /* ESTADO A: USUARIO NO AUTENTICADO */
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}
            >
              <MessageSquare size={28} color="#8B5CF6" />
            </div>

            <h2 style={{ color: '#F8FAFC', fontSize: '22px', margin: '0 0 10px 0', fontWeight: '700' }}>
              ¿Querés ponerte en contacto?
            </h2>

            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', maxWidth: '440px', margin: '0 auto 24px auto' }}>
              Para enviar una propuesta o coordinar un proyecto con el desarrollador, por favor iniciá sesión con tu cuenta.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                style={{
                  backgroundColor: '#0EA5E9',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <LogIn size={16} /> Iniciar Sesión
              </button>

              <button
                type="button"
                style={{
                  backgroundColor: 'transparent',
                  color: '#F97316',
                  border: '1px solid #F97316',
                  borderRadius: '8px',
                  padding: '10px 22px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <UserPlus size={16} /> Crear Cuenta
              </button>
            </div>
          </div>
        ) : (
          /* ESTADO B: USUARIO AUTENTICADO */
          <div>
            <div style={{ marginBottom: '22px' }}>
              <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Bandeja de Contacto
              </span>
              <h2 style={{ color: '#F8FAFC', fontSize: '22px', margin: '4px 0 6px 0', fontWeight: '700' }}>
                Hola, {currentUser.username}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
                Escribí tu consulta y te responderemos a <span style={{ color: '#38BDF8' }}>{currentUser.email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Campo 1: Asunto */}
              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', marginBottom: '6px' }}>
                  Asunto de la consulta
                </label>
                <input
                  type="text"
                  placeholder="Ej. Propuesta de proyecto / Consulta sobre desarrollo"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#120E24',
                    color: '#F8FAFC',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#38BDF8')}
                  onBlur={(e) => (e.target.style.borderColor = '#334155')}
                />
              </div>

              {/* Campo 2: Pregunta / Mensaje */}
              <div>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '13px', marginBottom: '6px' }}>
                  Detalle de la consulta o pregunta
                </label>
                <textarea
                  rows="5"
                  placeholder="Contanos los detalles o requerimientos que tengas en mente..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#120E24',
                    color: '#F8FAFC',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#38BDF8')}
                  onBlur={(e) => (e.target.style.borderColor = '#334155')}
                />
              </div>

              {/* Botón de Envío */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#0EA5E9',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                  transition: 'opacity 0.2s ease',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <Send size={16} />
                {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};