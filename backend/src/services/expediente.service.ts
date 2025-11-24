import { ExpedienteRepository } from '../repository/expediente.repository';
import {
  ExpedienteDbRow,
  ExpedienteDto,
  NuevoExpedienteDto,
  ActualizarExpedienteDto,
} from '../types/expedientes.types';
import { ValidationError, NotFoundError, AccessDeniedError } from '../errors/AppErrors';
import { Role } from '../constants';


function mapDbRowToDto(row: ExpedienteDbRow): ExpedienteDto {
  return {
    id: row.id,
    codigoExpediente: row.codigo_expendiente,
    estado: row.estado,
    descripcion: row.descripcion,
    fechaCreacion: row.fecha_creacion,
    fechaModificacion: row.fecha_modificacion,
    usuarioCreacion: {
      id: row.usuario_creacion,
      nombre: row.nombre_usuario_creacion,
    },
    usuarioModificacion: 
      row.usuario_modificacion 
      ? {
        id: row.usuario_modificacion,
        nombre: row.nombre_usuario_modificacion ?? ''}
      : null,
    revision: {
      usuario: row.usuario_revision
        ? {
            id: row.usuario_revision,
            nombre: row.nombre_usuario_revision ?? '',
          }
        : null,
      fecha: row.fecha_revision,
      justificacionRechazo: row.justificacion_rechazo,
      tipoRechazo: row.tipo_rechazo,
    },
    activo: row.activo,
  };
}

export class ExpedienteService {
  static async crear(input: NuevoExpedienteDto, usuarioId: string): Promise<ExpedienteDto> {
    if (!input.descripcion || input.descripcion.trim().length === 0) {
      throw new ValidationError('La descripción del expediente es requerida');
    }

    const row = await ExpedienteRepository.crear(input.descripcion.trim(), usuarioId);
    return mapDbRowToDto(row);
  }

  static async listar(
    usuarioId: string,
    rolUsuario: Role[],
    estado?: string
  ): Promise<ExpedienteDto[]> {
    let usuarioCreacionFiltro: string | undefined = undefined;

    // Para la primera versión: técnico ve solo los suyos, coordinador ve todos
    // TODO: revisar filtros seguridad
    if (rolUsuario.includes("TECNICO")) {
      usuarioCreacionFiltro = usuarioId;
    }

    const rows = await ExpedienteRepository.listar(estado, usuarioCreacionFiltro);
    return rows.map(mapDbRowToDto);
  }

  static async obtenerPorId(
    id: string,
    usuarioId: string,
    rolUsuario: string
  ): Promise<ExpedienteDto> {
    const row = await ExpedienteRepository.obtenerPorId(id);
    if (!row || !row.activo) {
      throw new NotFoundError('Expediente no encontrado');
    }

    // TODO: revisar filtros seguridad
    if (rolUsuario === 'TECNICO' && row.usuario_creacion !== usuarioId) {
      throw new AccessDeniedError();
    }

    return mapDbRowToDto(row);
  }

  static async actualizar(
    id: string,
    input: ActualizarExpedienteDto,
    usuarioId: string,
    rolUsuario: string
  ): Promise<ExpedienteDto> {
    if (!input.descripcion || input.descripcion.trim().length === 0) {
      throw new ValidationError('La descripción del expediente es requerida');
    }

    const expediente = await ExpedienteRepository.obtenerPorId(id);
    if (!expediente || !expediente.activo) {
      throw new NotFoundError('Expediente no encontrado');
    }

    // TODO: revisar filtros seguridad
    if (rolUsuario === 'TECNICO' && expediente.usuario_creacion !== usuarioId) {
      throw new AccessDeniedError();
    }

    const row = await ExpedienteRepository.actualizar(id, input.descripcion.trim(), usuarioId);
    if (!row) {
      throw new NotFoundError('Expediente no encontrado');
    }
    return mapDbRowToDto(row);
  }

  static async eliminar(id: string, usuarioId: string, rolUsuario: string): Promise<ExpedienteDto> {
    const expediente = await ExpedienteRepository.obtenerPorId(id);
    if (!expediente || !expediente.activo) {
      throw new NotFoundError('Expediente no encontrado');
    }

    // TODO: revisar filtros seguridad
    if (rolUsuario === 'TECNICO' && expediente.usuario_creacion !== usuarioId) {
      throw new AccessDeniedError();
    }

    const row = await ExpedienteRepository.eliminar(id, usuarioId);
    if (!row) {
      throw new NotFoundError('Expediente no encontrado');
    }
    return mapDbRowToDto(row);
  }
}