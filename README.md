# Sistema de Gestão de Vendas e Estoque

## Autor

**ThiagoMartins2001**

## Visão Geral

Sistema de Gestão desenvolvido em Spring Boot com arquitetura MVC modular, focado em vendas e controle de estoque. O sistema oferece funcionalidades completas de gerenciamento de usuários com autenticação JWT, gestão de produtos/ingredientes, cadastro de receitas, registro de produções e controle automático de estoque baseado em receitas.

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
│   │   └── AuthController.java
│   ├── DTO/                       # DTOs de autenticação
│   │   └── AuthRequest.java
│   ├── security/                  # Componentes de segurança
│   │   └── JwtAuthFilter.java
│   └── service/                   # Serviços de autenticação
│       └── JwtService.java
├── user/                          # Módulo de usuários
│   ├── controller/                # Controladores de usuário
│   │   └── UserController.java
│   ├── model/                     # Entidades de usuário
│   │   └── entities/
│   │       └── User.java
│   ├── repository/                # Repositórios de usuário
│   │   └── UserRepository.java
│   └── service/                   # Serviços de usuário
│       └── UserService.java
├── Produtos/                      # Módulo de produtos/ingredientes
│   ├── controller/                # Controladores de produtos
│   │   └── ProductController.java
│   ├── model/                     # Entidades de produtos
│   │   └── entities/
│   │       └── Product.java
│   ├── repository/                # Repositórios de produtos
│   │   └── ProductRepository.java
│   └── service/                   # Serviços de produtos
│       └── ProductService.java
├── receita/                       # Módulo de receitas
│   ├── controller/                # Controladores de receitas
│   │   └── ReceitaController.java
│   ├── model/                     # Entidades de receitas
│   │   └── entities/
│   │       ├── Receita.java
│   │       └── IngredienteDaReceita.java
│   ├── repository/                # Repositórios de receitas
│   │   ├── ReceitaRepository.java
│   │   └── IngredienteDaReceitaRepository.java
│   └── service/                   # Serviços de receitas
│       └── ReceitaService.java
├── producao/                      # Módulo de produção
│   ├── controller/                # Controladores de produção
│   │   └── ProducaoController.java
│   ├── model/                     # Entidades de produção
│   │   └── entities/
│   │       └── Producao.java
│   ├── repository/                # Repositórios de produção
│   │   └── ProducaoRepository.java
│   └── service/                   # Serviços de produção
│       └── ProducaoService.java
├── config/                        # Configurações da aplicação
│   ├── SecurityConfiguration.java
│   └── GlobalExceptionHandler.java
└── GestaoApplication.java         # Classe principal da aplicação
```

### Estrutura de Pastas (raiz)

```
SistemaDeGestao/
├── SistemaDeGestao-Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/CodingTechnology/SistemaDeGestao/...
│   │   │   └── resources/application.properties
│   │   └── test/java/CodingTechnology/ERP/ErpApplicationTests.java
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── .gitignore
│   └── data/
└── README.md
```

## Documentação Relacionada

- Guia de API: `SistemaDeGestao-Backend/API_DOCUMENTATION.md`
- Documentação técnica: `SistemaDeGestao-Backend/DOCUMENTACAO_TECNICA.md`

## Funcionalidades Implementadas

### 1. **Sistema de Autenticação JWT**

- Autenticação segura com tokens JWT
- Expiração de tokens configurável (24 horas)
- Filtro de autenticação automático
- Criptografia de senhas com BCrypt
- Validação de roles no token

### 2. **Gerenciamento de Usuários**

- Criação de usuários (apenas administradores)
- Listagem de todos os usuários
- Exclusão de usuários (apenas administradores)
- Sistema de roles (ADMIN, RH, USER)

### 3. **Gestão de Produtos e Estoque**

- ✅ Cadastro de produtos/ingredientes
- ✅ Listagem de produtos
- ✅ Exclusão de produtos por ID
- ✅ Exclusão geral de todos os produtos (apenas ADMIN)
- ✅ Controle de estoque por quantidade, peso ou volume
- ✅ Gerenciamento de preços de compra e venda
- ✅ Busca de produtos por nome (case-insensitive)
- ✅ Métodos para adicionar e descontar estoque

### 4. **Sistema de Receitas**

- ✅ Cadastro de receitas com ingredientes
- ✅ Listagem de todas as receitas
- ✅ Busca de receitas por ID
- ✅ Busca de receitas por nome (busca parcial)
- ✅ Atualização de receitas
- ✅ Exclusão de receitas
- ✅ Validação de produtos por ID ou nome
- ✅ Gestão automática de ingredientes

### 5. **Sistema de Produção**

- ✅ Registro de produções com receitas
- ✅ Cálculo automático de proporção de ingredientes
- ✅ Desconto automático de estoque baseado na produção
- ✅ Validação de estoque antes da produção
- ✅ Listagem de todas as produções
- ✅ Busca de produção por ID
- ✅ Busca de produções por receita
- ✅ Histórico de produções ordenado por data

### 6. **Controle de Acesso**

- Autorização baseada em roles
- Endpoints protegidos por JWT
- Diferentes níveis de permissão
- Tratamento centralizado de exceções

### 7. **Tratamento de Erros**

- Tratamento centralizado via `GlobalExceptionHandler`
- Mensagens de erro descritivas e informativas
- Logging detalhado para diagnóstico
- Respostas HTTP apropriadas

## Configuração e Instalação

### Pré-requisitos

- Java 21
- Maven 3.6+
- Docker e Docker Compose
- MySQL 8.0 (via Docker)

### 1. Clone o Repositório

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

Isso irá:

- Criar um container MySQL 8.0
- Configurar o banco `erp_database`
- Mapear a porta 2311 para 3306
- Persistir dados na pasta `./data`

#### Verificando se o Container está Rodando

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

> **Nota**: O nome do arquivo JAR ainda é `ERP-0.0.1-SNAPSHOT.jar` porque o `artifactId` no `pom.xml` não foi alterado. Para mudar o nome do JAR, atualize o campo `<artifactId>` no arquivo `pom.xml`.

A aplicação estará disponível em: `http://localhost:8081`

## Configuração do Usuário Administrador

⚠️ **IMPORTANTE**: Na primeira execução, o sistema cria automaticamente um usuário administrador:

- **Username**: `UserAdmin`
- **Password**: `Master@123`
- **Role**: `ADMIN`

### Alterando as Credenciais do Administrador

Para alterar as credenciais antes da primeira execução, edite o arquivo:
`src/main/java/CodingTechnology/SistemaDeGestao/GestaoApplication.java`

```java
// Linhas 30-32
masterUser.setUsername("SeuUsuarioAdmin");
masterUser.setPassword(passwordEncoder.encode("SuaSenhaSegura"));
masterUser.setRole("ADMIN");
```

## API Endpoints

### Base URL

```
http://localhost:8081
```

### Autenticação JWT

#### POST /api/auth/login

Autentica um usuário e retorna um token JWT.

**Headers:**

```
Content-Type: application/json
```

**Corpo da Requisição:**

```json
{
  "username": "UserAdmin",
  "password": "Master@123"
}
```

**Resposta de Sucesso (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Erro (400):**

```json
{
  "error": "Invalid credentials"
}
```

---

### Usuários

#### POST /api/users/create

Cria um novo usuário no sistema. **(Apenas ADMIN)**

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>
```

**Corpo da Requisição:**

```json
{
  "username": "Usuarioteste",
  "password": "senhaDoRh1234",
  "role": "RH"
}
```

#### GET /api/users/listAll

Lista todos os usuários cadastrados.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

#### DELETE /api/users/delete/{username}

Remove um usuário do sistema. **(Apenas ADMIN)**

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

---

### Produtos

#### POST /api/products/create

Cadastra um novo produto/ingrediente.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>
```

**Corpo da Requisição:**

```json
{
  "nome": "Chocolate em pó",
  "tipoControle": "PESO",
  "unidadeMedida": "grama",
  "quantidadeInicial": 1000.0,
  "quantidadeAtual": 1000.0,
  "precoCompra": 20.0,
  "precoVenda": 0.0
}
```

**Tipos de Controle:**

- `QUANTIDADE`: Para produtos contáveis (unidades)
- `PESO`: Para produtos medidos por peso (kg, grama)
- `VOLUME`: Para produtos medidos por volume (litro, ml)

#### GET /api/products/list

Lista todos os produtos cadastrados.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

#### DELETE /api/products/delete/{id}

Remove um produto pelo ID.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

#### DELETE /api/products/delete/all-reset

Remove todos os produtos do sistema. **(Apenas ADMIN)**

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

---

### Receitas

#### POST /api/receitas/criar

Cria uma nova receita com seus ingredientes.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>
```

**Corpo da Requisição:**

```json
{
  "nome": "Brownie",
  "descricao": "Brownie tradicional de chocolate",
  "quantidadePadraoProduzida": 12,
  "ingredientes": [
    {
      "produto": {
        "nome": "Chocolate em pó"
      },
      "quantidadeNecessaria": 500.0,
      "observacoes": "Chocolate meio amargo"
    },
    {
      "produto": {
        "id": 2
      },
      "quantidadeNecessaria": 250.0
    }
  ]
}
```

**Nota:** Você pode especificar o produto pelo `nome` ou pelo `id`. O sistema busca automaticamente o produto correspondente.

#### GET /api/receitas/listar

Lista todas as receitas cadastradas com seus ingredientes.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

#### GET /api/receitas/buscar/{id}

Busca uma receita específica por ID.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

#### GET /api/receitas/buscar?nome={nome}

Busca receitas por nome (busca parcial, case-insensitive).

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

**Exemplo:**

```
GET /api/receitas/buscar?nome=Brownie
```

#### PUT /api/receitas/atualizar/{id}

Atualiza uma receita existente.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>
```

**Corpo da Requisição:** (mesmo formato do POST /criar)

#### DELETE /api/receitas/excluir/{id}

Exclui uma receita por ID.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

---

### Produção

#### POST /api/producoes/registrar

Registra uma nova produção e desconta automaticamente o estoque dos ingredientes.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <seu-token-jwt>
```

**Corpo da Requisição:**

```json
{
  "receita": {
    "id": 1
  },
  "quantidadeProduzida": 24,
  "observacoes": "Produção do dia 15/01/2024"
}
```

**Funcionamento:**

- O sistema calcula automaticamente a proporção baseada na quantidade padrão da receita
- Valida se há estoque suficiente de todos os ingredientes
- Desconta automaticamente o estoque após a validação
- Se algum ingrediente estiver em falta, retorna erro descritivo

**Exemplo:**

- Receita padrão: 12 brownies
- Quantidade produzida: 24 brownies
- Se a receita precisa de 500g de chocolate para 12 brownies, serão descontados 1000g para 24 brownies

#### GET /api/producoes/listar

Lista todas as produções ordenadas por data (mais recentes primeiro).

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

#### GET /api/producoes/buscar/{id}

Busca uma produção específica por ID.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

#### GET /api/producoes/buscar-por-receita/{receitaId}

Busca todas as produções de uma receita específica.

**Headers:**

```
Authorization: Bearer <seu-token-jwt>
```

---

## Fluxo de Uso do Sistema

### 1. Cadastro de Produtos/Ingredientes

Primeiro, cadastre os produtos que serão usados como ingredientes:

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

Crie receitas informando os ingredientes e a quantidade padrão produzida:

```json
POST /api/receitas/criar
{
    "nome": "Brownie",
    "descricao": "Brownie tradicional",
    "quantidadePadraoProduzida": 12,
    "ingredientes": [
        {
            "produto": {
                "nome": "Chocolate em pó"
            },
            "quantidadeNecessaria": 500.0
        }
    ]
}
```

### 3. Registro de Produção

Ao produzir, registre a produção e o sistema descontará automaticamente o estoque:

```json
POST /api/producoes/registrar
{
    "receita": {
        "id": 1
    },
    "quantidadeProduzida": 12,
    "observacoes": "Produção teste"
}
```

O sistema irá:

- ✅ Calcular a proporção de ingredientes necessários
- ✅ Validar se há estoque suficiente
- ✅ Descontar automaticamente do estoque
- ✅ Registrar a produção no histórico

### 4. Consulta de Estoque

Consulte o estoque atual de qualquer produto:

```json
GET /api/products/list
```

## Sistema de Roles

### Roles Disponíveis

- **ADMIN**: Acesso total ao sistema
  - Pode criar usuários
  - Pode excluir usuários
  - Pode listar usuários
  - Pode excluir todos os produtos
- **RH**: Acesso limitado (futuras implementações)
- **USER**: Acesso básico (futuras implementações)

### Fluxo de Autenticação

1. **Login**: Usuário faz login com username/password
2. **Token**: Sistema retorna token JWT válido por 24 horas
3. **Autorização**: Token é enviado no header `Authorization: Bearer <token>`
4. **Validação**: Sistema valida token e verifica permissões

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
- **JWT Expiration**: 24 horas (86400000 ms)

### Docker

- **MySQL Port**: 2311:3306
- **Data Persistence**: `./data` directory (dentro de SistemaDeGestao-Backend)
- **Auto-restart**: Always

## Comandos Úteis

### Docker

```bash
# Iniciar containers (dentro de SistemaDeGestao-Backend)
cd SistemaDeGestao-Backend
docker compose up -d

# Parar containers
docker compose down

# Ver logs
docker compose logs -f

# Reiniciar apenas o banco
docker compose restart db
```

### Maven

```bash
# Compilar projeto
cd SistemaDeGestao-Backend
mvn clean compile

# Executar testes
mvn test

# Gerar JAR
mvn clean package

# Executar aplicação
mvn spring-boot:run
```

## Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco:**

   - Verifique se o Docker está rodando
   - Confirme se a porta 2311 está livre
   - Execute: `docker compose logs db` (dentro da pasta SistemaDeGestao-Backend)

2. **Token Inválido:**

   - Faça novo login para obter token atualizado
   - Verifique se o token está sendo enviado corretamente no header `Authorization: Bearer <token>`

3. **Acesso Negado (403):**

   - Confirme se o usuário tem a role necessária (ADMIN para algumas operações)
   - Verifique se o token é válido
   - Verifique os logs da aplicação

4. **Produto não encontrado ao criar receita:**

   - Verifique se o produto está cadastrado: `GET /api/products/list`
   - Use o nome exato do produto (case-insensitive)
   - Ou use o ID do produto diretamente

5. **Estoque insuficiente na produção:**

   - Verifique o estoque atual: `GET /api/products/list`
   - Adicione mais produtos ao estoque antes de produzir
   - A quantidade produzida pode estar muito alta em relação ao estoque disponível

6. **Porta 8081 em Uso:**
   - Altere a porta em `application.properties`
   - Ou pare o processo que está usando a porta

## Funcionalidades Futuras

### v2.1 (Planejado) - Funcionalidades Avançadas

- [ ] Atualização de produtos (PUT/PATCH)
- [ ] Busca e filtros avançados de produtos
- [ ] Sistema de vendas
- [ ] Controle de entrada e saída de produtos (histórico detalhado)
- [ ] Relatórios de estoque
- [ ] Atualização de usuários
- [ ] Logs de auditoria
- [ ] Notificações de estoque baixo

### v2.2 (Futuro) - Análises e Relatórios

- [ ] Dashboard de vendas
- [ ] Relatórios de consumo de materiais
- [ ] Análise de rentabilidade por produto/receita
- [ ] Histórico de vendas
- [ ] API de relatórios avançados
- [ ] Integração com sistemas externos

## Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido por Thiago Martins** 🚀