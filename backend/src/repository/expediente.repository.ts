import { QueryTypes } from 'sequelize';
import {sequelize} from '../config/db';
import { ExpedienteDbRow } from '../types/expedientes.types';


export class ExpedienteRepository {
  static async crear(descripcion: string, usuarioId: string): Promise<ExpedienteDbRow> {
    const rows = await sequelize.query<ExpedienteDbRow>(
      'EXEC sp_expedientes_crear @descripcion = :descripcion, @usuario_creacion = :usuario_creacion',
      {
        replacements: { descripcion, usuario_creacion: usuarioId },
        type: QueryTypes.SELECT,
      }
    );
    return rows[0];
  }

  static async listar(estado?: string, usuarioCreacion?: string): Promise<ExpedienteDbRow[]> {
    const rows = await sequelize.query<ExpedienteDbRow>(
      'EXEC sp_expedientes_listar @estado = :estado, @usuario_creacion = :usuario_creacion',
      {
        replacements: {
          estado: estado ?? null,
          usuario_creacion: usuarioCreacion ?? null,
        },
        type: QueryTypes.SELECT,
      }
    );
    return rows;
  }

  static async obtenerPorId(id: string): Promise<ExpedienteDbRow | null> {
    const rows = await sequelize.query<ExpedienteDbRow>(
      'EXEC sp_expedientes_buscar_por_id @id = :id',
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
    usuarioModificacion: string
  ): Promise<ExpedienteDbRow | null> {
    const rows = await sequelize.query<ExpedienteDbRow>(
      'EXEC sp_expedientes_actualizar @id = :id, @descripcion = :descripcion, @usuario_modificacion = :usuario_modificacion',
      {
        replacements: {
          id,
          descripcion,
          usuario_modificacion: usuarioModificacion,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (!rows || rows.length === 0) return null;
    return rows[0];
  }

  static async eliminar(
    id: string,
    usuarioModificacion: string
  ): Promise<ExpedienteDbRow | null> {
    const rows = await sequelize.query<ExpedienteDbRow>(
      'EXEC sp_expedientes_eliminar @id = :id, @usuario_modificacion = :usuario_modificacion',
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