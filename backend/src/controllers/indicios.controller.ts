import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../utils/sendResponse';
import { IndicioService } from '../services/indicio.service';
import { IndicioDto } from '../types/indicio.types';


export async function listarPorExpediente(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params; // id expediente
        const indicios = await IndicioService.listarPorExpediente(id);

        return sendResponse<IndicioDto[]>(res, 200, {
            status: 'success',
            data: indicios,
            message: 'Indicios obtenidos correctamente',
        });
    } catch (err) {
        next(err);
    }
}

export async function crear(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params; // id expediente
        const user = req.session.user!;
        const [rol] = user.roles;
        const indicio = await IndicioService.crear(id, req.body, user.id, rol);

        return sendResponse<IndicioDto>(res, 201, {
            status: 'success',
            data: indicio,
            message: 'Indicio creado correctamente',
        });
    } catch (err) {
        next(err);
    }
}

export async function actualizar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, idIndicio } = req.params;
        const user = req.session.user!;
        const [rol] = user.roles;
        const indicio = await IndicioService.actualizar(idIndicio, req.body, user.id, rol);

        return sendResponse<IndicioDto>(res, 200, {
            status: 'success',
            data: indicio,
            message: 'Indicio actualizado correctamente',
        });
    } catch (err) {
        next(err);
    }
}

export async function eliminar(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, idIndicio } = req.params;
        const user = req.session.user!;
        const [rol] = user.roles;
        const indicio = await IndicioService.eliminar(idIndicio, user.id, rol);

        return sendResponse<IndicioDto>(res, 200, {
            status: 'success',
            data: indicio,
            message: 'Indicio eliminado correctamente',
        });
    } catch (err) {
        next(err);
    }
}
