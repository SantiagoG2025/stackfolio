import React, { useState } from 'react';
import { Toaster } from 'sonner';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Projects from './componentes/Projects';
import { AptitudesAcademicas } from './componentes/AptitudesAcademicas';
import { ConsultasForm } from './componentes/ConsultasForm';

export default function App() {
  // Estado para controlar qué vista se muestra ('login', 'registro' o 'portafolio')
  const [vistaActual, setVistaActual] = useState('portafolio');

  return (
    <div style={{ backgroundColor: '#030a16', minHeight: '100vh', color: '#00f3ff', paddingBottom: '50px' }}>
      {/* Contenedor de notificaciones flotantes de Sonner */}
      <Toaster richColors theme="dark" position="bottom-right" />

      {/* Barra de navegación superior para probar y cambiar de vista */}
      <nav style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', padding: '20px', background: 'rgba(2,10,24,0.9)', borderBottom: '1px solid rgba(0,243,255,0.2)' }}>
        <button
          onClick={() => setVistaActual('portafolio')}
          style={{
            background: vistaActual === 'portafolio' ? '#00f3ff' : 'transparent',
            color: vistaActual === 'portafolio' ? '#030a16' : '#00f3ff',
            border: '1px solid #00f3ff', padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', borderRadius: '4px'
          }}
        >
          [ VISITANTE / PORTAFOLIO ]
        </button>

        <button
          onClick={() => setVistaActual('login')}
          style={{
            background: vistaActual === 'login' ? '#00f3ff' : 'transparent',
            color: vistaActual === 'login' ? '#030a16' : '#00f3ff',
            border: '1px solid #00f3ff', padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', borderRadius: '4px'
          }}
        >
          [ LOGIN ]
        </button>

        <button
          onClick={() => setVistaActual('registro')}
          style={{
            background: vistaActual === 'registro' ? '#00f3ff' : 'transparent',
            color: vistaActual === 'registro' ? '#030a16' : '#00f3ff',
            border: '1px solid #00f3ff', padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', borderRadius: '4px'
          }}
        >
          [ REGISTRO ]
        </button>
      </nav>

      {/* Renderizado condicional: muestra la vista según el botón que elijas */}
      <main>
        {vistaActual === 'portafolio' && (
          <>
            <Projects />
            <AptitudesAcademicas defaultIsAdmin={false} />
            <ConsultasForm defaultIsLoggedIn={false} />
          </>
        )}
        {vistaActual === 'login' && <Login />}
        {vistaActual === 'registro' && <Registro />}
      </main>
    </div>
  );
}