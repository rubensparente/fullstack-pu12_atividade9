export class Category {
    private constructor(
        public readonly id: string,
        private _name: string,
        public readonly description: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    get name() {
        return this._name;
    }

    rename(newName: string): void {
        if (newName.length < 3) {
            throw new Error('Category name must be at least 3 characters');
        }
        if (newName.length > 100) {
            throw new Error('Category name must be at most 100 characters');
        }
        this._name = newName;
    }

    static create(name: string, description?: string): Category {
        if (name.length < 3) {
            throw new Error('Category name must be at least 3 characters');
        }
        if (name.length > 100) {
            throw new Error('Category name must be at most 100 characters');
        }

        return new Category(
            crypto.randomUUID(),
            name,
            description || null,
            new Date(),
            new Date()
        );
    }

    static fromDatabase(data: any): Category {
        return new Category(
            data.id,
            data.name,
            data.description,
            new Date(data.created_at),
            new Date(data.updated_at)
        );
    }

    toDatabase() {
        return {
            id: this.id,
            name: this._name,
            description: this.description,
            created_at: this.createdAt.toISOString(),
            updated_at: this.updatedAt.toISOString()
        };
    }

    toJSON() {
        return {
            id: this.id,
            name: this._name,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}