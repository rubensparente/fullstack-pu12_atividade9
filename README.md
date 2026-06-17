# 🛒 API de E-commerce — CRUD de Products & Categories

Atividade prática desenvolvida como parte do curso Fullstack (PU12 — Atividade 9). O projeto implementa uma API RESTful completa para gerenciamento de **produtos** e **categorias**, seguindo uma arquitetura em camadas bem definida com TypeScript.

---

## 🏗️ Arquitetura

O projeto segue o padrão de separação de responsabilidades em três camadas principais:

```
src/
├── entities/         # Regras de negócio encapsuladas nas entidades
├── repositories/     # Acesso ao banco de dados (SQL puro)
├── services/         # Lógica de aplicação e orquestração
├── controllers/      # Tradução entre HTTP e a camada de serviço
├── dtos/             # Objetos de transferência de dados (entrada e saída)
├── middlewares/      # Auth, autorização, logger e tratamento de erros
├── routes/           # Definição das rotas públicas e protegidas
└── database/         # Schema e configuração do banco de dados
```

Nenhuma camada viola os seus limites:

- **Entities** — constroem e validam a si mesmas via métodos estáticos (`Category.create`, `Product.create`)
- **Repositories** — apenas persistem e consultam dados, sem decisões de negócio
- **Services** — orquestram as regras, validam existência de referências e delegam ao repository
- **Controllers** — validam formato via Zod e traduzem HTTP para chamadas de serviço

---

## ✅ Funcionalidades

### Categories
| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| GET | `/categories` | Pública | Lista todas as categorias com paginação |
| GET | `/categories/:id` | Pública | Busca uma categoria por ID |
| POST | `/categories` | Admin | Cria uma nova categoria |
| PUT | `/categories/:id` | Admin | Atualiza o nome de uma categoria |
| DELETE | `/categories/:id` | Admin | Remove uma categoria |

### Products
| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| GET | `/products` | Pública | Lista todos os produtos com paginação |
| GET | `/products/:id` | Pública | Busca um produto por ID |
| POST | `/products` | Admin | Cria um novo produto (valida categoria) |
| PUT | `/products/:id` | Admin | Atualiza um produto (revalida categoria se alterada) |
| DELETE | `/products/:id` | Admin | Remove um produto |

---

## 🔐 Autenticação e Autorização

- Rotas `GET` são **públicas** — não exigem token
- Rotas `POST`, `PUT` e `DELETE` exigem:
  - Token JWT válido via `authMiddleware`
  - Role `admin` via `authorize`
- Requisições sem token retornam **401 Unauthorized**
- Requisições com token de role incorreta retornam **403 Forbidden**

---

## 🧱 Tecnologias

- **TypeScript** — tipagem estática em toda a aplicação
- **Node.js + Express** — servidor HTTP
- **Zod** — validação de schemas nos controllers
- **JWT** — autenticação stateless
- **SQL** — persistência com queries manuais (LIMIT/OFFSET para paginação)

---

## 🚀 Como executar

**Pré-requisitos:** Node.js 18+ e um banco de dados SQL configurado.

```bash
# 1. Clone o repositório
git clone https://github.com/rubensparente/fullstack-pu12_atividade9.git
cd fullstack-pu12_atividade9

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com as credenciais do banco e o segredo JWT

# 4. Execute as migrations (schema do banco)
npm run migrate

# 5. Inicie o servidor em desenvolvimento
npm run dev
```

---

## 📦 Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor com hot-reload |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm start` | Executa a build compilada |

---

## 📋 Exemplos de uso

### Criar uma categoria (requer token admin)
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Eletrônicos"
}
```

### Criar um produto (requer token admin)
```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Notebook Dell",
  "price": 3999.90,
  "stock": 15,
  "categoryId": "uuid-da-categoria"
}
```

### Listar produtos com paginação (público)
```http
GET /products?page=1&size=10
```

---

## 🗂️ DTOs

### `ProductResponseDto`
```json
{
  "id": "uuid",
  "name": "Notebook Dell",
  "price": 3999.90,
  "stock": 15,
  "categoryId": "uuid-da-categoria"
}
```

### `ProductListDto`
```json
{
  "data": [ /* array de ProductResponseDto */ ],
  "page": 1,
  "size": 10
}
```

---

## 🛡️ Tratamento de erros

Todos os erros previsíveis são capturados pelo `errorMiddleware` global e retornam respostas padronizadas. O servidor não quebra em nenhum cenário de erro esperado.

---

## 👤 Autor

**Rubens Parente**  
[github.com/rubensparente](https://github.com/rubensparente)
