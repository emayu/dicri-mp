import { Request, Response } from 'express';

export async function getExpedientes(req: Request, res: Response){
    return res.status(200).json("hello");
}