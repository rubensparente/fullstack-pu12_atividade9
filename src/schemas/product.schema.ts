import z from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    price: z.number().positive('Price must be positive'),
    categoryId: z.string().uuid('Invalid category ID'),
    stock: z.number().min(0, 'Stock cannot be negative').optional()
});

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
    id: z.string().uuid('Invalid UUID format')
});

export const productQuerySchema = z.object({
    page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
    size: z.string().optional().default('10').transform(Number).pipe(z.number().min(1).max(100)),
    categoryId: z.string().uuid('Invalid category ID').optional()
});