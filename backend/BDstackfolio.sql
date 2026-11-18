CREATE DATABASE stackfolio_db;


USE stackfolio_db;

-- =============================================
-- TABLA: USUARIOS
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
-- TABLA: PROYECTOS
-- =============================================

CREATE TABLE proyectos (
    id_proyecto INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(MAX) NOT NULL,
    tecnologias VARCHAR(255),
    url_repositorio VARCHAR(255),
    url_demo VARCHAR(255)
);


-- =============================================
-- TABLA: CONTACTOS
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
-- TABLA: VISITAS
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
-- ÍNDICES
-- =============================================

CREATE INDEX idx_usuarios_rol
    ON usuarios(rol);


CREATE INDEX idx_contactos_fecha
    ON contactos(fecha_envio);
