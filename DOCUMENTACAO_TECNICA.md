# Documentação Técnica - Sistema de Gestão de Vendas e Estoque

Este documento contém os detalhes técnicos, guias de instalação, configuração e referência da API do Sistema de Gestão.

## Tecnologias Utilizadas

### Backend
- **Java 21**, **Spring Boot 3.3.0**
- **Spring Security**, **JWT**
- **Spring Data JPA**, **MySQL 8.0**
- **Docker**, **Maven**, **Lombok**

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (Integração API)
- **Lucide React** (Ícones)

## Estrutura do Projeto

O projeto agora é um **monorepo** contendo frontend e backend:

```
SistemaDeGestao/
├── SistemaDeGestao-Backend/       # Código Fonte da API (Spring Boot)
│   ├── src/                       # Controllers, Services, Models
│   ├── Dockerfile                 # Configuração de Build do Backend
│   └── pom.xml                    # Dependências Maven
├── SistemaDeGestao-Frontend/      # Código Fonte da Interface (Next.js)
│   ├── src/                       # Components, Pages, Hooks
│   ├── Dockerfile                 # Configuração de Build do Frontend
│   └── package.json               # Dependências NPM
├── docker-compose.yml             # Orquestração Geral (Front + Back + DB)
└── README.md                      # Documentação Geral
```

### Detalhes do Backend (Modular)
```
src/main/java/CodingTechnology/SistemaDeGestao/
├── auth/                          # Autenticação e Segurança
├── user/                          # Gestão de Usuários
├── Produtos/                      # Estoque e Ingredientes
├── receita/                       # Engenharia de Cardápio
├── producao/                      # Controle de Produção
├── config/                        # Configurações (CORS, Swagger)
└── GestaoApplication.java         # Entrypoint
```

## Configuração e Instalação

### Pré-requisitos
- Docker Desktop e Docker Compose
- (Opcional) Java 21 e Node.js 20 para desenvolvimento local sem Docker

### 1. Início Rápido (Recomendado)

O projeto usa `docker-compose` na raiz para subir todo o ambiente.

```bash
# Clone e entre na pasta
git clone <url-do-repositorio>
cd SistemaDeGestao

# Suba os containers (build automático)
docker-compose up --build -d
```

Acesse:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:8081](http://localhost:8081)

### 2. Desenvolvimento Local (Híbrido)

Se quiser rodar o Frontend localmente e o Backend no Docker (ou vice-versa):

#### Frontend Local
```bash
cd SistemaDeGestao-Frontend
npm install
npm run dev
# Acesse http://localhost:3000
```
*Nota: O Frontend espera o Backend na porta 8081.*

#### Backend Local
```bash
cd SistemaDeGestao-Backend
# Certifique-se que o MySQL está rodando (via Docker ou local)
mvn spring-boot:run
```

## Configurações do Ambiente

### Variáveis de Ambiente (Frontend)
Arquivo: `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

### Configurações do Backend
- **Porta API**: 8081
- **Banco de Dados**: MySQL (Porta 2311 externa / 3306 interna)
- **Segurança**: JWT com expiração de 24h
- **CORS**: Habilitado para `http://localhost:3000`

## API Endpoints

Base URL: `http://localhost:8081`

### Autenticação JWT

#### POST /api/auth/login
Autentica um usuário e retorna um token JWT.

**Payload:**
```json
{
  "username": "UserAdmin",
  "password": "Master@123"
}
```

#### GET /api/auth/me
Retorna informações do usuário autenticado.

### Usuários

- **POST /api/users/create**: Cria novo usuário (ADMIN).
- **GET /api/users/listAll**: Lista todos os usuários.
- **DELETE /api/users/delete/{username}**: Remove um usuário (ADMIN).

### Produtos

- **POST /api/products/create**: Cadastra produto/ingrediente.
  - Tipos de Controle: `QUANTIDADE`, `PESO`, `VOLUME`.
- **GET /api/products/list**: Lista produtos.
- **DELETE /api/products/delete/{id}**: Remove produto por ID.
- **DELETE /api/products/delete/all-reset**: Remove todos os produtos (ADMIN).

### Receitas

- **POST /api/receitas/criar**: Cria nova receita.
- **GET /api/receitas/listar**: Lista receitas.
- **GET /api/receitas/buscar/{id}**: Busca receita por ID.
- **GET /api/receitas/buscar?nome={nome}**: Busca por nome.
- **PUT /api/receitas/atualizar/{id}**: Atualiza receita.
- **DELETE /api/receitas/excluir/{id}**: Exclui receita.

### Produção

- **POST /api/producoes/registrar**: Registra produção e desconta estoque.
- **GET /api/producoes/listar**: Lista produções.
- **GET /api/producoes/buscar/{id}**: Busca produção por ID.
- **GET /api/producoes/buscar-por-receita/{receitaId}**: Busca produções de uma receita.

### Gerenciamento de Banco de Dados

- **DELETE /api/db/reset**: Zera todas as tabelas do banco de dados (ADMIN).

## Fluxo de Uso do Sistema (Exemplos Técnicos)

### 1. Cadastro de Ingredientes
```json
POST /api/products/create
{
    "nome": "Chocolate em pó",
    "tipoControle": "PESO",
    "unidadeMedida": "grama",
    "quantidadeInicial": 1500.0,
    "quantidadeAtual": 1500.0,
    "precoCompra": 20.0,
    "precoVenda": 0.0
}
```

### 2. Criação de Receitas
```json
POST /api/receitas/criar
{
    "nome": "Brownie",
    "quantidadePadraoProduzida": 12,
    "ingredientes": [
        {
            "produto": { "nome": "Chocolate em pó" },
            "quantidadeNecessaria": 500.0
        }
    ]
}
```

### 3. Registro de Produção
```json
POST /api/producoes/registrar
{
    "receita": { "id": 1 },
    "quantidadeProduzida": 12
}
```

### 4. Consulta de Estoque
`GET /api/products/list`

## Sistema de Roles

- **ADMIN**: Acesso total (Gerenciamento de usuários, exclusão total de dados).
- **RH / USER**: Acesso limitado (conforme implementação).

## Troubleshooting

1. **Erro de Conexão com Banco:** Verifique se o container está rodando (`docker compose logs db`) e se a porta 2311 está livre.
2. **Token Inválido:** Refaça o login. O token expira em 24h.
3. **Acesso Negado (403):** Verifique se o usuário possui a role necessária.
4. **Produto não encontrado:** Verifique o cadastro exato do nome ou use o ID.
5. **Estoque insuficiente:** Verifique o estoque disponível antes da produção.

## Comandos Úteis

```bash
# Docker
docker compose up -d   # Iniciar
docker compose down    # Parar
docker compose logs -f # Logs

# Maven
mvn clean compile      # Compilar
mvn test               # Testar
mvn spring-boot:run    # Executar
```