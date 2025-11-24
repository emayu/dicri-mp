import { ExpedienteEstado } from "../constants/expedientes";

export interface ExpedienteDbRow {
  id: string;
  codigo_expendiente: string;
  estado: ExpedienteEstado;
  descripcion: string | null;
  fecha_creacion: Date;
  usuario_creacion: string;
  nombre_usuario_creacion: string;
  fecha_revision: Date | null;
  usuario_revision: string | null;
  nombre_usuario_revision: string | null;
  justificacion_rechazo: string | null;
  tipo_rechazo: string | null;
  fecha_modificacion?: Date | null;
  usuario_modificacion?: string | null;
  nombre_usuario_modificacion?: string | null;
  activo: boolean;
}

/** DTO para la API */
export interface ExpedienteDto {
  id: string;
  codigoExpediente: string;
  estado: ExpedienteEstado;
  descripcion: string | null;
  fechaCreacion: Date;
  fechaModificacion?: Date | null;
  usuarioCreacion: {
    id: string;
    nombre: string;
  };
  usuarioModificacion?: {
    id: string;
    nombre: string;
  } | null;
  revision?: {
    usuario?: {
      id: string;
      nombre: string;
    } | null;
    fecha?: Date | null;
    justificacionRechazo?: string | null;
    tipoRechazo?: string | null;
  };
  activo: boolean;
}

export interface NuevoExpedienteDto {
  descripcion: string;
}

export interface ActualizarExpedienteDto {
  descripcion: string;
}