import React, { useState, useEffect, useRef } from 'react';

export default function Registro() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [usuarioGenerado, setUsuarioGenerado] = useState('');
  
  const canvasRef = useRef(null);

  // Fondo Matrix de fondo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const letters = '01ABCDEFXYZ<>[]/\\@#*$_-+=';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 10, 22, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f3ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
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

  const generarUsernameAutomatico = (nombre) => {
    if (!nombre.trim()) return 'user_01';
    const primerNombre = nombre.trim().toLowerCase().split(' ')[0];
    const aleatorio = Math.floor(1000 + Math.random() * 9000);
    return `${primerNombre}_${aleatorio}`;
  };

  const handleRegistro = (e) => {
    e.preventDefault();

    if (!nombreCompleto || !email || !password) {
      setError('ERROR: Todos los campos son obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('SEC_ERROR: Formato de correo electrónico inválido.');
      return;
    }

    if (password.length !== 8) {
      setError('SEC_ERROR: La contraseña debe tener exactamente 8 caracteres.');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('SEC_ERROR: La contraseña debe incluir al menos una letra mayúscula.');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('SEC_ERROR: La contraseña debe incluir al menos un número.');
      return;
    }

    const username = generarUsernameAutomatico(nombreCompleto);
    setUsuarioGenerado(username);
    setError('');
    setRegistroExitoso(true);
  };

  const reiniciarRegistro = () => {
    setNombreCompleto('');
    setEmail('');
    setPassword('');
    setRegistroExitoso(false);
    setUsuarioGenerado('');
    setError('');
  };

  const len = password.length;
  const esLongitudValida = len === 8;

  const obtenerMensajeCaracteres = () => {
    if (len === 0) return '* Requiere 8 caracteres (1 mayúscula, 1 número).';
    if (len < 8) return `* Faltan ${8 - len} caracteres para completar los 8.`;
    if (len === 8) return '* ¡Longitud exacta de 8 caracteres alcanzada!';
    return `* ¡Te pasaste por ${len - 8} caracteres! (Máximo 8).`;
  };

  return (
    <section style={{ 
      position: 'relative',
      padding: '60px 20px', 
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00f3ff',
      fontFamily: 'monospace, sans-serif',
      backgroundColor: '#030a16',
      overflow: 'hidden'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 1, opacity: 0.35, pointerEvents: 'none'
        }}
      />

      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        zIndex: 1, pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '440px', width: '100%', position: 'relative', zIndex: 2 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '2.5rem', marginBottom: '6px', color: '#00f3ff',
            fontWeight: '900', letterSpacing: '3px',
            textShadow: '0 0 12px rgba(0, 243, 255, 0.8)', textTransform: 'uppercase'
          }}>
            [ REGISTRO ]
          </h2>
          <p style={{ color: '#00b8d4', fontSize: '0.85rem', letterSpacing: '1.5px' }}>
            // ACCESO AL SISTEMA STACKFOLIO //
          </p>
        </div>

        {registroExitoso ? (
          <div style={{
            backgroundColor: 'rgba(4, 18, 38, 0.9)', backdropFilter: 'blur(8px)',
            border: '2px solid #00ff66', borderRadius: '12px', padding: '40px 30px',
            textAlign: 'center', boxShadow: '0 0 30px rgba(0, 255, 102, 0.3)'
          }}>
            <h3 style={{ color: '#00ff66', fontSize: '1.3rem', marginBottom: '15px', letterSpacing: '1.5px' }}>
              [ USER_REGISTERED_SUCCESS ]
            </h3>
            <p style={{ color: '#00b8d4', fontSize: '0.9rem', marginBottom: '10px' }}>
              Tu cuenta ha sido creada exitosamente. Nombre de usuario asignado:
            </p>
            <div style={{
              backgroundColor: 'rgba(2, 10, 24, 0.95)', border: '1px solid #00f3ff',
              borderRadius: '6px', padding: '16px', fontSize: '1.4rem',
              color: '#00f3ff', fontWeight: 'bold', letterSpacing: '2px', margin: '20px 0'
            }}>
              @{usuarioGenerado}
            </div>
            <button onClick={reiniciarRegistro} style={{
              width: '100%', padding: '12px', fontSize: '0.95rem',
              background: 'rgba(0, 243, 255, 0.15)', color: '#00f3ff',
              border: '1px solid #00f3ff', borderRadius: '4px', fontWeight: 'bold',
              cursor: 'pointer', letterSpacing: '1.5px', textTransform: 'uppercase'
            }}>
              REGISTRAR OTRO USUARIO
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegistro} style={{
            backgroundColor: 'rgba(4, 18, 38, 0.85)', backdropFilter: 'blur(8px)',
            border: '2px solid #00f3ff', borderRadius: '12px', padding: '35px',
            boxShadow: '0 0 25px rgba(0, 243, 255, 0.3)'
          }}>
            
            {error && (
              <div style={{
                backgroundColor: 'rgba(255, 0, 85, 0.15)', border: '1px solid #ff0055',
                color: '#ff0055', padding: '12px 16px', borderRadius: '4px',
                marginBottom: '20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: '#00f3ff', fontWeight: '700', letterSpacing: '1.5px' }}>
                NOMBRE COMPLETO
              </label>
              <input 
                type="text" placeholder="Ej. Dalila Morales"
                value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 14px', borderRadius: '4px', 
                  background: 'rgba(2, 10, 24, 0.9)', border: '1px solid #00f3ff', 
                  color: '#00f3ff', boxSizing: 'border-box', outline: 'none',
                  fontFamily: 'monospace', fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: '#00f3ff', fontWeight: '700', letterSpacing: '1.5px' }}>
                EMAIL ADDRESS
              </label>
              <input 
                type="email" placeholder="user@domain.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 14px', borderRadius: '4px', 
                  background: 'rgba(2, 10, 24, 0.9)', border: '1px solid #00f3ff', 
                  color: '#00f3ff', boxSizing: 'border-box', outline: 'none',
                  fontFamily: 'monospace', fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: '#00f3ff', fontWeight: '700', letterSpacing: '1.5px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={mostrarPassword ? "text" : "password"} placeholder="********"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    width: '100%', padding: '12px 42px 12px 14px', borderRadius: '4px', 
                    background: 'rgba(2, 10, 24, 0.9)', 
                    border: `2px solid ${esLongitudValida ? '#00ff66' : '#00f3ff'}`, 
                    color: '#00f3ff', boxSizing: 'border-box', outline: 'none',
                    fontFamily: 'monospace', fontSize: '1rem'
                  }}
                />
                <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} style={{
                  position: 'absolute', right: '10px', background: 'none',
                  border: 'none', color: '#00f3ff', cursor: 'pointer', padding: '0', display: 'flex'
                }}>
                  {mostrarPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <p style={{ 
              color: esLongitudValida ? '#00ff66' : '#00b8d4', 
              fontSize: '0.75rem', marginBottom: '25px', opacity: 0.9
            }}>
              {obtenerMensajeCaracteres()}
            </p>

            <button type="submit" style={{
              width: '100%', padding: '14px', fontSize: '1.1rem',
              background: 'rgba(0, 243, 255, 0.15)', color: '#00f3ff',
              border: '2px solid #00f3ff', borderRadius: '4px', fontWeight: 'bold',
              cursor: 'pointer', letterSpacing: '2px', textTransform: 'uppercase',
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
            }}>
              EXECUTE_REGISTER
            </button>
          </form>
        )}
      </div>
    </section>
  );
}