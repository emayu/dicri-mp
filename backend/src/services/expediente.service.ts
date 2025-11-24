import { ExpedienteRepository } from '../repository/expediente.repository';
import {
  ExpedienteDbRow,
  ExpedienteDto,
  NuevoExpedienteDto,
  ActualizarExpedienteDto,
} from '../types/expedientes.types';
import { ValidationError, NotFoundError, AccessDeniedError } from '../errors/AppErrors';
import { Role } from '../constants';
import { IndicioRepository } from '../repository/indicio.repository';


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

  static async enviarRevision(
    idExpediente: string,
    usuarioId: string,
    rolUsuario: string
  ): Promise<ExpedienteDto> {
    const exp = await ExpedienteRepository.obtenerPorId(idExpediente);
    if (!exp || !exp.activo) {
      throw new NotFoundError('Expediente no encontrado');
    }
    console.log('expediente', exp);
    // Solo BORRADOR puede pasar a EN_REVISION
    if (exp.estado !== 'BORRADOR') {
      throw new ValidationError('Solo se puede enviar a revisión un expediente en estado BORRADOR');
    }

    // Si es técnico, solo puede enviar los suyos
    if (rolUsuario === 'TECNICO' && exp.usuario_creacion !== usuarioId) {
      throw new AccessDeniedError('No puede enviar a revisión un expediente de otro usuario');
    }

    // Debe tener al menos un indicio
    const indicios = await IndicioRepository.listarPorExpediente(idExpediente);
    if (!indicios || indicios.length === 0) {
      throw new ValidationError('Debe registrar al menos un indicio antes de enviar a revisión');
    }

    const updated = await ExpedienteRepository.enviarRevision(idExpediente, usuarioId);
    if (!updated) {
      throw new NotFoundError('Expediente no encontrado al actualizar');
    }

    return mapDbRowToDto(updated);
  }

  static async aprobar(
    idExpediente: string,
    usuarioId: string,
    rolUsuario: string
  ): Promise<ExpedienteDto> {
    const exp = await ExpedienteRepository.obtenerPorId(idExpediente);
    if (!exp || !exp.activo) {
      throw new NotFoundError('Expediente no encontrado');
    }

    if (exp.estado !== 'EN_REVISION') {
      throw new ValidationError('Solo se pueden aprobar expedientes en estado EN_REVISION');
    }

    // Aunque ya uses requireRole en la ruta, aquí reforzamos:
    if (rolUsuario !== 'COORDINADOR') {
      throw new AccessDeniedError('Solo un coordinador puede aprobar expedientes');
    }

    const updated = await ExpedienteRepository.aprobar(idExpediente, usuarioId);
    if (!updated) {
      throw new NotFoundError('Expediente no encontrado al aprobar');
    }

    return mapDbRowToDto(updated);
  }

  static async rechazar(
    idExpediente: string,
    usuarioId: string,
    rolUsuario: string,
    justificacion: string,
    tipoRechazo?: string | null
  ): Promise<ExpedienteDto> {
    const exp = await ExpedienteRepository.obtenerPorId(idExpediente);
    if (!exp || !exp.activo) {
      throw new NotFoundError('Expediente no encontrado');
    }

    if (exp.estado !== "EN_REVISION") {
      throw new ValidationError('Solo se pueden rechazar expedientes en estado EN_REVISION');
    }

    if (rolUsuario !== 'COORDINADOR') {
      throw new AccessDeniedError('Solo un coordinador puede rechazar expedientes');
    }

    if (!justificacion || justificacion.trim().length === 0) {
      throw new ValidationError('La justificación de rechazo es obligatoria');
    }

    const updated = await ExpedienteRepository.rechazar(
      idExpediente,
      usuarioId,
      justificacion.trim(),
      tipoRechazo ?? null
    );
    if (!updated) {
      throw new NotFoundError('Expediente no encontrado al rechazar');
    }

    return mapDbRowToDto(updated);
  }
}