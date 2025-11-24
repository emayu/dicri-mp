import { NextFunction, Request, Response } from 'express';
import { ExpedienteService } from '../services/expediente.service';
import { sendResponse } from '../utils/sendResponse';

export async function listar(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.session.user!;
        const { estado } = req.query;

        const expedientes = await ExpedienteService.listar(
            user.id,
            user.roles,
            typeof estado === 'string' ? estado : undefined
        );

        return sendResponse(res, 200, {
            status: 'success',
            message: 'Expedientes obtenidos correctamente',
            data: expedientes
        });
    } catch (err) {
        next(err);
    }
}
export async function obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.session.user!;
        const { id } = req.params;
        const [rol] = user.roles;
        const expediente = await ExpedienteService.obtenerPorId(id, user.id, rol);
        return sendResponse(res, 200, {
            status: 'success',
            message: 'Éxito',
            data: expediente
        });
    } catch (err) {
        next(err);
    }
}

export async function crear(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.session.user!;
        const expediente = await ExpedienteService.crear(req.body, user.id);
        return sendResponse(res, 200, {
            status: 'success',
            message: 'Expediente creado',
            data: expediente
        });
    } catch (err) {
        next(err);
    }
}

export async function actualizar(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.session.user!;
        const { id } = req.params;
        const [rol] = user.roles;
        const expediente = await ExpedienteService.actualizar(id, req.body, user.id, rol);
        return sendResponse(res, 200, {
            status: 'success',
            message: 'Expediente actualizado',
            data: expediente
        });
    } catch (err) {
        next(err);
    }
}

export async function eliminar(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.session.user!;
        const { id } = req.params;
        const [rol] = user.roles;
        const expediente = await ExpedienteService.eliminar(id, user.id, rol);
        return sendResponse(res, 200, {
            status: 'success',
            message: 'Expediente eliminado',
            data: expediente
        });
    } catch (err) {
        next(err);
    }
}

export async function aprobar(req: Request, res: Response) {
    return res.status(200).json("hello");
}