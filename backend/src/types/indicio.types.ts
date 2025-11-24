export interface IndicioDbRow {
  id: string;
  id_expediente: string;
  descripcion: string;
  color: string | null;
  tamanio: string | null;
  peso: string | null;
  ubicacion: string | null;
  fecha_creacion: string;
  usuario_creacion: string;
  nombre_usuario_creacion: string;
  fecha_modificacion?: string | null;
  usuario_modificacion?: string | null;
  nombre_usuario_modificacion?: string | null;
  activo: boolean;
}

/** DTO para la API */
export interface IndicioDto {
  id: string;
  idExpediente: string;
  descripcion: string;
  color: string | null;
  tamanio: string | null;
  peso: string | null;
  ubicacion: string | null;
  fechaCreacion: string;
  usuarioCreacion: {
    id: string;
    nombre: string;
  };
  fechaModificacion?: string | null;
  usuarioModificacion?: {
    id: string;
    nombre: string;
  } | null;
  activo: boolean;
}

export interface CrearIndicioDto {
  descripcion: string;
  color?: string | null;
  tamanio?: string | null;
  peso?: string | null;
  ubicacion?: string | null;
}

export interface ActualizarIndicioDto {
  descripcion: string;
  color?: string | null;
  tamanio?: string | null;
  peso?: string | null;
  ubicacion?: string | null;
}