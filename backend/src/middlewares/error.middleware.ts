import { Request, Response, NextFunction } from 'express';
import { AccessDeniedError, InvalidCredentialsError, NotFoundError, ValidationError } from '../errors/AppErrors';
import { sendResponse } from '../utils/sendResponse';


export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    console.error(error);
    if (error instanceof InvalidCredentialsError) {
        return sendResponse(res, 401, {
            status: 'fail',
            error: "AUTH-003",
            message: error.message,
        });
    }

    if(error instanceof AccessDeniedError){
        return sendResponse(res, 403, {
            status: 'fail',
            error: "UNAUTHORIZED",
            message: error.message,
        });
    }


    if (error instanceof ValidationError) {
        return sendResponse(res, 400, {
            status: 'fail',
            error: "VALIDATION_ERROR",
            message: error.message,
        });
    }

    if (error instanceof NotFoundError) {
        return sendResponse(res, 404, {
            status: 'fail',
            error: "NOT_FOUND",
            message: error.message,
        });
        
    }

    if (error instanceof Error) {
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