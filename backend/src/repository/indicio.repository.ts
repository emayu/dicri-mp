import { QueryTypes } from 'sequelize';
import {sequelize} from '../config/db';
import { IndicioDbRow } from '../types/indicio.types';

export class IndicioRepository {
  static async crear(
    idExpediente: string,
    descripcion: string,
    color: string | null,
    tamanio: string | null,
    peso: string | null,
    ubicacion: string | null,
    usuarioId: string
  ): Promise<IndicioDbRow> {
    const rows = await sequelize.query<IndicioDbRow>(
      `EXEC sp_indicios_crear
        @id_expediente = :id_expediente,
        @descripcion = :descripcion,
        @color = :color,
        @tamanio = :tamanio,
        @peso = :peso,
        @ubicacion = :ubicacion,
        @usuario_creacion = :usuario_creacion`,
      {
        replacements: {
          id_expediente: idExpediente,
          descripcion,
          color,
          tamanio,
          peso,
          ubicacion,
          usuario_creacion: usuarioId,
        },
        type: QueryTypes.SELECT,
      }
    );
    return rows[0];
  }

  static async listarPorExpediente(idExpediente: string): Promise<IndicioDbRow[]> {
    const rows = await sequelize.query<IndicioDbRow>(
      'EXEC sp_indicios_buscar_por_expediente @id_expediente = :id_expediente',
      {
        replacements: { id_expediente: idExpediente },
        type: QueryTypes.SELECT,
      }
    );
    return rows;
  }

  static async obtenerPorId(id: string): Promise<IndicioDbRow | null> {
    const rows = await sequelize.query<IndicioDbRow>(
      'EXEC sp_indicios_obtener @id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
  }

  static async actualizar(
    id: string,
    descripcion: string,
    color: string | null,
    tamanio: string | null,
    peso: string | null,
    ubicacion: string | null,
    usuarioModificacion: string
  ): Promise<IndicioDbRow | null> {
    const rows = await sequelize.query<IndicioDbRow>(
      `EXEC sp_indicios_actualizar
        @id = :id,
        @descripcion = :descripcion,
        @color = :color,
        @tamanio = :tamanio,
        @peso = :peso,
        @ubicacion = :ubicacion,
        @usuario_modificacion = :usuario_modificacion`,
      {
        replacements: {
          id,
          descripcion,
          color,
          tamanio,
          peso,
          ubicacion,
          usuario_modificacion: usuarioModificacion,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
  }

  static async eliminar(id: string, usuarioModificacion: string): Promise<IndicioDbRow | null> {
    const rows = await sequelize.query<IndicioDbRow>(
      `EXEC sp_indicios_eliminar
        @id = :id,
        @usuario_modificacion = :usuario_modificacion`,
      {
        replacements: {
          id,
          usuario_modificacion: usuarioModificacion,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
  }
}