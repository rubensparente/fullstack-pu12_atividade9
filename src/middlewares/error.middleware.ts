import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorMiddleware = (
    error: Error | AppError | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', error);

    // Erro da aplicação
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.message
        });
    }

    // Erro do Zod
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation error',
            details: error.flatten()
        });
    }

    // Erro de validação de entidade
    if (error.message.includes('must be') || error.message.includes('cannot')) {
        return res.status(400).json({
            error: error.message
        });
    }

    // Erro de não encontrado
    if (error.message.includes('not found')) {
        return res.status(404).json({
            error: error.message
        });
    }

    // Erro genérico
    return res.status(500).json({
        error: 'Internal server error'
    });
};