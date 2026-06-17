import z from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be at most 100 characters'),
    description: z.string().optional()
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryParamsSchema = z.object({
    id: z.string().uuid('Invalid UUID format')
});

export const categoryQuerySchema = z.object({
    page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
    size: z.string().optional().default('10').transform(Number).pipe(z.number().min(1).max(100))
});