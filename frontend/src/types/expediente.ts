export type ExpedienteEstado = 'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';
export type EstadoFiltroUI = 'TODOS' | ExpedienteEstado;


export interface Usuario {
  id: string;
  nombre: string;
}

export interface ExpedienteRevisionInfo {
  usuario?: {
    id: string;
    nombre: string;
  } | null;
  fecha?: Date | null;
  justificacionRechazo?: string | null;
  tipoRechazo?: string | null;
}

export interface Expediente {
  id: string;
  codigoExpediente: string;
  estado: ExpedienteEstado | string;
  descripcion: string | null;
  fechaCreacion: Date;
  usuarioCreacion: Usuario;
  revision?: ExpedienteRevisionInfo;
  activo: boolean;
}