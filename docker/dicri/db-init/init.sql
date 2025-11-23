CREATE DATABASE mp_dicri_db;
GO

USE mp_dicri_db;
GO
-- DB definition
CREATE TABLE mp_dicri_db.dbo.usuarios (
	id uniqueidentifier DEFAULT newid() NOT NULL,
	nombre varchar(100) NOT NULL,
	correo varchar(100) NOT NULL,
	password_hash varchar(100) NOT NULL,
	rol varchar(100) NOT NULL,
	fecha_creacion datetimeoffset(0) DEFAULT sysutcdatetime() NOT NULL,
	usuario_creacion uniqueidentifier NOT NULL,
	fecha_modificacion datetimeoffset(0) NULL,
	usuario_modificacion uniqueidentifier NULL,
	activo bit DEFAULT 1 NOT NULL,
	CONSTRAINT usuarios_pk PRIMARY KEY (id),
	CONSTRAINT usuarios_unique UNIQUE (correo)
);

ALTER TABLE mp_dicri_db.dbo.usuarios ADD CONSTRAINT usuarios_creacion_FK FOREIGN KEY (usuario_creacion) REFERENCES mp_dicri_db.dbo.usuarios(id);
ALTER TABLE mp_dicri_db.dbo.usuarios ADD CONSTRAINT usuarios_modificacion_FK FOREIGN KEY (usuario_modificacion) REFERENCES mp_dicri_db.dbo.usuarios(id);


CREATE TABLE mp_dicri_db.dbo.expedientes (
	id uniqueidentifier DEFAULT newid() NOT NULL,
	codigo_expendiente varchar(100) NOT NULL,
	estado varchar(100) NOT NULL,
	usuario_revision uniqueidentifier NULL,
	fecha_revision datetimeoffset(0) NULL,
	justificacion_rechazo varchar(500) NULL,
	tipo_rechazo varchar(100) NULL,
	descripcion varchar(500) NULL,
	fecha_creacion datetimeoffset(0) DEFAULT sysutcdatetime() NOT NULL,
	usuario_creacion uniqueidentifier NOT NULL,
	fecha_modificacion datetimeoffset(0) NULL,
	usuario_modificacion uniqueidentifier NULL,
	activo bit DEFAULT 1 NOT NULL,
	CONSTRAINT expedientes_pk PRIMARY KEY (id),
	CONSTRAINT expedientes_unique UNIQUE (codigo_expendiente)
);

ALTER TABLE mp_dicri_db.dbo.expedientes ADD CONSTRAINT expedientes_usuario_creacion_FK FOREIGN KEY (usuario_creacion) REFERENCES mp_dicri_db.dbo.usuarios(id);
ALTER TABLE mp_dicri_db.dbo.expedientes ADD CONSTRAINT expedientes_usuario_modificacion_FK FOREIGN KEY (usuario_modificacion) REFERENCES mp_dicri_db.dbo.usuarios(id);
ALTER TABLE mp_dicri_db.dbo.expedientes ADD CONSTRAINT expedientes_usuario_revision_FK FOREIGN KEY (usuario_revision) REFERENCES mp_dicri_db.dbo.usuarios(id);



CREATE TABLE mp_dicri_db.dbo.indicios (
	id uniqueidentifier DEFAULT newid() NOT NULL,
	id_expediente uniqueidentifier NOT NULL,
	descripcion varchar(500) NOT NULL,
	color varchar(100) NULL,
	tamanio varchar(100) NULL,
	peso varchar(100) NULL,
	ubicacion varchar(100) NULL,
	fecha_creacion datetimeoffset(0) DEFAULT sysutcdatetime() NOT NULL,
	usuario_creacion uniqueidentifier NOT NULL,
	fecha_modificacion datetimeoffset(0) NULL,
	usuario_modificacion uniqueidentifier NULL,
	activo bit DEFAULT 1 NOT NULL,
	CONSTRAINT indicios_PK PRIMARY KEY (id)
);

ALTER TABLE mp_dicri_db.dbo.indicios ADD CONSTRAINT indicios_expedientes_FK FOREIGN KEY (id_expediente) REFERENCES mp_dicri_db.dbo.expedientes(id);
ALTER TABLE mp_dicri_db.dbo.indicios ADD CONSTRAINT indicios_usuario_creacion_FK FOREIGN KEY (usuario_creacion) REFERENCES mp_dicri_db.dbo.usuarios(id);
ALTER TABLE mp_dicri_db.dbo.indicios ADD CONSTRAINT indicios_usuario_modificacion_FK FOREIGN KEY (usuario_modificacion) REFERENCES mp_dicri_db.dbo.usuarios(id);

-- Mock data 
-- Usuario "sistema" para registrar creaciones iniciales
INSERT INTO mp_dicri_db.dbo.usuarios
(id, nombre, correo, password_hash, rol, usuario_creacion)
VALUES
('00000000-0000-0000-0000-000000000001', 'SYSTEM', 'system@mp.gob.gt', '$2b$10$eXUQxwsPGOLIwdpGmCK9te4ILPDeVuS/sgtuGjcEgzmXG1qf2NQ1q', 'ADMIN', '00000000-0000-0000-0000-000000000001');

INSERT INTO mp_dicri_db.dbo.usuarios
(id, nombre, correo, password_hash, rol, usuario_creacion)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Juan Pérez (Técnico)', 'tecnico@mp.gob.gt', '$2b$10$eXUQxwsPGOLIwdpGmCK9te4ILPDeVuS/sgtuGjcEgzmXG1qf2NQ1q', 'TECNICO', '00000000-0000-0000-0000-000000000001'),
('22222222-2222-2222-2222-222222222222', 'María Gómez (Técnico)', 'maria.gomez@mp.gob.gt', '$2b$10$eXUQxwsPGOLIwdpGmCK9te4ILPDeVuS/sgtuGjcEgzmXG1qf2NQ1q', 'TECNICO','00000000-0000-0000-0000-000000000001');

INSERT INTO mp_dicri_db.dbo.usuarios
(id, nombre, correo, password_hash, rol, usuario_creacion)
VALUES 
('33333333-3333-3333-3333-333333333333', 'Carlos Ruiz (Coordinador)', 'carlos.ruiz@mp.gob.gt', '$2b$10$eXUQxwsPGOLIwdpGmCK9te4ILPDeVuS/sgtuGjcEgzmXG1qf2NQ1q', 'COORDINADOR', '00000000-0000-0000-0000-000000000001');

--
-- Datos expedientes
--

 INSERT INTO mp_dicri_db.dbo.expedientes
(id, codigo_expendiente, estado, descripcion, usuario_creacion)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
 'DICRI-2025-0001',
 'BORRADOR',
 'Investigación de hallazgo en residencia Zona 5',
 '11111111-1111-1111-1111-111111111111');

 INSERT INTO mp_dicri_db.dbo.expedientes
(id, codigo_expendiente, estado, descripcion, usuario_creacion)
VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
 'DICRI-2025-0002',
 'EN_REVISION',
 'Expediente por incidente en comercio Zona 1',
 '11111111-1111-1111-1111-111111111111');

 INSERT INTO mp_dicri_db.dbo.expedientes
(id, codigo_expendiente, estado, descripcion, usuario_creacion, usuario_revision, fecha_revision)
VALUES
('cccccccc-cccc-cccc-cccc-ccccccccccc3',
 'DICRI-2025-0003',
 'APROBADO',
 'Análisis de escena por robo agravado',
 '22222222-2222-2222-2222-222222222222',
 '33333333-3333-3333-3333-333333333333',
 SYSUTCDATETIME());

INSERT INTO mp_dicri_db.dbo.expedientes
(id, codigo_expendiente, estado, descripcion, usuario_creacion, usuario_revision, fecha_revision, justificacion_rechazo, tipo_rechazo)
VALUES
('dddddddd-dddd-dddd-dddd-ddddddddddd4',
 'DICRI-2025-0004',
 'RECHAZADO',
 'Caso de hallazgo de arma en vehículo',
 '22222222-2222-2222-2222-222222222222',
 '33333333-3333-3333-3333-333333333333',
 SYSUTCDATETIME(),
 'Información incompleta: faltan datos del indicio 2.',
 'FALTA_DATOS');

INSERT INTO mp_dicri_db.dbo.expedientes
(id, codigo_expendiente, estado, descripcion, usuario_creacion)
VALUES
('76c1702e-9dbe-4d69-b8d0-1b0a38e6a111',
 'DICRI-2025-0005',
 'BORRADOR',
 'Investigación de hallazgo en residencia Zona 5',
 '11111111-1111-1111-1111-111111111111');
  
INSERT INTO mp_dicri_db.dbo.expedientes
(id, codigo_expendiente, estado, descripcion, usuario_creacion)
VALUES
('e6eb8a16-6b5e-4faf-9e3f-0d5fd0b7b222',
 'DICRI-2025-0006',
 'EN_REVISION',
 'Expediente por incidente en comercio Zona 1',
 '11111111-1111-1111-1111-111111111111');

 --
 -- Indicios
 -- 

INSERT INTO mp_dicri_db.dbo.indicios
(id, id_expediente, descripcion, color, tamanio, peso, ubicacion, usuario_creacion)
VALUES
('e1111111-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
 'Cuchillo de cocina con manchas aparentemente de sangre',
 'Plateado',
 '20 cm',
 '0.3 kg',
 'Sala principal, mesa de centro',
 '11111111-1111-1111-1111-111111111111');

 INSERT INTO mp_dicri_db.dbo.indicios
(id, id_expediente, descripcion, color, tamanio, peso, ubicacion, usuario_creacion)
VALUES
('e2222222-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
 'Bate de madera con astillas recientes',
 'Madera natural',
 '70 cm',
 '1 kg',
 'Entrada del local',
 '11111111-1111-1111-1111-111111111111'), 
('e2222223-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
 'Guante de látex con restos de sustancia desconocida',
 'Blanco',
 '–',
 'Entrada del local',
 'Basurero interno',
 '11111111-1111-1111-1111-111111111111');


 INSERT INTO mp_dicri_db.dbo.indicios
(id, id_expediente, descripcion, color, tamanio, peso, ubicacion, usuario_creacion)
VALUES
('e3333333-cccc-cccc-cccc-ccccccccccc3',
 'cccccccc-cccc-cccc-cccc-ccccccccccc3',
 'Herramienta tipo palanca con huellas visibles',
 'Negro',
 '30 cm',
 '0.8 kg',
 'Bodega posterior del comercio',
 '22222222-2222-2222-2222-222222222222');

 INSERT INTO mp_dicri_db.dbo.indicios
(id, id_expediente, descripcion, color, tamanio, peso, ubicacion, usuario_creacion)
VALUES
('e4444444-dddd-dddd-dddd-ddddddddddd4',
 'dddddddd-dddd-dddd-dddd-ddddddddddd4',
 'Pistola 9mm sin cargador',
 'Negro',
 '–',
 '1 kg',
 'Guantera del vehículo',
 '22222222-2222-2222-2222-222222222222');

 INSERT INTO mp_dicri_db.dbo.indicios
(id, id_expediente, descripcion, color, tamanio, peso, ubicacion, usuario_creacion)
VALUES
('76c1702e-9dbe-4d69-b8d0-1b0a38e6a111',
 '76c1702e-9dbe-4d69-b8d0-1b0a38e6a111',
 'Herramienta tipo palanca con huellas visibles',
 'Negro',
 '30 cm',
 '0.8 kg',
 'Bodega posterior del comercio',
 '22222222-2222-2222-2222-222222222222');

 INSERT INTO mp_dicri_db.dbo.indicios
(id, id_expediente, descripcion, color, tamanio, peso, ubicacion, usuario_creacion)
VALUES
('e6eb8a16-6b5e-4faf-9e3f-0d5fd0b7b222',
 'e6eb8a16-6b5e-4faf-9e3f-0d5fd0b7b222',
 'Pistola 9mm sin cargador',
 'Negro',
 '–',
 '1 kg',
 'Guantera del vehículo',
 '22222222-2222-2222-2222-222222222222');


-------------------
GO