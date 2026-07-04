-- ============================================
-- INTRANET ESCOLAR - Script SQL Completo
-- Base de datos: db_intranet_escolar
-- ============================================

DROP DATABASE IF EXISTS db_intranet_escolar;
CREATE DATABASE db_intranet_escolar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_intranet_escolar;

-- ============================================
-- 1. TABLA: usuario
-- ============================================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    rol ENUM('ADMIN','DIRECTOR','DOCENTE','ESTUDIANTE') NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_rol (rol)
) ENGINE=InnoDB;

-- ============================================
-- 2. TABLA: estudiante
-- ============================================
CREATE TABLE estudiante (
    id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
    codigo_estudiante VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NULL,
    apellidos VARCHAR(100) NULL,
    dni CHAR(8) UNIQUE,
    fecha_nacimiento DATE,
    direccion VARCHAR(200),
    telefono VARCHAR(15),
    perfil_completo BOOLEAN NOT NULL DEFAULT 0,
    usuario_id INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_apellidos (apellidos),
    INDEX idx_codigo (codigo_estudiante)
) ENGINE=InnoDB;

-- ============================================
-- 3. TABLA: docente
-- ============================================
CREATE TABLE docente (
    id_docente INT AUTO_INCREMENT PRIMARY KEY,
    codigo_docente VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NULL,
    apellidos VARCHAR(100) NULL,
    dni CHAR(8) UNIQUE,
    especialidad VARCHAR(100),
    telefono VARCHAR(15),
    email VARCHAR(100),
    perfil_completo BOOLEAN NOT NULL DEFAULT 0,
    usuario_id INT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_apellidos_docente (apellidos)
) ENGINE=InnoDB;

-- ============================================
-- 4. TABLA: grado
-- ============================================
CREATE TABLE grado (
    id_grado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL UNIQUE,
    nivel ENUM('PRIMARIA') DEFAULT 'PRIMARIA',
    orden INT NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ============================================
-- 5. TABLA: seccion
-- ============================================
CREATE TABLE seccion (
    id_seccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre CHAR(1) NOT NULL,
    UNIQUE KEY uk_nombre (nombre)
) ENGINE=InnoDB;

-- ============================================
-- 6. TABLA: periodo_academico
-- ============================================
CREATE TABLE periodo_academico (
    id_periodo INT AUTO_INCREMENT PRIMARY KEY,
    anio YEAR NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    activo TINYINT(1) DEFAULT 0,
    UNIQUE KEY uk_anio (anio)
) ENGINE=InnoDB;

-- ============================================
-- 7. TABLA: asignatura
-- ============================================
CREATE TABLE asignatura (
    id_asignatura INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB;

-- ============================================
-- 8. TABLA: curso
-- ============================================
CREATE TABLE curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    asignatura_id INT NOT NULL,
    grado_id INT NOT NULL,
    seccion_id INT NOT NULL,
    periodo_academico_id INT NOT NULL,
    docente_id INT NOT NULL,
    FOREIGN KEY (asignatura_id) REFERENCES asignatura(id_asignatura)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (grado_id) REFERENCES grado(id_grado)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (seccion_id) REFERENCES seccion(id_seccion)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (periodo_academico_id) REFERENCES periodo_academico(id_periodo)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (docente_id) REFERENCES docente(id_docente)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uk_curso (asignatura_id, grado_id, seccion_id, periodo_academico_id),
    INDEX idx_grado_seccion (grado_id, seccion_id)
) ENGINE=InnoDB;

-- ============================================
-- 9. TABLA: matricula
-- ============================================
CREATE TABLE matricula (
    id_matricula INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha_matricula DATE NOT NULL,
    estado ENUM('ACTIVO','RETIRADO') DEFAULT 'ACTIVO',
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id_estudiante)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES curso(id_curso)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uk_matricula (estudiante_id, curso_id)
) ENGINE=InnoDB;

-- ============================================
-- 10. TABLA: evaluacion_periodo
-- ============================================
CREATE TABLE evaluacion_periodo (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    orden INT NOT NULL,
    periodo_academico_id INT NOT NULL,
    FOREIGN KEY (periodo_academico_id) REFERENCES periodo_academico(id_periodo)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_evaluacion_periodo (periodo_academico_id, nombre)
) ENGINE=InnoDB;

-- ============================================
-- 11. TABLA: nota
-- ============================================
CREATE TABLE nota (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    matricula_id INT NOT NULL,
    evaluacion_periodo_id INT NOT NULL,
    valor DECIMAL(4,2) CHECK (valor >= 0 AND valor <= 20),
    observacion VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (matricula_id) REFERENCES matricula(id_matricula)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (evaluacion_periodo_id) REFERENCES evaluacion_periodo(id_evaluacion)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uk_nota (matricula_id, evaluacion_periodo_id)
) ENGINE=InnoDB;

-- ============================================
-- 12. TABLA: asistencia
-- ============================================
CREATE TABLE asistencia (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    matricula_id INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('PRESENTE','AUSENTE','TARDANZA','JUSTIFICADO') NOT NULL,
    FOREIGN KEY (matricula_id) REFERENCES matricula(id_matricula)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_asistencia (matricula_id, fecha),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB;

-- ============================================
-- 13. TABLA: horario_curso
-- ============================================
CREATE TABLE horario_curso (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    curso_id INT NOT NULL,
    dia_semana TINYINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    aula VARCHAR(20),
    FOREIGN KEY (curso_id) REFERENCES curso(id_curso)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_dia (dia_semana)
) ENGINE=InnoDB;

-- ============================================
-- 14. TABLA: notificacion
-- ============================================
CREATE TABLE notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    usuario_emisor_id INT NOT NULL,
    usuario_receptor_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido TINYINT(1) DEFAULT 0,
    FOREIGN KEY (usuario_emisor_id) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (usuario_receptor_id) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_receptor (usuario_receptor_id, leido)
) ENGINE=InnoDB;

-- ============================================
-- 15. TABLA: comunicado
-- ============================================
CREATE TABLE comunicado (
    id_comunicado INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    usuario_autor_id INT NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion DATE NULL,
    dirigido_a ENUM('TODOS','DOCENTE','ESTUDIANTE','DIRECTOR','ADMIN') DEFAULT 'TODOS',
    FOREIGN KEY (usuario_autor_id) REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Migración: agregar perfil_completo y hacer nombres/apellidos NULLable
ALTER TABLE estudiante
  MODIFY COLUMN nombres VARCHAR(100) NULL,
  MODIFY COLUMN apellidos VARCHAR(100) NULL,
  ADD COLUMN perfil_completo BOOLEAN NOT NULL DEFAULT 0 AFTER telefono;

ALTER TABLE docente
  MODIFY COLUMN nombres VARCHAR(100) NULL,
  MODIFY COLUMN apellidos VARCHAR(100) NULL,
  ADD COLUMN perfil_completo BOOLEAN NOT NULL DEFAULT 0 AFTER email;

-- Marcar como completos los registros existentes que tengan nombres y apellidos
UPDATE estudiante SET perfil_completo = 1 WHERE nombres IS NOT NULL AND apellidos IS NOT NULL;
UPDATE docente SET perfil_completo = 1 WHERE nombres IS NOT NULL AND apellidos IS NOT NULL;

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- 1. Grados (1° a 6° de primaria)
INSERT INTO grado (id_grado, nombre, nivel, orden) VALUES
(1, '1°', 'PRIMARIA', 1),
(2, '2°', 'PRIMARIA', 2),
(3, '3°', 'PRIMARIA', 3),
(4, '4°', 'PRIMARIA', 4),
(5, '5°', 'PRIMARIA', 5),
(6, '6°', 'PRIMARIA', 6);

-- 2. Secciones (A, B)
INSERT INTO seccion (id_seccion, nombre) VALUES
(1, 'A'),
(2, 'B');

-- 3. Periodo académico (año 2026)
INSERT INTO periodo_academico (id_periodo, anio, nombre, fecha_inicio, fecha_fin, activo) VALUES
(1, 2026, 'Año Escolar 2026', '2026-03-01', '2026-12-18', 1);

-- 4. Asignaturas
INSERT INTO asignatura (id_asignatura, nombre, descripcion) VALUES
(1, 'Matemática', 'Razonamiento lógico, aritmética y geometría básica'),
(2, 'Comunicación', 'Lectoescritura, gramática y comprensión lectora'),
(3, 'Ciencia y Tecnología', 'Ciencias naturales y experimentación'),
(4, 'Personal Social', 'Desarrollo personal, ciudadanía e historia'),
(5, 'Inglés', 'Idioma extranjero básico'),
(6, 'Educación Física', 'Actividad deportiva y psicomotricidad');

-- 5. Usuarios (contraseña: 123456 - BCrypt hasheada)
INSERT INTO usuario (id_usuario, username, password_hash, email, rol, activo) VALUES
(1, 'admin', '123456', 'admin@colegio.edu.pe', 'ADMIN', 1),
(2, 'director', '123456', 'director@colegio.edu.pe', 'DIRECTOR', 1),
(3, 'juanperez', '123456', 'jperez@colegio.edu.pe', 'DOCENTE', 1),
(4, 'marialopez', '123456', 'mlopez@colegio.edu.pe', 'DOCENTE', 1),
(5, 'carlosgarcia', '123456', 'cgarcia@colegio.edu.pe', 'DOCENTE', 1),
(6, 'anatorres', '123456', 'atorres@colegio.edu.pe', 'DOCENTE', 1),
(7, 'luiscastillo', '123456', 'lcastillo@alumno.edu.pe', 'ESTUDIANTE', 1),
(8, 'mariavelarde', '123456', 'mvelarde@alumno.edu.pe', 'ESTUDIANTE', 1);

-- 6. Docentes
INSERT INTO docente (id_docente, codigo_docente, nombres, apellidos, dni, especialidad, telefono, email, perfil_completo, usuario_id) VALUES
(1, 'DOC001', 'Juan Carlos', 'Pérez García', '12345678', 'Matemática', '987654321', 'jperez@colegio.edu.pe', 1, 3),
(2, 'DOC002', 'María Elena', 'López Quispe', '23456789', 'Comunicación', '987654322', 'mlopez@colegio.edu.pe', 1, 4),
(3, 'DOC003', 'Carlos Alberto', 'García Torres', '34567890', 'Inglés', '987654323', 'cgarcia@colegio.edu.pe', 1, 5),
(4, 'DOC004', 'Ana María', 'Torres Ríos', '45678901', 'Educación Física', '987654324', 'atorres@colegio.edu.pe', 1, 6);

-- 7. Estudiantes
INSERT INTO estudiante (id_estudiante, codigo_estudiante, nombres, apellidos, dni, fecha_nacimiento, direccion, telefono, perfil_completo, usuario_id) VALUES
(1, 'EST001', 'Luis Fernando', 'Castillo Farro', '11111111', '2020-05-15', 'Av. Los Olivos 123', NULL, 1, 7),
(2, 'EST002', 'María José', 'Quispe Sulca', '22222222', '2020-07-21', 'Jr. Las Flores 456', NULL, 1, NULL),
(3, 'EST003', 'Juan Carlos', 'Pérez Tupayachi', '33333333', '2020-09-10', 'Calle Real 789', NULL, 1, NULL),
(4, 'EST004', 'Ana Paula', 'Tupayachi Carmen', '44444444', '2020-11-30', 'Av. Brasil 321', NULL, 1, NULL),
(5, 'EST005', 'Pedro Pablo', 'Arbi Pando', '55555555', '2020-03-05', 'Pasaje Los Cedros 654', NULL, 1, NULL),
(6, 'EST006', 'María Fernanda', 'Velarde Ochoa', '66666666', '2019-06-18', 'Av. La Marina 987', '987654325', 1, 8),
(7, 'EST007', 'José Antonio', 'Marcaquispe Sulca', '77777777', '2019-08-22', 'Jr. Los Sauces 111', NULL, 1, NULL);

-- 8. Cursos (1°A, 1°B, 2°A)
INSERT INTO curso (id_curso, asignatura_id, grado_id, seccion_id, periodo_academico_id, docente_id) VALUES
-- 1°A
(1, 1, 1, 1, 1, 1), (2, 2, 1, 1, 1, 2), (3, 3, 1, 1, 1, 1),
(4, 4, 1, 1, 1, 2), (5, 5, 1, 1, 1, 3), (6, 6, 1, 1, 1, 4),
-- 1°B
(7, 1, 1, 2, 1, 1), (8, 2, 1, 2, 1, 2), (9, 3, 1, 2, 1, 1),
(10, 4, 1, 2, 1, 2), (11, 5, 1, 2, 1, 3), (12, 6, 1, 2, 1, 4),
-- 2°A
(13, 1, 2, 1, 1, 1), (14, 2, 2, 1, 1, 2), (15, 3, 2, 1, 1, 3),
(16, 4, 2, 1, 1, 2), (17, 5, 2, 1, 1, 3), (18, 6, 2, 1, 1, 4);

-- 9. Matrículas
INSERT INTO matricula (id_matricula, estudiante_id, curso_id, fecha_matricula, estado) VALUES
-- Estudiante 1 (1°A)
(1, 1, 1, '2026-02-20', 'ACTIVO'), (2, 1, 2, '2026-02-20', 'ACTIVO'), (3, 1, 3, '2026-02-20', 'ACTIVO'),
(4, 1, 4, '2026-02-20', 'ACTIVO'), (5, 1, 5, '2026-02-20', 'ACTIVO'), (6, 1, 6, '2026-02-20', 'ACTIVO'),
-- Estudiante 2 (1°A)
(7, 2, 1, '2026-02-21', 'ACTIVO'), (8, 2, 2, '2026-02-21', 'ACTIVO'), (9, 2, 3, '2026-02-21', 'ACTIVO'),
(10, 2, 4, '2026-02-21', 'ACTIVO'), (11, 2, 5, '2026-02-21', 'ACTIVO'), (12, 2, 6, '2026-02-21', 'ACTIVO'),
-- Estudiante 3 (1°A)
(13, 3, 1, '2026-02-22', 'ACTIVO'), (14, 3, 2, '2026-02-22', 'ACTIVO'), (15, 3, 3, '2026-02-22', 'ACTIVO'),
(16, 3, 4, '2026-02-22', 'ACTIVO'), (17, 3, 5, '2026-02-22', 'ACTIVO'), (18, 3, 6, '2026-02-22', 'ACTIVO'),
-- Estudiante 4 (1°B)
(19, 4, 7, '2026-02-20', 'ACTIVO'), (20, 4, 8, '2026-02-20', 'ACTIVO'), (21, 4, 9, '2026-02-20', 'ACTIVO'),
(22, 4, 10, '2026-02-20', 'ACTIVO'), (23, 4, 11, '2026-02-20', 'ACTIVO'), (24, 4, 12, '2026-02-20', 'ACTIVO'),
-- Estudiante 5 (1°B)
(25, 5, 7, '2026-02-21', 'ACTIVO'), (26, 5, 8, '2026-02-21', 'ACTIVO'), (27, 5, 9, '2026-02-21', 'ACTIVO'),
(28, 5, 10, '2026-02-21', 'ACTIVO'), (29, 5, 11, '2026-02-21', 'ACTIVO'), (30, 5, 12, '2026-02-21', 'ACTIVO'),
-- Estudiante 6 (2°A)
(31, 6, 13, '2026-02-18', 'ACTIVO'), (32, 6, 14, '2026-02-18', 'ACTIVO'), (33, 6, 15, '2026-02-18', 'ACTIVO'),
(34, 6, 16, '2026-02-18', 'ACTIVO'), (35, 6, 17, '2026-02-18', 'ACTIVO'), (36, 6, 18, '2026-02-18', 'ACTIVO'),
-- Estudiante 7 (2°A)
(37, 7, 13, '2026-02-19', 'ACTIVO'), (38, 7, 14, '2026-02-19', 'ACTIVO'), (39, 7, 15, '2026-02-19', 'ACTIVO'),
(40, 7, 16, '2026-02-19', 'ACTIVO'), (41, 7, 17, '2026-02-19', 'ACTIVO'), (42, 7, 18, '2026-02-19', 'ACTIVO');

-- 10. Evaluaciones (4 bimestres)
INSERT INTO evaluacion_periodo (id_evaluacion, nombre, orden, periodo_academico_id) VALUES
(1, 'I Bimestre', 1, 1), (2, 'II Bimestre', 2, 1),
(3, 'III Bimestre', 3, 1), (4, 'IV Bimestre', 4, 1);

-- 11. Notas (I Bimestre para todos)
INSERT INTO nota (matricula_id, evaluacion_periodo_id, valor, observacion) VALUES
(1, 1, 15, 'Buen desempeño'), (2, 1, 16, NULL), (3, 1, 14, 'Puede mejorar'),
(4, 1, 18, 'Excelente participación'), (5, 1, 17, NULL), (6, 1, 20, 'Muy bien en deportes'),
(7, 1, 13, NULL), (8, 1, 15, NULL), (9, 1, 12, NULL),
(10, 1, 17, NULL), (11, 1, 14, NULL), (12, 1, 19, NULL),
(13, 1, 18, NULL), (14, 1, 17, NULL), (15, 1, 16, NULL),
(16, 1, 19, NULL), (17, 1, 15, NULL), (18, 1, 18, NULL),
(19, 1, 14, NULL), (20, 1, 13, NULL), (21, 1, 15, NULL),
(22, 1, 16, NULL), (23, 1, 12, NULL), (24, 1, 17, NULL),
(25, 1, 16, NULL), (26, 1, 18, NULL), (27, 1, 14, NULL),
(28, 1, 17, NULL), (29, 1, 15, NULL), (30, 1, 20, NULL),
(31, 1, 19, NULL), (32, 1, 18, NULL), (33, 1, 17, NULL),
(34, 1, 20, NULL), (35, 1, 16, NULL), (36, 1, 19, NULL),
(37, 1, 15, NULL), (38, 1, 14, NULL), (39, 1, 16, NULL),
(40, 1, 18, NULL), (41, 1, 13, NULL), (42, 1, 17, NULL);

-- Notas adicionales para historial (Estudiante 1)
INSERT INTO nota (matricula_id, evaluacion_periodo_id, valor) VALUES
(1, 2, 16), (1, 3, 17), (1, 4, 18),
(2, 2, 15), (2, 3, 16), (2, 4, 17),
(3, 2, 14), (3, 3, 15), (3, 4, 16),
(4, 2, 18), (4, 3, 19), (4, 4, 20),
(5, 2, 17), (5, 3, 18), (5, 4, 19),
(6, 2, 20), (6, 3, 19), (6, 4, 20);

-- 12. Asistencias
INSERT INTO asistencia (matricula_id, fecha, estado) VALUES
(1, '2026-04-06', 'PRESENTE'), (1, '2026-04-07', 'PRESENTE'),
(2, '2026-04-06', 'PRESENTE'), (2, '2026-04-07', 'TARDANZA'),
(3, '2026-04-06', 'AUSENTE'), (3, '2026-04-07', 'PRESENTE'),
(31, '2026-04-06', 'PRESENTE'), (31, '2026-04-07', 'JUSTIFICADO'),
(32, '2026-04-06', 'PRESENTE'), (32, '2026-04-07', 'PRESENTE');

-- 13. Horarios
INSERT INTO horario_curso (curso_id, dia_semana, hora_inicio, hora_fin, aula) VALUES
(1, 2, '08:00:00', '09:30:00', 'Aula 101'),
(2, 3, '08:00:00', '09:30:00', 'Aula 101'),
(3, 4, '08:00:00', '09:30:00', 'Aula 101'),
(4, 5, '08:00:00', '09:30:00', 'Aula 101'),
(5, 6, '08:00:00', '09:30:00', 'Aula 102'),
(6, 6, '10:00:00', '11:30:00', 'Patio'),
(13, 2, '09:30:00', '11:00:00', 'Aula 103'),
(14, 3, '09:30:00', '11:00:00', 'Aula 103');

-- 14. Notificaciones
INSERT INTO notificacion (usuario_emisor_id, usuario_receptor_id, mensaje, leido) VALUES
(3, 1, 'Solicito que se carguen los nuevos estudiantes en el sistema.', 0),
(1, 3, 'Ya están registrados, gracias por el aviso.', 1);

-- 15. Comunicados
INSERT INTO comunicado (titulo, contenido, usuario_autor_id, dirigido_a, fecha_expiracion) VALUES
('Reunión de padres de familia', 'Se informa que el día viernes 15 de mayo habrá reunión general para todos los grados de primaria.', 2, 'TODOS', '2026-06-01'),
('Día del logro - 1°A', 'Los alumnos de 1°A expondrán sus proyectos el próximo lunes.', 1, 'DOCENTE', NULL);

SELECT '✅ Base de datos db_intranet_escolar creada exitosamente con datos de prueba' AS Resultado;
