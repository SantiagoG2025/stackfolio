
import React from 'react';

export default function PerfilPublico() {
  const proyectos = [
    {
      id: 1,
      titulo: 'TP9 - React',
      descripcion:
        'Aplicación web desarrollada con React y publicada mediante Vercel.',
      tecnologia: ['React', 'JavaScript', 'Vercel'],
      url: 'https://tp-9-react-mu.vercel.app'
    },
    {
      id: 2,
      titulo: 'Zona Padel',
      descripcion:
        'Sitio web dedicado al pádel, con información sobre el deporte y su circuito profesional.',
      tecnologia: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
      url: 'https://santiagog2025.github.io/PrimerDeploy/'
    }
  ];

  return (
    <section style={{
      backgroundColor: '#030a16',
      color: '#00f3ff',
      padding: '65px 20px',
      fontFamily: 'monospace, sans-serif'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: 'auto'
      }}>

        {/* PRESENTACIÓN */}
        <div style={{
          textAlign: 'center',
          marginBottom: '45px'
        }}>
          <span style={{
            color: '#00ff66',
            letterSpacing: '3px',
            fontSize: '0.8rem'
          }}>
            // DEVELOPER PROFILE //
          </span>

          <h1 style={{
            fontSize: '2.8rem',
            margin: '15px 0',
            textShadow: '0 0 18px rgba(0,243,255,0.5)'
          }}>
            SANTIAGO GOMEZ
          </h1>

          <h2 style={{
            color: '#00b8d4',
            fontSize: '1.1rem'
          }}>
            Estudiante de Ingeniería en Informática
          </h2>

          <p style={{
            color: '#94a3b8',
            lineHeight: '1.8',
            maxWidth: '750px',
            margin: '20px auto'
          }}>
            Estudiante de Ingeniería en Informática en UCASAL,
            orientado al desarrollo Full Stack, con especial interés
            en backend, bases de datos y construcción de aplicaciones
            web. Enfocado en desarrollar soluciones integrales mediante
            APIs, sistemas de información y arquitecturas desacopladas.
          </p>
        </div>

        {/* ESPECIALIDADES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '55px'
        }}>
          {[
            {
              titulo: 'BACKEND',
              detalle: 'Python, Flask y desarrollo de APIs REST'
            },
            {
              titulo: 'BASES DE DATOS',
              detalle: 'SQL Server, SQL y modelado de datos'
            },
            {
              titulo: 'FRONTEND',
              detalle: 'React, JavaScript, HTML y CSS'
            }
          ].map((item) => (
            <div key={item.titulo} style={{
              background: 'rgba(4,18,38,0.85)',
              border: '1px solid rgba(0,243,255,0.3)',
              borderRadius: '10px',
              padding: '22px',
              textAlign: 'center'
            }}>
              <h3 style={{
                color: '#00ff66',
                fontSize: '1rem'
              }}>
                {item.titulo}
              </h3>

              <p style={{
                color: '#94a3b8',
                fontSize: '0.85rem',
                lineHeight: '1.6'
              }}>
                {item.detalle}
              </p>
            </div>
          ))}
        </div>

        {/* PROYECTOS PUBLICADOS */}
        <div>
          <h2 style={{
            textAlign: 'center',
            fontSize: '1.8rem',
            marginBottom: '30px'
          }}>
            [ PROYECTOS PUBLICADOS ]
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '22px'
          }}>
            {proyectos.map((proyecto) => (
              <article key={proyecto.id} style={{
                background: 'rgba(4,18,38,0.85)',
                border: '1px solid rgba(0,243,255,0.3)',
                borderRadius: '12px',
                padding: '25px'
              }}>
                <h3 style={{
                  color: '#00f3ff',
                  marginBottom: '12px'
                }}>
                  {proyecto.titulo}
                </h3>

                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  minHeight: '65px'
                }}>
                  {proyecto.descripcion}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '7px',
                  margin: '18px 0'
                }}>
                  {proyecto.tecnologia.map((tech) => (
                    <span key={tech} style={{
                      color: '#00f3ff',
                      border: '1px solid rgba(0,243,255,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '0.7rem'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={proyecto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '11px',
                    background: 'rgba(0,243,255,0.12)',
                    border: '1px solid #00f3ff',
                    borderRadius: '5px',
                    color: '#00f3ff',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  VISITAR PROYECTO ↗
                </a>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
