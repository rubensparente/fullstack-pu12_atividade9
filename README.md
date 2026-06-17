# 📚 API E-commerce — Atividade 9

API RESTful para gerenciamento de categorias e produtos com autenticação JWT.

🔗 **Repositório:** [github.com/rubensparente/fullstack-pu12_atividade9](https://github.com/rubensparente/fullstack-pu12_atividade9)

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação](#-autenticação)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Status Codes](#-status-codes)
- [Validações](#-validações)
- [Banco de Dados](#-banco-de-dados)
- [Contribuição](#-contribuição)

---

## 🚀 Tecnologias

| Tecnologia | Descrição |
|------------|-----------|
| Node.js | Runtime JavaScript |
| Express | Framework web |
| TypeScript | Superset tipado |
| SQLite | Banco de dados |
| JWT | Autenticação |
| Zod | Validação de dados |

---

## 📁 Estrutura do Projeto

```
src/
├── controllers/     # Lógica das requisições
├── services/        # Regras de negócio
├── repositories/    # Acesso ao banco
├── entities/        # Modelos
├── middlewares/     # Autenticação, validação, erros
├── schemas/         # Validações Zod
├── dtos/            # Transferência de dados
├── database/        # Configuração SQLite
├── routers/         # Rotas da API
└── server.ts        # Ponto de entrada
```

---

## ⚙️ Instalação e Execução

**Pré-requisitos:** Node.js 18+ e npm ou yarn.

```bash
# Clone o repositório
git clone https://github.com/rubensparente/fullstack-pu12_atividade9.git
cd fullstack-pu12_atividade9

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm run build
npm start
```

**Variáveis de ambiente (`.env`):**

```env
PORT=3000
JWT_SECRET=seu-segredo-jwt-aqui
```

---

## 📡 Endpoints da API

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login — gera token JWT |

> **Credenciais de teste:** `admin@email.com` / `admin123`

---

### 📦 Categorias — `/categories`

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/categories` | Listar categorias | ❌ |
| GET | `/categories/:id` | Buscar por ID | ❌ |
| POST | `/categories` | Criar categoria | ✅ |
| PUT | `/categories/:id` | Atualizar categoria | ✅ |
| DELETE | `/categories/:id` | Deletar categoria | ✅ |

**Query params (GET):**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | number | `1` | Número da página |
| `size` | number | `10` | Itens por página |

---

### 📱 Produtos — `/products`

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/products` | Listar produtos | ❌ |
| GET | `/products/:id` | Buscar por ID | ❌ |
| POST | `/products` | Criar produto | ✅ |
| PUT | `/products/:id` | Atualizar produto | ✅ |
| DELETE | `/products/:id` | Deletar produto | ✅ |

**Query params (GET):**

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | number | `1` | Número da página |
| `size` | number | `10` | Itens por página |
| `categoryId` | string | — | Filtrar por categoria (UUID) |

---

## 🔐 Autenticação

### 1. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@email.com",
  "password": "admin123"
}
```

**Resposta `200 OK`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@email.com",
    "role": "admin"
  }
}
```

### 2. Usar o token

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

> ⏰ O token expira em **1 hora**. Para renovar, faça login novamente.

---

## 📝 Exemplos de Uso

### cURL

```bash
# 1. Login e captura do token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@email.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2. Criar categoria
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Eletrônicos","description":"Produtos eletrônicos"}'

# 3. Listar categorias
curl "http://localhost:3000/categories?page=1&size=10"

# 4. Criar produto
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smartphone","price":1999.99,"categoryId":"UUID_AQUI","stock":10}'

# 5. Listar produtos
curl "http://localhost:3000/products?page=1&size=10"

# 6. Filtrar produtos por categoria
curl "http://localhost:3000/products?categoryId=UUID_AQUI"

# 7. Atualizar produto
curl -X PUT http://localhost:3000/products/ID_PRODUTO \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smartphone Pro","price":2999.99,"stock":25}'

# 8. Deletar produto
curl -X DELETE http://localhost:3000/products/ID_PRODUTO \
  -H "Authorization: Bearer $TOKEN"
```

### Thunder Client

**Environment:**

```json
{
  "baseUrl": "http://localhost:3000",
  "token": ""
}
```

**Script para salvar o token automaticamente (aba Tests do Login):**

```javascript
if (response.body && response.body.token) {
  env.set("token", response.body.token);
  console.log("✅ Token salvo automaticamente!");
}
```

### TypeScript

```typescript
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function exemplo() {
  const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@email.com', password: 'admin123' })
  });

  const { token } = await loginResponse.json();

  const categoryResponse = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: 'Eletrônicos', description: 'Produtos eletrônicos' })
  });

  console.log(await categoryResponse.json());
}

exemplo();
```

---

## 📊 Status Codes

| Código | Significado |
|--------|-------------|
| `200` | ✅ Sucesso |
| `201` | ✅ Criado com sucesso |
| `204` | ✅ Sem conteúdo (deleção) |
| `400` | ❌ Erro de validação |
| `401` | ❌ Token ausente ou inválido |
| `403` | ❌ Sem permissão (role incorreta) |
| `404` | ❌ Recurso não encontrado |
| `500` | ❌ Erro interno do servidor |

---

## 📋 Validações

### Categoria

| Campo | Tipo | Regras |
|-------|------|--------|
| `name` | string | Mínimo 3 caracteres, máximo 100 |
| `description` | string | Opcional |

### Produto

| Campo | Tipo | Regras |
|-------|------|--------|
| `name` | string | Mínimo 3 caracteres |
| `price` | number | Deve ser positivo |
| `categoryId` | string | UUID válido existente |
| `stock` | number | Opcional, mínimo 0 |

---

## 🗄️ Banco de Dados

### Tabela `categories`

```sql
id          TEXT PRIMARY KEY
name        TEXT NOT NULL UNIQUE
description TEXT
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Tabela `products`

```sql
id          TEXT PRIMARY KEY
name        TEXT NOT NULL
price       REAL NOT NULL
stock       INTEGER DEFAULT 0
category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Índices

```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name     ON products(name);
CREATE INDEX idx_categories_name   ON categories(name);
```

---

## 👤 Autor

**Rubens Parente** — [@rubensparente](https://github.com/rubensparente)

Projeto: [github.com/rubensparente/fullstack-pu12_atividade9](https://github.com/rubensparente/fullstack-pu12_atividade9)
