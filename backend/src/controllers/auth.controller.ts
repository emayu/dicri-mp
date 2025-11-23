import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { sendResponse } from '../utils/sendResponse';
import { AuthService, InvalidCredentialsError } from '../services/auth.service';
import { Role } from '../constants';

export async function login(req: Request, res: Response, next:NextFunction) {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return sendResponse(res, 400, {  status: 'fail', message: 'Correo y contraseña requeridos' });
    }

    try {
        const usuario = await AuthService.login(correo, contrasena);
        req.session.user = {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            roles: [usuario.rol as Role],
        };
        return sendResponse(res, 200, {
            status: 'success',
            message: 'Login exitoso',
            data: {
                usuario: usuario.nombre
            }
        });
    } catch (error) {
        next(error);
    }

}


export function getSession(req:Request, res:Response){
    if(!req.session.user){
        return sendResponse(res, 401, { status:'fail', message:'No hay sesiones activas'});
    }

    return sendResponse(res, 200, {
        status: 'success',
        message: 'Sesión activa',
        data: {
            usuario: req.session.user
        }
    });
}


export function logout( req:Request, res:Response){
    req.session.destroy( (err) => {
        if(err){
            console.error('Error al cerrar sesión:', err);
            return sendResponse( res, 500, { status: 'error', message: 'No se pudo cerrar la sesión'})
        }
        res.clearCookie('connect.sid');
        return sendResponse(res, 200, {
            status: 'success',
            message: 'Sesión cerrada exitosamente'
        })
    });
}