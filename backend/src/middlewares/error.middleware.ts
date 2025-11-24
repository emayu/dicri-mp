import { Request, Response, NextFunction } from 'express';
import { InvalidCredentialsError } from '../services/auth.service';
import { sendResponse } from '../utils/sendResponse';

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof InvalidCredentialsError) {
        return sendResponse(res, 401, {
            status: 'fail',
            error: "AUTH-003",
            message: error.message,
        });
    } else if (error instanceof Error) {
        const ENV = process.env.ENV;
        return sendResponse(res, 500, {
            status: 'fail',
            error: error.name,
            message: ENV === "DEV" ? error.message : "Ocurrió un error",
        });
    }
    return sendResponse(res, 500, {
        status: 'error',
        error: 'error desconocido',
        message: "Ocurrió un error",
    });
}