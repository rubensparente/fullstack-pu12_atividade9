import express from 'express';
import { categoryRouter } from './routers/category.router.js';
import { productRouter } from './routers/product.router.js';
import { authRouter } from './routers/auth.router.js';  // ← IMPORTANTE: Importar authRouter
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Rotas
app.use('/auth', authRouter);  // ← IMPORTANTE: Registrar a rota /auth
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

// Rota de boas-vindas
app.get('/', (req, res) => {
    res.json({
        message: '🚀 E-commerce API',
        version: '1.0.0',
        endpoints: {
            auth: '/auth/login',
            categories: '/categories',
            products: '/products'
        }
    });
});

// Error handler
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

export default app;