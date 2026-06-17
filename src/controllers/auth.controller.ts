import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simulação de usuários
const users = [
    {
        id: '1',
        email: 'admin@email.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        id: '2',
        email: 'user@email.com',
        password: 'user123',
        role: 'user'
    }
];

export class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            // Buscar usuário
            const user = users.find(u => u.email === email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verificar senha
            if (user.password !== password) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Gerar token
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, role = 'user' } = req.body;

            // Verificar se usuário já existe
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Criar novo usuário
            const newUser = {
                id: crypto.randomUUID(),
                email,
                password,
                role
            };

            users.push(newUser);

            return res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        } catch (error) {
            next(error);
        }
    }
}