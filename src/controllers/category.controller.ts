import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service.js';
import { createCategorySchema, updateCategorySchema, categoryParamsSchema, categoryQuerySchema } from '../schemas/category.schema.js';
import { CreateCategoryDto, UpdateCategoryDto, CategoryListDto, CategoryResponseDto } from '../dtos/category.dto.js';
import { validateData } from '../middlewares/validateData.js';

export class CategoryController {
    constructor(private readonly service: CategoryService) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, size } = req.validatedQuery;
            const result = await this.service.getAll(page, size);
            return res.json(CategoryListDto.create(result));
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.validatedParams;
            const category = await this.service.getById(id);
            return res.json(CategoryResponseDto.create(category));
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = req.validatedBody;
            const dto = CreateCategoryDto.create(validatedData);
            const category = await this.service.create(dto);
            return res.status(201).json(CategoryResponseDto.create(category));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.validatedParams;
            const validatedData = req.validatedBody;
            const dto = UpdateCategoryDto.create(validatedData);
            const category = await this.service.update(id, dto);
            return res.json(CategoryResponseDto.create(category));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.validatedParams;
            await this.service.delete(id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}