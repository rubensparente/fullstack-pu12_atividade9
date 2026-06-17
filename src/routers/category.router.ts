import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { CategoryService } from '../services/category.service.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { validateData } from '../middlewares/validateData.js';
import { authMiddleware, authorize } from '../middlewares/auth.middleware.js';
import { 
    createCategorySchema, 
    updateCategorySchema, 
    categoryParamsSchema, 
    categoryQuerySchema 
} from '../schemas/category.schema.js';

// Instanciar dependências
const repository = new CategoryRepository();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

const router = Router();

// Rotas públicas (GET)
router.get('/',
    validateData(categoryQuerySchema, 'query'),
    (req, res, next) => controller.getAll(req, res, next)
);

router.get('/:id',
    validateData(categoryParamsSchema, 'params'),
    (req, res, next) => controller.getById(req, res, next)
);

// Rotas protegidas (POST, PUT, DELETE)
router.post('/',
    authMiddleware,
    authorize(['admin']),
    validateData(createCategorySchema, 'body'),
    (req, res, next) => controller.create(req, res, next)
);

router.put('/:id',
    authMiddleware,
    authorize(['admin']),
    validateData(categoryParamsSchema, 'params'),
    validateData(updateCategorySchema, 'body'),
    (req, res, next) => controller.update(req, res, next)
);

router.delete('/:id',
    authMiddleware,
    authorize(['admin']),
    validateData(categoryParamsSchema, 'params'),
    (req, res, next) => controller.delete(req, res, next)
);

export { router as categoryRouter };