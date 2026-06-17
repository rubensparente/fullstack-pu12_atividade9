import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { ProductService } from '../services/product.service.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { validateData } from '../middlewares/validateData.js';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { 
    createProductSchema, 
    updateProductSchema, 
    productParamsSchema, 
    productQuerySchema 
} from '../schemas/product.schema.js';

// Instanciar dependências
const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();
const service = new ProductService(productRepository, categoryRepository);
const controller = new ProductController(service);

const router = Router();

// Rotas públicas (GET)
router.get('/',
    validateData(productQuerySchema, 'query'),
    (req, res, next) => controller.getAll(req, res, next)
);

router.get('/:id',
    validateData(productParamsSchema, 'params'),
    (req, res, next) => controller.getById(req, res, next)
);

// Rotas protegidas (POST, PUT, DELETE)
router.post('/',
    authMiddleware,
    authorize(['admin']),
    validateData(createProductSchema, 'body'),
    (req, res, next) => controller.create(req, res, next)
);

router.put('/:id',
    authMiddleware,
    authorize(['admin']),
    validateData(productParamsSchema, 'params'),
    validateData(updateProductSchema, 'body'),
    (req, res, next) => controller.update(req, res, next)
);

router.delete('/:id',
    authMiddleware,
    authorize(['admin']),
    validateData(productParamsSchema, 'params'),
    (req, res, next) => controller.delete(req, res, next)
);

export { router as productRouter };