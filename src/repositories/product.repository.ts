import { getDatabase } from '../database/database.js';
import { Product } from '../entities/product.entity.js';
import { PaginatedResult } from './category.repository.js';

export class ProductRepository {
    async create(product: Product): Promise<Product> {
        const db = await getDatabase();
        const data = product.toDatabase();
        
        await db.run(
            `INSERT INTO products (id, name, price, stock, category_id, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.id, data.name, data.price, data.stock, data.category_id, data.created_at, data.updated_at]
        );
        
        return product;
    }

    async findAll(page: number = 1, size: number = 10): Promise<PaginatedResult<Product>> {
        const db = await getDatabase();
        const offset = (page - 1) * size;
        
        const [totalResult, productsData] = await Promise.all([
            db.get('SELECT COUNT(*) as total FROM products'),
            db.all(
                `SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?`,
                [size, offset]
            )
        ]);

        const total = totalResult?.total || 0;
        const data = productsData.map(Product.fromDatabase);

        return {
            data,
            page,
            size,
            total,
            totalPages: Math.ceil(total / size)
        };
    }

    async findById(id: string): Promise<Product | null> {
        const db = await getDatabase();
        const result = await db.get(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );
        
        return result ? Product.fromDatabase(result) : null;
    }

    async findByCategory(categoryId: string, page: number = 1, size: number = 10): Promise<PaginatedResult<Product>> {
        const db = await getDatabase();
        const offset = (page - 1) * size;
        
        const [totalResult, productsData] = await Promise.all([
            db.get('SELECT COUNT(*) as total FROM products WHERE category_id = ?', [categoryId]),
            db.all(
                `SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
                [categoryId, size, offset]
            )
        ]);

        const total = totalResult?.total || 0;
        const data = productsData.map(Product.fromDatabase);

        return {
            data,
            page,
            size,
            total,
            totalPages: Math.ceil(total / size)
        };
    }

    async update(product: Product): Promise<Product> {
        const db = await getDatabase();
        const data = product.toDatabase();
        
        await db.run(
            `UPDATE products SET name = ?, price = ?, stock = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [data.name, data.price, data.stock, data.category_id, data.id]
        );
        
        return product;
    }

    async delete(id: string): Promise<boolean> {
        const db = await getDatabase();
        const result = await db.run(
            'DELETE FROM products WHERE id = ?',
            [id]
        );
        
        return (result.changes || 0) > 0;
    }

    async exists(id: string): Promise<boolean> {
        const db = await getDatabase();
        const result = await db.get(
            'SELECT 1 FROM products WHERE id = ?',
            [id]
        );
        return !!result;
    }
}