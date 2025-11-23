import { QueryTypes } from 'sequelize';
import { sequelize}  from '../config/db'; // tu instancia de sequelize
import { UsuarioDbRow } from '../types/usuario.types';

export class UsuarioRepository {
  static async buscarPorCorreo(correo: string): Promise<UsuarioDbRow | null> {
    const rows = await sequelize.query<UsuarioDbRow>(
      'EXEC mp_dicri_db.dbo.sp_usuarios_buscar_por_correo @correo = :correo',
      {
        replacements: { correo },
        type: QueryTypes.SELECT,
      }
    );

    if (!rows || rows.length === 0) return null;
    return rows[0];
  }
}