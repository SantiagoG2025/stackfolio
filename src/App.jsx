import React, { useState } from 'react';
import { Toaster } from 'sonner';

import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Projects from './componentes/Projects';
import { AptitudesAcademicas } from './componentes/AptitudesAcademicas';
import { ConsultasForm } from './componentes/ConsultasForm';

export default function App() {
  // Estado de navegación y autenticación
  const [vistaActual, setVistaActual] = useState('portafolio');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Verificamos si el usuario tiene rol de administrador
  const esAdmin = usuarioLogueado?.rol === 'admin';

  // Recibimos los datos del usuario al iniciar o cerrar sesión
  const manejarAutenticacion = (datosUsuario) => {
    setUsuarioLogueado(datosUsuario);

    if (datosUsuario) {
      setVistaActual('portafolio');
    }
  };

  // Cerramos la sesión del usuario
  const cerrarSesion = () => {
    setUsuarioLogueado(null);
    setVistaActual('portafolio');
  };

  return (
    <div
      style={{
        backgroundColor: '#030a16',
        minHeight: '100vh',
        color: '#00f3ff',
        paddingBottom: '50px',
      }}
    >
      <Toaster richColors theme="dark" position="bottom-right" />

      {/* BARRA DE NAVEGACIÓN */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          padding: '15px 30px',
          backgroundColor: 'rgba(3, 10, 22, 0.9)',
          borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Nombre del proyecto */}
        <h1
          onClick={() => setVistaActual('portafolio')}
          style={{
            color: '#00f3ff',
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '2px',
            fontSize: '1.2rem',
          }}
        >
          STACKFOLIO
        </h1>

        {/* Opciones de navegación */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => setVistaActual('portafolio')}
            style={{
              background: vistaActual === 'portafolio' ? '#00f3ff' : 'transparent',
              color: vistaActual === 'portafolio' ? '#030a16' : '#00f3ff',
              border: '1px solid #00f3ff',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {esAdmin ? 'Panel administrador' : 'Portafolio'}
          </button>

          {/* Login y registro solo para visitantes */}
          {!usuarioLogueado && (
            <>
              <button
                onClick={() => setVistaActual('login')}
                style={{
                  background: vistaActual === 'login' ? '#00f3ff' : 'transparent',
                  color: vistaActual === 'login' ? '#030a16' : '#00f3ff',
                  border: '1px solid #00f3ff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Login
              </button>

              <button
                onClick={() => setVistaActual('registro')}
                style={{
                  background: vistaActual === 'registro' ? '#00f3ff' : 'transparent',
                  color: vistaActual === 'registro' ? '#030a16' : '#00f3ff',
                  border: '1px solid #00f3ff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Registro
              </button>
            </>
          )}

          {/* Información y cierre de sesión */}
          {usuarioLogueado && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                onClick={cerrarSesion}
                style={{
                  background: 'rgba(255, 102, 139, 0.15)',
                  color: '#ff668b',
                  border: '1px solid #ff668b',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main>
        {vistaActual === 'portafolio' && (
          <>
            <Projects isAdmin={esAdmin} />

            <AptitudesAcademicas defaultIsAdmin={esAdmin} />

            <ConsultasForm
              usuarioActual={usuarioLogueado}
              isAdmin={esAdmin}
              onIrALogin={() => setVistaActual('login')}
            />
          </>
        )}

        {vistaActual === 'login' && (
          <Login
            onLoginSuccess={manejarAutenticacion}
            onIrARegistro={() => setVistaActual('registro')}
          />
        )}

        {vistaActual === 'registro' && (
          <Registro
            onRegistroSuccess={manejarAutenticacion}
            onIrALogin={() => setVistaActual('login')}
          />
        )}
      </main>
    </div>
  );
}