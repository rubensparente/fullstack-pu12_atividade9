export class Product {
    private constructor(
        public readonly id: string,
        private _name: string,
        private _price: number,
        private _stock: number,
        public readonly categoryId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    get name() { return this._name; }
    get price() { return this._price; }
    get stock() { return this._stock; }

    updateName(name: string): void {
        if (name.length < 3) {
            throw new Error('Product name must be at least 3 characters');
        }
        this._name = name;
    }

    updatePrice(price: number): void {
        if (price <= 0) {
            throw new Error('Price must be positive');
        }
        this._price = price;
    }

    updateStock(stock: number): void {
        if (stock < 0) {
            throw new Error('Stock cannot be negative');
        }
        this._stock = stock;
    }

    updateCategory(categoryId: string): void {
        if (!categoryId) {
            throw new Error('Category ID is required');
        }
        this._categoryId = categoryId;
    }

    private _categoryId: string;

    static create(name: string, price: number, categoryId: string, stock: number = 0): Product {
        if (name.length < 3) {
            throw new Error('Product name must be at least 3 characters');
        }
        if (price <= 0) {
            throw new Error('Price must be positive');
        }
        if (stock < 0) {
            throw new Error('Stock cannot be negative');
        }

        const product = new Product(
            crypto.randomUUID(),
            name,
            price,
            stock,
            categoryId,
            new Date(),
            new Date()
        );
        product._categoryId = categoryId;
        return product;
    }

    static fromDatabase(data: any): Product {
        return new Product(
            data.id,
            data.name,
            data.price,
            data.stock,
            data.category_id,
            new Date(data.created_at),
            new Date(data.updated_at)
        );
    }

    toDatabase() {
        return {
            id: this.id,
            name: this._name,
            price: this._price,
            stock: this._stock,
            category_id: this.categoryId,
            created_at: this.createdAt.toISOString(),
            updated_at: this.updatedAt.toISOString()
        };
    }

    toJSON() {
        return {
            id: this.id,
            name: this._name,
            price: this._price,
            stock: this._stock,
            categoryId: this.categoryId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}