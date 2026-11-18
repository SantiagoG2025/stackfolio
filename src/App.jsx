
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Projects from './componentes/Projects';
import { AptitudesAcademicas } from './componentes/AptitudesAcademicas';
import { ConsultasForm } from './componentes/ConsultasForm';
import PerfilPublico from './componentes/PerfilPublico';

const API_URL = 'http://localhost:5000';

export default function App() {
  // Estado de navegación y autenticación
  const [vistaActual, setVistaActual] = useState('portafolio');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Estados auxiliares
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  // Verificamos si el usuario tiene rol de administrador
  const esAdmin = usuarioLogueado?.rol === 'admin';

  // Recuperar la sesión al cargar o recargar la aplicación
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/auth/session`, {
          method: 'GET',
          credentials: 'include'
        });

        if (respuesta.ok) {
          const resultado = await respuesta.json();

          if (resultado.autenticado && resultado.usuario) {
            setUsuarioLogueado(resultado.usuario);
          } else {
            setUsuarioLogueado(null);
          }
        } else if (respuesta.status === 401) {
          // No existe una sesión autenticada
          setUsuarioLogueado(null);
        } else {
          console.error('Error al verificar la sesión:', respuesta.status);
        }

      } catch (error) {
        console.error('No se pudo conectar con el backend:', error);
      } finally {
        setVerificandoSesion(false);
      }
    };

    verificarSesion();
  }, []);

  // Recibimos los datos del usuario al iniciar o cerrar sesión
  const manejarAutenticacion = (datosUsuario) => {
    setUsuarioLogueado(datosUsuario);

    if (datosUsuario) {
      setVistaActual('portafolio');
    }
  };

  // Registrar un usuario y enviarlo al Login
  const manejarRegistroExitoso = () => {
    toast.success('¡Registro completado correctamente!');
    setVistaActual('login');
  };

  // Cerrar sesión en el servidor y en React
  const cerrarSesion = async () => {
    if (cerrandoSesion) return;

    try {
      setCerrandoSesion(true);

      // Obtener el token CSRF de la sesión actual
      const respuestaCSRF = await fetch(`${API_URL}/api/auth/csrf`, {
        method: 'GET',
        credentials: 'include'
      });

      const datosCSRF = await respuestaCSRF.json();

      if (!respuestaCSRF.ok || !datosCSRF.csrf_token) {
        throw new Error('No se pudo obtener el token de seguridad.');
      }

      // Solicitar al backend que destruya la sesión
      const respuestaLogout = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': datosCSRF.csrf_token
        }
      });

      const resultado = await respuestaLogout.json();

      if (!respuestaLogout.ok) {
        throw new Error(resultado.error || 'No se pudo cerrar la sesión.');
      }

      // Limpiar el estado local únicamente después del cierre en el servidor
      setUsuarioLogueado(null);
      setVistaActual('portafolio');

      toast.success('Sesión cerrada correctamente.');

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error(error.message || 'No se pudo cerrar la sesión.');

    } finally {
      setCerrandoSesion(false);
    }
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
          {!usuarioLogueado && !verificandoSesion && (
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
                disabled={cerrandoSesion}
                style={{
                  background: 'rgba(255, 102, 139, 0.15)',
                  color: '#ff668b',
                  border: '1px solid #ff668b',
                  padding: '8px 14px',
                  cursor: cerrandoSesion ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  opacity: cerrandoSesion ? 0.6 : 1,
                }}
              >
                {cerrandoSesion ? 'Cerrando...' : 'Cerrar sesión'}
              </button>
            </div>
          )}

          {verificandoSesion && (
            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              Verificando sesión...
            </span>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main>
        {vistaActual === 'portafolio' && (
          <>            
            <Projects isAdmin={esAdmin} />

            <AptitudesAcademicas defaultIsAdmin={esAdmin} />

            <PerfilPublico />


            <ConsultasForm
              usuarioActual={usuarioLogueado}
              isAdmin={esAdmin}
              onIrALogin={() => setVistaActual('login')}
            />
          </>
        )}

        {vistaActual === 'login' && !usuarioLogueado && (
          <Login
            onLoginSuccess={manejarAutenticacion}
            onIrARegistro={() => setVistaActual('registro')}
          />
        )}

        {vistaActual === 'registro' && !usuarioLogueado && (
          <Registro
            onRegistroSuccess={manejarRegistroExitoso}
            onIrALogin={() => setVistaActual('login')}
          />
        )}
      </main>
    </div>
  );
}
