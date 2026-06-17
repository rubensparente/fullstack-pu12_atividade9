export class ProductResponseDto {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly stock: number,
        public readonly categoryId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    static create(product: any): ProductResponseDto {
        return new ProductResponseDto(
            product.id,
            product.name,
            product.price,
            product.stock,
            product.categoryId || product.category_id,
            new Date(product.createdAt || product.created_at),
            new Date(product.updatedAt || product.updated_at)
        );
    }
}

export class ProductListDto {
    private constructor(
        public readonly data: ProductResponseDto[],
        public readonly page: number,
        public readonly size: number,
        public readonly total: number,
        public readonly totalPages: number
    ) {}

    static create(result: { data: any[], page: number, size: number, total: number, totalPages: number }): ProductListDto {
        return new ProductListDto(
            result.data.map(ProductResponseDto.create),
            result.page,
            result.size,
            result.total,
            result.totalPages
        );
    }
}

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly price: number,
        public readonly categoryId: string,
        public readonly stock?: number
    ) {}

    static create(data: { name: string; price: number; categoryId: string; stock?: number }): CreateProductDto {
        return new CreateProductDto(data.name, data.price, data.categoryId, data.stock || 0);
    }
}

export class UpdateProductDto {
    private constructor(
        public readonly name?: string,
        public readonly price?: number,
        public readonly stock?: number,
        public readonly categoryId?: string
    ) {}

    static create(data: { name?: string; price?: number; stock?: number; categoryId?: string }): UpdateProductDto {
        return new UpdateProductDto(data.name, data.price, data.stock, data.categoryId);
    }
}