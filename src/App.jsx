import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Projects from './componentes/Projects';
import { AptitudesAcademicas } from './componentes/AptitudesAcademicas';
import { ConsultasForm } from './componentes/ConsultasForm';
import { Ingresos } from './componentes/Ingresos';

export default function App() {
  const [vistaActual, setVistaActual] = useState('portafolio');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const esAdmin = usuarioLogueado?.rol === 'admin';

  const manejarAutenticacion = (datosUsuario) => {
    setUsuarioLogueado(datosUsuario);
    if (datosUsuario) {
      setVistaActual('portafolio');
    }
  };

  return (
    <div style={{ backgroundColor: '#030a16', minHeight: '100vh', color: '#00f3ff', paddingBottom: '50px' }}>
      <Toaster richColors theme="dark" position="bottom-right" />
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 28px',
          background: 'rgba(2,10,24,0.95)',
          borderBottom: '1px solid rgba(0,243,255,0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          onClick={() => setVistaActual('portafolio')}
          style={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: '1rem',
            letterSpacing: '2px',
            color: '#00f3ff',
            cursor: 'pointer',
          }}
        >
          &lt;SANTIAGO_GÓMEZ /&gt;
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => setVistaActual('portafolio')}
            style={{
              background: vistaActual === 'portafolio' ? '#00f3ff' : 'transparent',
              color: vistaActual === 'portafolio' ? '#030a16' : '#00f3ff',
              border: '1px solid #00f3ff',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              borderRadius: '4px',
            }}
          >
            {esAdmin ? '[ PANEL ADMINISTRADOR ]' : '[ VISITANTE / PORTAFOLIO ]'}
          </button>

          {esAdmin && (
            <button
              onClick={() => setVistaActual('ingresos')}
              style={{
                background: vistaActual === 'ingresos' ? '#4affb0' : 'transparent',
                color: vistaActual === 'ingresos' ? '#030a16' : '#4affb0',
                border: '1px solid #4affb0',
                padding: '8px 16px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                borderRadius: '4px',
              }}
            >
              [ INGRESOS & MÉTRICAS ]
            </button>
          )}

          {!usuarioLogueado && (
            <>
              <button
                onClick={() => setVistaActual('login')}
                style={{
                  background: vistaActual === 'login' ? '#00f3ff' : 'transparent',
                  color: vistaActual === 'login' ? '#030a16' : '#00f3ff',
                  border: '1px solid #00f3ff',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                }}
              >
                [ LOGIN ]
              </button>
              <button
                onClick={() => setVistaActual('registro')}
                style={{
                  background: vistaActual === 'registro' ? '#00f3ff' : 'transparent',
                  color: vistaActual === 'registro' ? '#030a16' : '#00f3ff',
                  border: '1px solid #00f3ff',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                }}
              >
                [ REGISTRO ]
              </button>
            </>
          )}

          {usuarioLogueado && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: esAdmin ? '#4affb0' : '#00eaff',
                  border: `1px solid ${esAdmin ? '#4affb0' : '#00eaff'}`,
                  padding: '6px 12px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0, 243, 255, 0.08)',
                }}
              >
                {esAdmin ? 'ROL: ADMIN' : `USUARIO: ${usuarioLogueado.nombre}`}
              </span>
              <button
                onClick={() => {
                  setUsuarioLogueado(null);
                  setVistaActual('portafolio');
                }}
                style={{
                  background: 'rgba(255, 102, 139, 0.15)',
                  color: '#ff668b',
                  border: '1px solid #ff668b',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                }}
              >
                [ CERRAR SESIÓN ]
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        {vistaActual === 'portafolio' && (
          <>
            <Projects
              usuarioActual={usuarioLogueado}
              onIrALogin={() => setVistaActual('login')}
            />
            <AptitudesAcademicas defaultIsAdmin={esAdmin} />
            <ConsultasForm
              usuarioActual={usuarioLogueado}
              isAdmin={esAdmin}
              onIrALogin={() => setVistaActual('login')}
            />
          </>
        )}

        {vistaActual === 'ingresos' && esAdmin && <Ingresos />}
        {vistaActual === 'login' && <Login onLoginSuccess={manejarAutenticacion} />}
        {vistaActual === 'registro' && <Registro onRegistroSuccess={manejarAutenticacion} />}
      </main>
    </div>
  );
}