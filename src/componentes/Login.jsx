import React, { useState, useEffect, useRef } from 'react';
import GatoHolografico from './GatoHolografico';

export default function Login({onLoginSuccess}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');

  // Estados compatibles con el nuevo gato 3D
  const [estadoGato, setEstadoGato] = useState('esperando');
  const [loginExitoso, setLoginExitoso] = useState(false);

  const canvasRef = useRef(null);

  // FONDO MATRIX
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

  // VOLVER AL ESTADO NORMAL AL ESCRIBIR
  const manejarCambio = (setter) => (e) => {
    setter(e.target.value);

    if (!loginExitoso) {
      setEstadoGato('esperando');
      setError('');
    }
  };

  // VERIFICACIÓN DEL LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('ERROR: Todos los campos son obligatorios.');
      setEstadoGato('incorrecta');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('SEC_ERROR: Formato de correo electrónico inválido.');
      setEstadoGato('incorrecta');
      return;
    }

    if (password.length < 6) {
      setError('SEC_ERROR: La contraseña debe tener al menos 6 caracteres.');
      setEstadoGato('incorrecta');
      return;
    }

    // ACCESO CORRECTO
    setError('');
    setEstadoGato('correcta');
    setLoginExitoso(true);

    const emailNormalizado = email.trim().toLowerCase();
    const esAdmin = emailNormalizado === 'admin@stackfolio.com';

    if (onLoginSuccess) {
      onLoginSuccess({
        nombre: esAdmin ? 'Administrador Stackfolio' : emailNormalizado.split('@')[0],
        email: emailNormalizado,
        rol: esAdmin ? 'admin' : 'usuario',
      });
    }
  };

  // CERRAR SESIÓN
  const reiniciarLogin = () => {
    setEmail('');
    setPassword('');
    setMostrarPassword(false);
    setError('');
    setLoginExitoso(false);
    setEstadoGato('esperando');
    if (onLoginSuccess) onLoginSuccess(null);
  };

  // COLOR DINÁMICO
  const neonColor =
    estadoGato === 'incorrecta'
      ? '#ff668b'
      : estadoGato === 'correcta'
      ? '#4affb0'
      : '#00eaff';

  // MENSAJE DINÁMICO
  const mensajeGato =
    estadoGato === 'incorrecta'
      ? '// ACCESO DENEGADO: GUARDIÁN MOLESTO //'
      : estadoGato === 'correcta'
      ? '// ACCESO CONCEDIDO: GUARDIÁN FELIZ //'
      : '// SISTEMA ACTIVO: GUARDIÁN EN ESPERA //';

  return (
    <section
      style={{
        position: 'relative',
        padding: '30px 20px',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00eaff',
        fontFamily: 'monospace, sans-serif',
        backgroundColor: '#030a16',
        overflow: 'hidden'
      }}
    >

      {/* FONDO MATRIX */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          opacity: 0.35,
          pointerEvents: 'none'
        }}
      />

      {/* LÍNEAS DIGITALES */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          position: 'relative',
          zIndex: 2
        }}
      >

        {/* GATO HOLOGRÁFICO 3D */}
        <div style={{ marginBottom: '10px' }}>
          <GatoHolografico resultado={estadoGato} />
        </div>

        {/* ENCABEZADO */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>

          <h2
            style={{
              fontSize: '2rem',
              marginBottom: '4px',
              color: neonColor,
              fontWeight: '900',
              letterSpacing: '3px',
              textShadow: `0 0 12px ${neonColor}`,
              textTransform: 'uppercase',
              transition: 'color 0.3s ease'
            }}
          >
            [ STACKFOLIO ]
          </h2>

          <p
            style={{
              color: neonColor,
              fontSize: '0.75rem',
              letterSpacing: '1.5px',
              transition: 'color 0.3s ease'
            }}
          >
            {mensajeGato}
          </p>

        </div>

        {/* ACCESO EXITOSO */}
        {loginExitoso ? (

          <div
            style={{
              backgroundColor: 'rgba(4, 18, 38, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '2px solid #4affb0',
              borderRadius: '12px',
              padding: '35px 25px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(0, 255, 102, 0.3)'
            }}
          >

            <h3
              style={{
                color: '#4affb0',
                marginBottom: '15px',
                textShadow: '0 0 10px rgba(0,255,102,0.6)'
              }}
            >
              [ ACCESS_GRANTED ]
            </h3>

            <p
              style={{
                color: '#00b8d4',
                fontSize: '0.9rem',
                marginBottom: '20px'
              }}
            >
              ¡Bienvenido! El guardián holográfico ha validado tus credenciales.
            </p>

            <button
              onClick={reiniciarLogin}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                background: 'rgba(0, 255, 102, 0.15)',
                color: '#4affb0',
                border: '1px solid #4affb0',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                boxShadow: '0 0 10px rgba(0, 255, 102, 0.3)'
              }}
            >
              CERRAR SESIÓN
            </button>

          </div>

        ) : (

          /* FORMULARIO */
          <form
            onSubmit={handleLogin}
            style={{
              backgroundColor: 'rgba(4, 18, 38, 0.85)',
              backdropFilter: 'blur(8px)',
              border: `2px solid ${neonColor}`,
              borderRadius: '12px',
              padding: '25px',
              boxShadow: `0 0 25px ${neonColor}66`,
              transition: 'border 0.3s ease, box-shadow 0.3s ease'
            }}
          >

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                style={{
                  backgroundColor: 'rgba(255, 0, 85, 0.15)',
                  border: '1px solid #ff668b',
                  color: '#ff668b',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  boxShadow: '0 0 15px rgba(255, 0, 85, 0.3)'
                }}
              >
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div style={{ marginBottom: '16px' }}>

              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  marginBottom: '6px',
                  color: '#00eaff',
                  fontWeight: '700',
                  letterSpacing: '1.5px'
                }}
              >
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                placeholder="user@domain.com"
                value={email}
                onChange={manejarCambio(setEmail)}
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  background: 'rgba(2, 10, 24, 0.9)',
                  border: '1px solid #00eaff',
                  color: '#00eaff',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem'
                }}
              />

            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: '20px' }}>

              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  marginBottom: '6px',
                  color: '#00eaff',
                  fontWeight: '700',
                  letterSpacing: '1.5px'
                }}
              >
                PASSWORD
              </label>

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >

                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={manejarCambio(setPassword)}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 12px',
                    borderRadius: '4px',
                    background: 'rgba(2, 10, 24, 0.9)',
                    border: `1px solid ${neonColor}`,
                    color: '#00eaff',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem'
                  }}
                />

                {/* MOSTRAR / OCULTAR CONTRASEÑA */}
                <button
                  type="button"
                  aria-label={
                    mostrarPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: '#00eaff',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex'
                  }}
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
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
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
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>

                  )}

                </button>

              </div>

            </div>

            {/* BOTÓN DE INGRESO */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                background: 'rgba(0, 243, 255, 0.15)',
                color: '#00eaff',
                border: '2px solid #00eaff',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
              }}
            >
              EXECUTE_LOGIN
            </button>

          </form>

        )}

      </div>

    </section>
  );
}
