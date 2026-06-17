import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Token not provided' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
        (req as AuthRequest).user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as AuthRequest).user;
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (!roles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }
        
        next();
    };
};