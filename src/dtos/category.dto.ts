export class CategoryResponseDto {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    static create(category: any): CategoryResponseDto {
        return new CategoryResponseDto(
            category.id,
            category.name,
            category.description || null,
            new Date(category.createdAt || category.created_at),
            new Date(category.updatedAt || category.updated_at)
        );
    }
}

export class CategoryListDto {
    private constructor(
        public readonly data: CategoryResponseDto[],
        public readonly page: number,
        public readonly size: number,
        public readonly total: number,
        public readonly totalPages: number
    ) {}

    static create(result: { data: any[], page: number, size: number, total: number, totalPages: number }): CategoryListDto {
        return new CategoryListDto(
            result.data.map(CategoryResponseDto.create),
            result.page,
            result.size,
            result.total,
            result.totalPages
        );
    }
}

export class CreateCategoryDto {
    private constructor(
        public readonly name: string,
        public readonly description?: string
    ) {}

    static create(data: { name: string; description?: string }): CreateCategoryDto {
        return new CreateCategoryDto(data.name, data.description);
    }
}

export class UpdateCategoryDto {
    private constructor(
        public readonly name?: string,
        public readonly description?: string
    ) {}

    static create(data: { name?: string; description?: string }): UpdateCategoryDto {
        return new UpdateCategoryDto(data.name, data.description);
    }
}