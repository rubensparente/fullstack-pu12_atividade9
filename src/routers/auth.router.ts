import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateData } from '../middlewares/validateData.js';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'user']).optional()
});

const authController = new AuthController();
const router = Router();

router.post('/login', 
    validateData(loginSchema, 'body'),
    (req, res, next) => authController.login(req, res, next)
);

router.post('/register',
    validateData(registerSchema, 'body'),
    (req, res, next) => authController.register(req, res, next)
);

export { router as authRouter };