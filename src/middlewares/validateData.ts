import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

declare global {
    namespace Express {
        interface Request {
            validatedData?: any;
            validatedParams?: any;
            validatedBody?: any;
            validatedQuery?: any;
        }
    }
}

export const validateData = (schema: z.ZodSchema, source: 'body' | 'params' | 'query' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        let dataToValidate: any = {};
        
        switch(source) {
            case 'params':
                dataToValidate = req.params;
                break;
            case 'query':
                dataToValidate = req.query;
                break;
            case 'body':
            default:
                dataToValidate = req.body;
        }
        
        const result = schema.safeParse(dataToValidate);
        
        if (!result.success) {
            return res.status(400).json({ 
                error: `Dados inválidos na ${source}`,
                details: result.error.flatten() 
            });
        }
        
        if (source === 'params') {
            req.validatedParams = result.data;
        } else if (source === 'query') {
            req.validatedQuery = result.data;
        } else {
            req.validatedBody = result.data;
        }
        
        req.validatedData = result.data;
        next();
    };
};