import { getDatabase } from '../database/database.js';
import { Category } from '../entities/category.entity.js';

export interface PaginatedResult<T> {
    data: T[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export class CategoryRepository {
    async create(category: Category): Promise<Category> {
        const db = await getDatabase();
        const data = category.toDatabase();
        
        await db.run(
            `INSERT INTO categories (id, name, description, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?)`,
            [data.id, data.name, data.description, data.created_at, data.updated_at]
        );
        
        return category;
    }

    async findAll(page: number = 1, size: number = 10): Promise<PaginatedResult<Category>> {
        const db = await getDatabase();
        const offset = (page - 1) * size;
        
        const [totalResult, categoriesData] = await Promise.all([
            db.get('SELECT COUNT(*) as total FROM categories'),
            db.all(
                `SELECT * FROM categories ORDER BY created_at DESC LIMIT ? OFFSET ?`,
                [size, offset]
            )
        ]);

        const total = totalResult?.total || 0;
        const data = categoriesData.map(Category.fromDatabase);

        return {
            data,
            page,
            size,
            total,
            totalPages: Math.ceil(total / size)
        };
    }

    async findById(id: string): Promise<Category | null> {
        const db = await getDatabase();
        const result = await db.get(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );
        
        return result ? Category.fromDatabase(result) : null;
    }

    async findByName(name: string): Promise<Category | null> {
        const db = await getDatabase();
        const result = await db.get(
            'SELECT * FROM categories WHERE name = ?',
            [name]
        );
        
        return result ? Category.fromDatabase(result) : null;
    }

    async update(category: Category): Promise<Category> {
        const db = await getDatabase();
        const data = category.toDatabase();
        
        await db.run(
            `UPDATE categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [data.name, data.description, data.id]
        );
        
        return category;
    }

    async delete(id: string): Promise<boolean> {
        const db = await getDatabase();
        const result = await db.run(
            'DELETE FROM categories WHERE id = ?',
            [id]
        );
        
        return (result.changes || 0) > 0;
    }

    async exists(id: string): Promise<boolean> {
        const db = await getDatabase();
        const result = await db.get(
            'SELECT 1 FROM categories WHERE id = ?',
            [id]
        );
        return !!result;
    }
}