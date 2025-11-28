# Documentação de Rotas da API ProducPlus

## Sumário de Rotas

### 1. **Autenticação - Clientes**
- **Base**: `/auth`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/register` | Registrar novo cliente | Não |
| POST | `/login` | Login de cliente | Não |

---

### 2. **Autenticação - Admins**
- **Base**: `/admin/auth`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/login` | Login de admin | Não |

---

### 3. **Administradores**
- **Base**: `/admin`
- **Autenticação**: Requer JWT + Role ADMIN

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Criar novo admin |
| GET | `/` | Listar todos os admins |

---

### 4. **Produtos**
- **Base**: `/produtos`

| Método | Endpoint | Descrição | Autenticação | Permissões |
|--------|----------|-----------|--------------|-----------|
| GET | `/` | Listar todos os produtos | Não | - |
| GET | `/secao/:secao` | Listar produtos por seção | Não | - |
| GET | `/categoria/:idCategoria` | Listar produtos por categoria | Não | - |
| GET | `/:id` | Buscar produto específico | Não | - |
| POST | `/` | Criar novo produto | JWT | ADMIN |
| PUT | `/:id` | Atualizar produto | JWT | ADMIN |
| DELETE | `/:id` | Deletar produto | JWT | ADMIN |

**Parâmetros POST/PUT**:
```json
{
  "nome": "string",
  "descricao": "string",
  "preco_unitario": "decimal",
  "quantidadeEstoque": "integer",
  "secao": "string",
  "idCategoria": "integer (optional, default: 1)",
  "cnpjFornecedor": "string (optional, can be null)"
}
```

---

### 5. **Categorias**
- **Base**: `/categorias`
- **Autenticação**: GET requer JWT + Role (ADMIN ou CLIENTE)
- **Autenticação**: POST/PUT/DELETE requer JWT + Role ADMIN

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar todas as categorias |
| GET | `/:id` | Buscar categoria específica |
| POST | `/` | Criar nova categoria |
| PUT | `/:id` | Atualizar categoria |
| DELETE | `/:id` | Deletar categoria |
| DELETE | `/:id/force` | Deletar categoria e todos os seus produtos |

---

### 6. **Clientes**
- **Base**: `/clientes`

| Método | Endpoint | Descrição | Autenticação | Permissões |
|--------|----------|-----------|--------------|-----------|
| GET | `/` | Listar clientes | JWT | ADMIN |
| GET | `/:cnpj` | Buscar cliente por CNPJ | JWT | ADMIN |
| POST | `/` | Criar cliente | Não | - |
| PUT | `/:cnpj` | Atualizar cliente | Não | - |
| DELETE | `/:cnpj` | Deletar cliente | Não | - |

---

### 7. **Fornecedores**
- **Base**: `/fornecedores`
- **Autenticação**: Nenhuma

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar fornecedores |
| GET | `/:cnpj` | Buscar fornecedor por CNPJ |
| POST | `/` | Criar fornecedor |
| PUT | `/:cnpj` | Atualizar fornecedor |
| DELETE | `/:cnpj` | Deletar fornecedor |

---

### 8. **Compras**
- **Base**: `/compras`
- **Autenticação**: JWT
- **Permissões**: ADMIN ou CLIENTE

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar compras |
| GET | `/:id` | Buscar compra específica |
| POST | `/` | Criar compra |
| PUT | `/:id` | Atualizar compra |
| DELETE | `/:id` | Deletar compra |

---

### 9. **Itens de Compra**
- **Base**: `/itenscompra`
- **Autenticação**: Varia por operação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar itens |
| GET | `/:id` | Buscar item específico |
| POST | `/` | Criar item |
| PUT | `/:id` | Atualizar item |
| DELETE | `/:id` | Deletar item |

---

### 10. **Upload de Arquivos**
- **Base**: `/upload`

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/` | Upload de arquivo (imagem) | Não |

**Parâmetros FormData**:
- `foto`: File (obrigatório)
- `tipo`: string (ADMIN, PRODUTO, ou outro para cliente) (obrigatório)
- `id`: string (ID do admin ou produto) (obrigatório quando tipo=ADMIN ou PRODUTO)
- `email`: string (email do cliente) (obrigatório quando tipo != ADMIN e != PRODUTO)

**Response**:
```json
{
  "message": "Sucesso",
  "url": "http://localhost:3000/uploads/..."
}
```

---

## Middlewares de Autenticação

### `autenticarJWT`
- Valida o token JWT no header `Authorization: Bearer <token>`
- Extrai os dados do usuário e adiciona ao `req.user`

### `permitirRoles(...roles)`
- Verifica se o usuário tem uma das roles especificadas
- Roles disponíveis: `ADMIN`, `CLIENTE`

---

## Exemplo de Requisições

### Login de Cliente
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "cliente@example.com",
  "senha": "senha123"
}
```

### Criar Produto (Requer ADMIN)
```bash
POST /produtos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Parafuso M8",
  "descricao": "Parafuso de aço inox",
  "preco_unitario": 5.50,
  "quantidadeEstoque": 100,
  "secao": "material-section",
  "idCategoria": 1
}
```

### Upload de Imagem de Produto
```bash
POST /upload
Content-Type: multipart/form-data

Form Data:
- foto: <arquivo de imagem>
- tipo: PRODUTO
- id: 1
```

---

## Status HTTP Retornados

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Dados inválidos ou incompletos
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro no servidor

---

Última atualização: 28 de Novembro de 2025
