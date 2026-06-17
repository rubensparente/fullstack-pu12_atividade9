import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'database.sqlite');
let db: Database | null = null;

// Função para verificar se o arquivo é um banco SQLite válido
async function isSQLiteDatabase(filePath: string): Promise<boolean> {
    try {
        // Tentar abrir como SQLite
        const testDb = await open({
            filename: filePath,
            driver: sqlite3.Database
        });
        
        // Tentar executar uma consulta simples
        await testDb.exec('SELECT 1');
        await testDb.close();
        return true;
    } catch (error) {
        return false;
    }
}

export async function getDatabase() {
    if (db) {
        return db;
    }

    try {
        // Verificar se o arquivo existe
        if (fs.existsSync(DB_PATH)) {
            // Verificar se é um banco SQLite válido
            const isValid = await isSQLiteDatabase(DB_PATH);
            if (!isValid) {
                console.log('⚠️ Banco de dados corrompido ou inválido. Recriando...');
                fs.unlinkSync(DB_PATH);
            }
        }

        // Abrir ou criar banco de dados
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });

        // Configurar foreign keys
        await db.exec('PRAGMA foreign_keys = ON;');

        // Criar tabelas
        await createTables(db);

        console.log('✅ Banco de dados inicializado com sucesso!');
        return db;

    } catch (error) {
        console.error('❌ Erro ao inicializar banco:', error);
        throw error;
    }
}

async function createTables(db: Database) {
    try {
        // Tabela de categorias
        await db.exec(`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de produtos
        await db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER DEFAULT 0,
                category_id TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
            )
        `);

        // Índices
        await db.exec(`
            CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
            CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
            CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
        `);

        console.log('✅ Tabelas criadas/verificadas');
    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
        throw error;
    }
}

// Função para resetar o banco (apenas desenvolvimento)
export async function resetDatabase() {
    if (db) {
        await db.close();
        db = null;
    }
    
    if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('🗑️ Banco resetado');
    }
}