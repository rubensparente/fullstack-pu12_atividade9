import { Category } from '../entities/category.entity.js';
import { CategoryRepository, PaginatedResult } from '../repositories/category.repository.js';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto.js';

export class CategoryService {
    constructor(private readonly repository: CategoryRepository) {}

    async getAll(page: number = 1, size: number = 10): Promise<PaginatedResult<Category>> {
        return this.repository.findAll(page, size);
    }

    async getById(id: string): Promise<Category> {
        const category = await this.repository.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        // Verificar se já existe categoria com este nome
        const existing = await this.repository.findByName(dto.name);
        if (existing) {
            throw new Error('Category with this name already exists');
        }

        // Criar entity usando o método create
        const category = Category.create(dto.name, dto.description);
        
        // Persistir
        return this.repository.create(category);
    }

    async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        // Buscar categoria existente
        const category = await this.getById(id);
        
        // Aplicar mudanças usando a entity
        if (dto.name) {
            // Verificar se o novo nome já existe (se for diferente do atual)
            const existing = await this.repository.findByName(dto.name);
            if (existing && existing.id !== id) {
                throw new Error('Category with this name already exists');
            }
            category.rename(dto.name);
        }        
               
        // Persistir mudanças
        return this.repository.update(category);
    }

    async delete(id: string): Promise<void> {
        // Verificar se existe
        await this.getById(id);
        
        // Deletar
        const deleted = await this.repository.delete(id);
        if (!deleted) {
            throw new Error('Failed to delete category');
        }
    }
}