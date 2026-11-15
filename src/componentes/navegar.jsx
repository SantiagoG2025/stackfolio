import React from 'react';

export default function Navegar({ vistaActual, setVistaActual }) {
  const enlaces = [
    { id: 'portafolio', label: 'Portafolio' },
    { id: 'academica', label: 'Académica' },
    { id: 'consulta', label: 'Consulta' },
    { id: 'login', label: 'Login' },
    { id: 'registro', label: 'Registro' },
  ];

  return (
    <nav className="flex flex-wrap justify-between items-center px-8 py-4 border-b border-[#00f3ff]/20 bg-[#030a16]/90 backdrop-blur-md sticky top-0 z-50">
      <button 
        onClick={() => setVistaActual('portafolio')}
        className="text-xl font-bold tracking-wider text-[#00f3ff] cursor-pointer"
      >
        STACKFOLIO
      </button>

      <div className="flex flex-wrap gap-3">
        {enlaces.map((item) => (
          <button
            key={item.id}
            onClick={() => setVistaActual(item.id)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
              vistaActual === item.id
                ? 'bg-[#00f3ff] text-[#030a16] font-bold shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                : 'border border-[#00f3ff]/30 text-[#f8fafc] hover:bg-[#00f3ff]/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}