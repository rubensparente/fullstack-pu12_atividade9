import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { createProductSchema, updateProductSchema, productParamsSchema, productQuerySchema } from '../schemas/product.schema.js';
import { CreateProductDto, UpdateProductDto, ProductListDto, ProductResponseDto } from '../dtos/product.dto.js';

export class ProductController {
    constructor(private readonly service: ProductService) {}

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, size, categoryId } = req.validatedQuery;
            
            let result;
            if (categoryId) {
                result = await this.service.getByCategory(categoryId, page, size);
            } else {
                result = await this.service.getAll(page, size);
            }
            
            return res.json(ProductListDto.create(result));
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.validatedParams;
            const product = await this.service.getById(id);
            return res.json(ProductResponseDto.create(product));
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = req.validatedBody;
            const dto = CreateProductDto.create(validatedData);
            const product = await this.service.create(dto);
            return res.status(201).json(ProductResponseDto.create(product));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.validatedParams;
            const validatedData = req.validatedBody;
            const dto = UpdateProductDto.create(validatedData);
            const product = await this.service.update(id, dto);
            return res.json(ProductResponseDto.create(product));
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