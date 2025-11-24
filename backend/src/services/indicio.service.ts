import { IndicioRepository } from '../repository/indicio.repository';
import {
  IndicioDbRow,
  IndicioDto,
  CrearIndicioDto,
  ActualizarIndicioDto,
} from '../types/indicio.types';
import { AccessDeniedError, NotFoundError, ValidationError } from '../errors/AppErrors';
import { ExpedienteRepository } from '../repository/expediente.repository';

function mapDbRowToDto(row: IndicioDbRow): IndicioDto {
  return {
    id: row.id,
    idExpediente: row.id_expediente,
    descripcion: row.descripcion,
    color: row.color,
    tamanio: row.tamanio,
    peso: row.peso,
    ubicacion: row.ubicacion,
    fechaCreacion: row.fecha_creacion,
    usuarioCreacion: {
      id: row.usuario_creacion,
      nombre: row.nombre_usuario_creacion,
    },
    fechaModificacion: row.fecha_modificacion ?? null,
    usuarioModificacion: row.usuario_modificacion
      ? {
          id: row.usuario_modificacion,
          nombre: row.nombre_usuario_modificacion ?? '',
        }
      : null,
    activo: row.activo,
  };
}

export class IndicioService {
  static async listarPorExpediente(idExpediente: string): Promise<IndicioDto[]> {
    const rows = await IndicioRepository.listarPorExpediente(idExpediente);
    return rows.map(mapDbRowToDto);
  }

  static async crear(
    idExpediente: string,
    input: CrearIndicioDto,
    usuarioId: string,
    rolUsuario:string,
  ): Promise<IndicioDto> {
    if (!input.descripcion || input.descripcion.trim().length === 0) {
      throw new ValidationError('La descripción del indicio es requerida');
    }

    const expediente = await ExpedienteRepository.obtenerPorId(idExpediente);
    if (!expediente || !expediente.activo) {
      throw new NotFoundError('Expediente no encontrado');
    }

    // TODO: revisar filtros seguridad
    if (rolUsuario === 'TECNICO' && expediente.usuario_creacion !== usuarioId) {
      throw new AccessDeniedError();
    }

    const row = await IndicioRepository.crear(
      idExpediente,
      input.descripcion.trim(),
      input.color ?? null,
      input.tamanio ?? null,
      input.peso ?? null,
      input.ubicacion ?? null,
      usuarioId
    );

    return mapDbRowToDto(row);
  }

  static async actualizar(
    idIndicio: string,
    input: ActualizarIndicioDto,
    usuarioId: string,
    rolUsuario:string,
  ): Promise<IndicioDto> {
    if (!input.descripcion || input.descripcion.trim().length === 0) {
      throw new ValidationError('La descripción del indicio es requerida');
    }

    const indicio = await IndicioRepository.obtenerPorId(idIndicio);
    if (!indicio) {
      throw new NotFoundError('Indicio no encontrado');
    }
    // TODO: revisar filtros seguridad
    if (rolUsuario === 'TECNICO' && indicio.usuario_creacion !== usuarioId) {
      throw new AccessDeniedError();
    }

    const row = await IndicioRepository.actualizar(
      idIndicio,
      input.descripcion.trim(),
      input.color ?? null,
      input.tamanio ?? null,
      input.peso ?? null,
      input.ubicacion ?? null,
      usuarioId
    );

    if (!row) {
      throw new NotFoundError('Indicio no encontrado');
    }

    return mapDbRowToDto(row);
  }

  static async eliminar(idIndicio: string, usuarioId: string, rolUsuario:string): Promise<IndicioDto> {
    const indicio = await IndicioRepository.obtenerPorId(idIndicio);
    if (!indicio) {
      throw new NotFoundError('Indicio no encontrado');
    }

    // TODO: revisar filtros seguridad
    if (rolUsuario === 'TECNICO' && indicio.usuario_creacion !== usuarioId) {
      throw new AccessDeniedError();
    }

    const row = await IndicioRepository.eliminar(idIndicio, usuarioId);
    if (!row) {
      throw new NotFoundError('Indicio no encontrado');
    }
    return mapDbRowToDto(row);
  }
}
