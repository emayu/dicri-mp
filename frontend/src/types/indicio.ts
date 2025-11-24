export interface Indicio {
  id: string;
  idExpediente: string;
  descripcion: string;
  color: string | null;
  tamanio: string | null;
  peso: string | null;
  ubicacion: string | null;
  fechaCreacion: Date;
  usuarioCreacion: {
    id: string;
    nombre: string;
  };
  fechaModificacion?: Date | null;
  usuarioModificacion?: {
    id: string;
    nombre: string;
  } | null;
  activo: boolean;
}

export interface IndicioInput {
  descripcion: string;
  color?: string | null;
  tamanio?: string | null;
  peso?: string | null;
  ubicacion?: string | null;
}