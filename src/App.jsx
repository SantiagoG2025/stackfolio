import React, { useState } from 'react';
import Registro from './componentes/Registro';
import Login from './componentes/Login'; // Asegúrate de tener tu componente Login
import Projects from './componentes/Projects'; // Tu componente de portafolio

export default function App() {
  // Estados posibles: 'portafolio', 'login', 'registro'
  const [vistaActual, setVistaActual] = useState('portafolio');

  return (
    <div style={{ backgroundColor: '#030a16', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px 30px', borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
        backgroundColor: 'rgba(3, 10, 22, 0.9)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <h1 
          onClick={() => setVistaActual('portafolio')}
          style={{ color: '#00f3ff', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px', fontSize: '1.2rem' }}
        >
          STACKFOLIO
        </h1>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setVistaActual('portafolio')}
            style={{
              background: vistaActual === 'portafolio' ? '#00f3ff' : 'transparent',
              color: vistaActual === 'portafolio' ? '#030a16' : '#00f3ff',
              border: '1px solid #00f3ff', padding: '8px 16px', borderRadius: '6px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
            }}
          >
            Portafolio
          </button>

          <button 
            onClick={() => setVistaActual('login')}
            style={{
              background: vistaActual === 'login' ? '#00f3ff' : 'transparent',
              color: vistaActual === 'login' ? '#030a16' : '#00f3ff',
              border: '1px solid #00f3ff', padding: '8px 16px', borderRadius: '6px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
            }}
          >
            Login
          </button>

          <button 
            onClick={() => setVistaActual('registro')}
            style={{
              background: vistaActual === 'registro' ? '#00f3ff' : 'transparent',
              color: vistaActual === 'registro' ? '#030a16' : '#00f3ff',
              border: '1px solid #00f3ff', padding: '8px 16px', borderRadius: '6px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
            }}
          >
            Registro
          </button>
        </div>
      </nav>

      {/* RENDERIZADO CONDICIONAL DE LAS VISTAS */}
      <main>
        {vistaActual === 'portafolio' && <Projects />}
        {vistaActual === 'login' && <Login onIrARegistro={() => setVistaActual('registro')} onLoginExitoso={() => setVistaActual('portafolio')} />}
        {vistaActual === 'registro' && <Registro onIrALogin={() => setVistaActual('login')} />}
      </main>

    </div>
  );
}