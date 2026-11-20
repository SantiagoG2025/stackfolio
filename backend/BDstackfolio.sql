CREATE DATABASE stackfolio_db;
GO

USE stackfolio_db;
GO

-- =============================================
-- 1. TABLA: USUARIOS
-- =============================================
CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'visitante'
        CHECK (rol IN ('visitante', 'usuario', 'admin')),
    fecha_registro DATETIME2 DEFAULT SYSDATETIME()
);

-- =============================================
-- 2. TABLA: PROYECTOS
-- =============================================
CREATE TABLE proyectos (
    id_proyecto INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    tagline VARCHAR(200),
    descripcion VARCHAR(MAX) NOT NULL,
    tecnologias VARCHAR(255),
    url_repositorio VARCHAR(255),
    url_demo VARCHAR(255),
    destacado BIT DEFAULT 0
);

-- =============================================
-- 3. TABLA: APTITUDES ACADEMICAS
-- =============================================
CREATE TABLE aptitudes (
    id_aptitud INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    institucion VARCHAR(120) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(MAX),
    estado VARCHAR(40) DEFAULT 'En curso'
);

-- =============================================
-- 4. TABLA: CONTACTOS (CONSULTAS RECIBIDAS)
-- =============================================
CREATE TABLE contactos (
    id_contacto INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mensaje VARCHAR(MAX) NOT NULL,
    leido BIT DEFAULT 0,
    fecha_envio DATETIME2 DEFAULT SYSDATETIME()
);

-- =============================================
-- 5. TABLA: VISITAS (INGRESOS AL SISTEMA)
-- =============================================
CREATE TABLE visitas (
    id_visita INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NULL,
    fecha_visita DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT fk_visita_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL
);

-- =============================================
-- ÍNDICES DE RENDIMIENTO
-- =============================================
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_contactos_fecha ON contactos(fecha_envio);
CREATE INDEX idx_visitas_usuario ON visitas(id_usuario);
GO

-- =============================================
-- CARGA DE DATOS REALES DEL PORTAFOLIO
-- =============================================

-- Usuarios (Administrador + Reclutadores/Visitantes registrados)
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Santiago Gómez (Admin)', 'admin@stackfolio.com', 'pbkdf2:sha256:600000$adminHashDemo2026', 'admin'),
('María Fernanda López', 'mflopez.rrhh@techsalta.com', 'pbkdf2:sha256:600000$userHash01', 'usuario'),
('Lucas Mateo Aráoz', 'laraoz.dev@gmail.com', 'pbkdf2:sha256:600000$userHash02', 'usuario'),
('Sofía Valentina Ruiz', 'sruiz.talent@globant-rec.ar', 'pbkdf2:sha256:600000$userHash03', 'usuario'),
('Martín Ezequiel Sosa', 'msosa.ucasal@hotmail.com', 'pbkdf2:sha256:600000$userHash04', 'usuario'),
('Carolina Andrea Méndez', 'cmendez@nortesoftware.com.ar', 'pbkdf2:sha256:600000$userHash05', 'usuario'),
('Diego Nicolás Torres', 'dtorres99@yahoo.com.ar', 'pbkdf2:sha256:600000$userHash06', 'usuario');

-- Proyectos de Santiago Gómez
INSERT INTO proyectos (titulo, categoria, tagline, descripcion, tecnologias, url_repositorio, url_demo, destacado) VALUES
('STACKFOLIO // CYBER AUTH', 'frontend', 'Sistema de autenticación y portafolio modular neón.', 'Plataforma web desacoplada con animaciones en canvas de Matrix digital y guardián felino programado puramente en vectores SVG.', 'React, Vite, JavaScript, SVG, CSS3', 'https://github.com/SantiagoG2025/stackfolio', 'https://stackfolio-demo.vercel.app', 1),
('SGA-SALTAVET', 'fullstack', 'Plataforma de gestión y telemetría administrativa.', 'Dashboard institucional diseñado para el control de flujos de datos, gestión de módulos y optimización de arquitectura frontend.', 'React, Tailwind CSS, DataTables, Git', 'https://github.com/SantiagoG2025/sga-saltavet', 'https://sga-saltavet.vercel.app', 1),
('NEON CANVAS ENGINE', 'engine', 'Motor de renderizado visual de lluvia digital.', 'Componente ligero sobre HTML5 Canvas que genera efectos de lluvia de caracteres neón optimizado para no consumir recursos excesivos de CPU.', 'JavaScript ES6+, HTML5 Canvas, Performance API', 'https://github.com/SantiagoG2025/neon-canvas-engine', 'https://neon-canvas-engine.vercel.app', 0),
('PARCIAL L4 // VALIDATOR', 'frontend', 'Módulo de registro con restricciones de alta seguridad.', 'Aplicación cliente con reglas de validación en tiempo real, indicadores de longitud de cadena y restricción estricta de 8 caracteres.', 'React, Vite, State Hooks, CSS Modules', 'https://github.com/SantiagoG2025/parcial-l4-validator', 'https://parcial-l4-validator.vercel.app', 0),
('ADVANCED CALCULUS VIZ', 'engine', 'Visualizador matemático para cálculo avanzado.', 'Herramienta gráfica interactiva desarrollada para simular ecuaciones diferenciales y curvas de nivel en entorno web.', 'JavaScript, Canvas 2D, MathFX, CSS Grid', 'https://github.com/SantiagoG2025/calculus-viz', 'https://calculus-viz.vercel.app', 0),
('SPORTS & METRICS DASHBOARD', 'fullstack', 'Telemetría de rendimiento físico y carreras 42K.', 'Panel de seguimiento y analítica de datos atléticos para el registro de tiempos, altimetría y mapa de rutas de trail running.', 'React, ChartJS, Tailwind CSS, REST API', 'https://github.com/SantiagoG2025/sports-metrics-dashboard', 'https://sports-metrics.vercel.app', 0);

-- Aptitudes Académicas
INSERT INTO aptitudes (titulo, institucion, periodo, descripcion, estado) VALUES
('Ingeniería en Informática', 'Universidad Católica de Salta (UCASAL)', '2024 - Actualidad', 'Formación en desarrollo de software, bases de datos relacionales (SQL Server), redes de computadoras y sistemas operativos.', 'En curso'),
('Desarrollo Web Full Stack (React + Flask)', 'Proyecto Integrador Lenguaje IV', '2026', 'Arquitectura cliente-servidor, autenticación con sesiones seguras, hashing de contraseñas y consumo de APIs REST.', 'Aprobado'),
('Modelado y Administración de Bases de Datos', 'UCASAL - Cátedra Bases de Datos', '2026', 'Diseño conceptual (DER), normalización, DDL/DML en T-SQL, procedimientos almacenados y triggers en SQL Server.', 'En curso');

-- Consultas de reclutadores y visitantes
INSERT INTO contactos (nombre, email, mensaje, leido) VALUES
('María Fernanda López', 'mflopez.rrhh@techsalta.com', 'Hola Santiago, revisamos tu portafolio Stackfolio y nos interesa coordinar una entrevista técnica para posición Frontend React Jr.', 0),
('Sofía Valentina Ruiz', 'sruiz.talent@globant-rec.ar', 'Excelente arquitectura modular y manejo de seguridad en rutas. ¿Tenés disponibilidad part-time este semestre?', 0),
('Carolina Andrea Méndez', 'cmendez@nortesoftware.com.ar', 'Nos gustaría conocer el código fuente de SGA-SALTAVET para un proyecto de gestión.', 1);

-- Historial de visitas / ingresos al sistema
INSERT INTO visitas (id_usuario, fecha_visita) VALUES
(2, DATEADD(HOUR, -1, SYSDATETIME())),
(2, DATEADD(HOUR, -5, SYSDATETIME())),
(2, DATEADD(DAY, -1, SYSDATETIME())),
(3, DATEADD(HOUR, -3, SYSDATETIME())),
(4, DATEADD(HOUR, -6, SYSDATETIME())),
(4, DATEADD(DAY, -1, SYSDATETIME())),
(5, DATEADD(DAY, -1, SYSDATETIME())),
(6, DATEADD(DAY, -2, SYSDATETIME())),
(7, DATEADD(DAY, -3, SYSDATETIME()));
GO

-- =============================================
-- CONSULTA DE VERIFICACIÓN PARA MOSTRAR EN VIVO
-- =============================================
SELECT u.nombre, u.email, u.rol, COUNT(v.id_visita) AS total_ingresos
FROM usuarios u
LEFT JOIN visitas v ON u.id_usuario = v.id_usuario
GROUP BY u.nombre, u.email, u.rol
ORDER BY total_ingresos DESC;