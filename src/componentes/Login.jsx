
import React, { useState, useEffect, useRef } from 'react';
import GatoHolografico from './GatoHolografico';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Estados del HoloCat
  const [estadoGato, setEstadoGato] = useState('tranquilo');
  const [loginExitoso, setLoginExitoso] = useState(false);

  const canvasRef = useRef(null);

  // =========================================
  // OBTENER TOKEN CSRF
  // =========================================

  useEffect(() => {
    const obtenerTokenCSRF = async () => {
      try {
        const respuesta = await fetch(
          'http://localhost:5000/api/auth/csrf',
          {
            method: 'GET',
            credentials: 'include'
          }
        );

        const data = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            data.error || 'No se pudo obtener el token CSRF.'
          );
        }

        setCsrfToken(data.csrf_token);

      } catch (error) {
        console.error('Error al obtener CSRF:', error);
        setError('ERROR: No se pudo preparar la autenticación.');
      }
    };

    obtenerTokenCSRF();
  }, []);

  // =========================================
  // FONDO MATRIX ORIGINAL
  // =========================================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let drops = [];
    let columns = 0;

    const letters = '01ABCDEFXYZ<>[]/\\@#*$_-+=';
    const fontSize = 14;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;

      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 10, 22, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f3ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const character = letters.charAt(
          Math.floor(Math.random() * letters.length)
        );

        ctx.fillText(character, i * fontSize, drops[i] * fontSize);

        if (
          drops[i] * fontSize > canvas.height &&
          Math.random() > 0.975
        ) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // =========================================
  // CAMBIOS EN LOS CAMPOS
  // =========================================

  const manejarCambio = (setter) => (e) => {
    setter(e.target.value);

    if (!loginExitoso) {
      setEstadoGato('tranquilo');
      setError('');
    }
  };

  // =========================================
  // VALIDACIÓN Y AUTENTICACIÓN DEL LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (cargando) return;

    if (!email.trim() || !password) {
      setError('ERROR: Todos los campos son obligatorios.');
      setEstadoGato('enojado');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('SEC_ERROR: Formato de correo electrónico inválido.');
      setEstadoGato('enojado');
      return;
    }

    if (password.length < 6) {
      setError('SEC_ERROR: La contraseña debe tener al menos 6 caracteres.');
      setEstadoGato('enojado');
      return;
    }

    if (!csrfToken) {
      setError('ERROR: El token de seguridad todavía no está disponible.');
      setEstadoGato('enojado');
      return;
    }

    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password
          })
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.error || 'Error al iniciar sesión.');
        setEstadoGato('enojado');
        return;
      }

      // ACCESO CORRECTO
      setEstadoGato('feliz');
      setLoginExitoso(true);

      // Guardar el nuevo token CSRF
      setCsrfToken(data.csrf_token);

      // Informar a App.jsx que el usuario inició sesión
      if (onLoginSuccess) {
        onLoginSuccess(data.usuario);
      }

    } catch (error) {
      console.error('Error en el login:', error);

      setError('ERROR: No se pudo conectar con el servidor.');
      setEstadoGato('enojado');

    } finally {
      setCargando(false);
    }
  };

  // =========================================
  // CERRAR SESIÓN REAL
  // =========================================

  const reiniciarLogin = async () => {
    if (!csrfToken) {
      setError('ERROR: No se encuentra el token de seguridad.');
      return;
    }

    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(
        'http://localhost:5000/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'X-CSRF-Token': csrfToken
          }
        }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          data.error || 'No se pudo cerrar la sesión.'
        );
      }

      // Limpiar el estado local
      setEmail('');
      setPassword('');
      setMostrarPassword(false);
      setLoginExitoso(false);
      setEstadoGato('esperando');
      setCsrfToken('');

      if (onLoginSuccess) {
        onLoginSuccess(null);
      }

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError(error.message);

    } finally {
      setCargando(false);
    }
  };

  // =========================================
  // COLORES DINÁMICOS
  // =========================================

  const neonColor =
    estadoGato === 'enojado'
      ? '#ff668b'
      : estadoGato === 'feliz'
      ? '#4affb0'
      : '#00eaff';

  // =========================================
  // MENSAJES DEL GATO
  // =========================================

  const mensajeGato =
    estadoGato === 'enojado'
      ? '// ACCESO DENEGADO: GUARDIÁN MOLESTO //'
      : estadoGato === 'feliz'
      ? '// ACCESO CONCEDIDO: GUARDIÁN FELIZ //'
      : '// SISTEMA ACTIVO: GUARDIÁN EN ESPERA //';

  return (
    <section className="login-page">

      {/* FONDO MATRIX */}
      <canvas
        ref={canvasRef}
        className="matrix-background"
      />

      {/* LÍNEAS DIGITALES ORIGINALES */}
      <div className="login-grid-overlay" />

      {/* LUCES DECORATIVAS */}
      <div className="login-glow login-glow-cyan" />
      <div className="login-glow login-glow-purple" />

      {/* CONTENIDO PRINCIPAL */}
      <div className="login-layout">

        {/* PANEL DEL HOLOCAT */}
        <section className="login-mascot-panel">

          <div className="login-heading">
            <h1>[ STACKFOLIO ]</h1>
            <span>Digital Guardian System</span>
          </div>

          <div className="mascot-stage">

            <div className="mascot-orbit" />

            <GatoHolografico
              estadoGato={estadoGato}
            />

          </div>

          <div
            className={`mascot-status ${
              estadoGato === 'enojado'
                ? 'status-error'
                : estadoGato === 'feliz'
                ? 'status-success'
                : ''
            }`}
          >
            {mensajeGato}
          </div>

        </section>

        {/* PANEL DEL LOGIN */}
        <section className="login-form-panel">

          {loginExitoso ? (

            /* ACCESO EXITOSO */

            <div className="login-success">

              <div className="success-icon">
                ✓
              </div>

              <h2>[ ACCESS_GRANTED ]</h2>

              <p>
                ¡Bienvenido! El guardián holográfico ha
                validado tus credenciales.
              </p>

              <button
                type="button"
                onClick={reiniciarLogin}
                className="login-submit success-button"
                disabled={cargando}
              >
                {cargando ? 'CERRANDO SESIÓN...' : 'CERRAR SESIÓN'}
              </button>

            </div>

          ) : (

            /* FORMULARIO */

            <>
              <div className="form-heading">
                <span className="system-label">
                  // AUTHENTICATION MODULE
                </span>

                <h2>Iniciar sesión</h2>

                <p>
                  Ingresá tus credenciales para acceder al sistema.
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="login-form"
              >

                {/* ERROR */}
                {error && (
                  <div
                    role="alert"
                    className="login-error"
                  >
                    {error}
                  </div>
                )}

                {/* EMAIL */}
                <div className="form-group">

                  <label htmlFor="login-email">
                    EMAIL ADDRESS
                  </label>

                  <div className="input-wrapper">

                    <input
                      id="login-email"
                      type="email"
                      placeholder="user@domain.com"
                      value={email}
                      onChange={manejarCambio(setEmail)}
                      autoComplete="username"
                      disabled={cargando}
                    />

                  </div>

                </div>

                {/* PASSWORD */}
                <div className="form-group">

                  <label htmlFor="login-password">
                    PASSWORD
                  </label>

                  <div className="input-wrapper">

                    <input
                      id="login-password"
                      type={mostrarPassword ? 'text' : 'password'}
                      placeholder="********"
                      value={password}
                      onChange={manejarCambio(setPassword)}
                      autoComplete="current-password"
                      disabled={cargando}
                    />

                    {/* MOSTRAR / OCULTAR */}

                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={
                        mostrarPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                      onClick={() => setMostrarPassword(!mostrarPassword)}
                      disabled={cargando}
                    >

                      {mostrarPassword ? (

                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>

                      ) : (

                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>

                      )}

                    </button>

                  </div>

                  {/* PROGRESO DE CONTRASEÑA */}

                  <div className="password-progress">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <span
                        key={index}
                        className={password.length > index ? 'active' : ''}
                      />
                    ))}
                  </div>

                </div>

                {/* BOTÓN INGRESAR */}

                <button
                  type="submit"
                  className="login-submit"
                  disabled={cargando || !csrfToken}
                >
                  <span>
                    {cargando
                      ? 'AUTHENTICATING...'
                      : !csrfToken
                      ? 'PREPARING SECURITY...'
                      : 'EXECUTE_LOGIN'}
                  </span>
                  <span className="button-arrow">→</span>
                </button>

              </form>

              <div className="register-section">
                <span>STACKFOLIO // SECURE ACCESS</span>
              </div>

            </>

          )}

        </section>

      </div>

    </section>
  );
}

