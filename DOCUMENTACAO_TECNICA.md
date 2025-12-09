# Documentação Técnica - Sistema de Gestão de Vendas e Estoque

Este documento contém os detalhes técnicos, guias de instalação, configuração e referência da API do Sistema de Gestão.

## Tecnologias Utilizadas

- **Java 21**
- **Spring Boot 3.3.0**
- **Spring Security**
- **Spring Data JPA**
- **MySQL 8.0**
- **Docker & Docker Compose**
- **Maven**
- **Lombok**
- **JWT (JSON Web Tokens)**
- **BCrypt** (Criptografia de senhas)
- **Jackson** (Serialização JSON)

## Estrutura do Projeto

### Organização Modular

O projeto foi organizado seguindo princípios de separação de responsabilidades e arquitetura modular:

```
src/main/java/CodingTechnology/SistemaDeGestao/
├── auth/                          # Módulo de autenticação
│   ├── controller/                # Controladores de autenticação
│   ├── DTO/                       # DTOs de autenticação
│   ├── security/                  # Componentes de segurança
│   └── service/                   # Serviços de autenticação
├── user/                          # Módulo de usuários
│   ├── controller/                # Controladores de usuário
│   ├── model/                     # Entidades de usuário
│   ├── repository/                # Repositórios de usuário
│   └── service/                   # Serviços de usuário
├── Produtos/                      # Módulo de produtos/ingredientes
│   ├── controller/                # Controladores de produtos
│   ├── model/                     # Entidades de produtos
│   ├── repository/                # Repositórios de produtos
│   └── service/                   # Serviços de produtos
├── receita/                       # Módulo de receitas
│   ├── controller/                # Controladores de receitas
│   ├── model/                     # Entidades de receitas
│   ├── repository/                # Repositórios de receitas
│   └── service/                   # Serviços de receitas
├── producao/                      # Módulo de produção
├── db/                            # Módulo de gerenciamento de banco (Reset)
├── config/                        # Configurações da aplicação
└── GestaoApplication.java         # Classe principal da aplicação
```

## Configuração e Instalação

### Pré-requisitos

- Java 21
- Maven 3.6+
- Docker e Docker Compose
- MySQL 8.0 (via Docker)

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd SistemaDeGestao
```

### 2. Configuração do Banco de Dados com Docker

#### Iniciando o Container MySQL

```bash
# Navegue até a pasta do backend
cd SistemaDeGestao-Backend

# Inicie o container
docker compose up -d
```

Detalhes do ambiente Docker:
- Container MySQL 8.0
- Banco de dados: `erp_database`
- Porta mapeada: 2311 -> 3306
- Persistência de dados: `./data`

#### Verificando status

```bash
docker ps
```

### 3. Executando a Aplicação

#### Via Maven

```bash
cd SistemaDeGestao-Backend
mvn spring-boot:run
```

#### Via JAR

```bash
cd SistemaDeGestao-Backend
mvn clean package
java -jar target/ERP-0.0.1-SNAPSHOT.jar
```
> **Nota**: O nome do arquivo JAR pode variar dependendo do `artifactId` no `pom.xml`.

A aplicação estará disponível em: `http://localhost:8081`

### Maven Wrapper
- Windows: `mvnw.cmd spring-boot:run`
- Linux/macOS: `./mvnw spring-boot:run`

## Configuração do Usuário Administrador

⚠️ **IMPORTANTE**: Na primeira execução, o sistema cria automaticamente um usuário administrador:

- **Username**: `UserAdmin`
- **Password**: `Master@123`
- **Role**: `ADMIN`

### Alterando as Credenciais do Administrador

Para alterar as credenciais antes da primeira execução, edite o arquivo `src/main/java/CodingTechnology/SistemaDeGestao/GestaoApplication.java` nas linhas correspondentes à criação do usuário master.

## Configurações do Sistema

### Banco de Dados
- **Host**: localhost:2311
- **Database**: erp_database
- **Username**: admin
- **Password**: admin
- **Root Password**: Mudar123

### Aplicação
- **Porta**: 8081
- **JWT Secret**: Configurado em `application.properties`
- **JWT Expiration**: 24 horas

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