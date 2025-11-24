import bcrypt from 'bcrypt';
import { Usuario } from '../types/usuario.types';
import { UsuarioRepository } from '../repository/usuario.repository';
import { InvalidCredentialsError } from '../errors/AppErrors';

export class AuthService {
    static async login(correo: string, passwordPlano: string): Promise<Usuario> {
        const userRow = await UsuarioRepository.buscarPorCorreo(correo);

        if (!userRow) {
            throw new InvalidCredentialsError('Credenciales inválidas');
        }
        

        const ok = await bcrypt.compare(passwordPlano, userRow.password_hash);
        if (!ok) {
            throw new InvalidCredentialsError('Credenciales inválidas');
        }

        return {
            id: userRow.id,
            nombre: userRow.nombre,
            correo: userRow.correo,
            rol: userRow.rol,
            activo: userRow.activo,
        };
    }
}

