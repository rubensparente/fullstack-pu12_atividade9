import { Product } from '../entities/product.entity.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { PaginatedResult } from '../repositories/category.repository.js';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto.js';

export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository
    ) {}

    async getAll(page: number = 1, size: number = 10): Promise<PaginatedResult<Product>> {
        return this.productRepository.findAll(page, size);
    }

    async getByCategory(categoryId: string, page: number = 1, size: number = 10): Promise<PaginatedResult<Product>> {
        // Verificar se categoria existe
        const categoryExists = await this.categoryRepository.exists(categoryId);
        if (!categoryExists) {
            throw new Error('Category not found');
        }
        
        return this.productRepository.findByCategory(categoryId, page, size);
    }

    async getById(id: string): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async create(dto: CreateProductDto): Promise<Product> {
        // Verificar se categoria existe
        const categoryExists = await this.categoryRepository.exists(dto.categoryId);
        if (!categoryExists) {
            throw new Error('Category not found');
        }

        // Criar entity usando o método create
        const product = Product.create(
            dto.name,
            dto.price,
            dto.categoryId,
            dto.stock || 0
        );
        
        // Persistir
        return this.productRepository.create(product);
    }

    async update(id: string, dto: UpdateProductDto): Promise<Product> {
        // Buscar produto existente
        const product = await this.getById(id);
        
        // Aplicar mudanças usando a entity
        if (dto.name) {
            product.updateName(dto.name);
        }
        
        if (dto.price !== undefined) {
            product.updatePrice(dto.price);
        }
        
        if (dto.stock !== undefined) {
            product.updateStock(dto.stock);
        }
        
        if (dto.categoryId) {
            // Verificar se nova categoria existe
            const categoryExists = await this.categoryRepository.exists(dto.categoryId);
            if (!categoryExists) {
                throw new Error('Category not found');
            }
            product.updateCategory(dto.categoryId);
        }
        
        // Persistir mudanças
        return this.productRepository.update(product);
    }

    async delete(id: string): Promise<void> {
        // Verificar se existe
        await this.getById(id);
        
        // Deletar
        const deleted = await this.productRepository.delete(id);
        if (!deleted) {
            throw new Error('Failed to delete product');
        }
    }
}