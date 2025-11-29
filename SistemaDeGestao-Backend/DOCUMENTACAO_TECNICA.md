# Documentação Técnica - Sistema de Gestão de Vendas e Estoque

## Autor
**ThiagoMartins2001**

## Sobre o Sistema

Este é um **Sistema de Gestão de Vendas e Estoque** desenvolvido para:
- ✅ **Autenticação e Autorização**: Sistema completo com JWT e controle de acesso baseado em roles
- ✅ **Gestão de Usuários**: Criação, listagem e exclusão de usuários com diferentes níveis de acesso
- ✅ **Gestão de Produtos**: Cadastro, listagem, exclusão e controle de estoque de produtos/ingredientes
- ✅ **Sistema de Receitas**: Cadastro de receitas com ingredientes e quantidades necessárias
- ✅ **Sistema de Produção**: Registro de produções com desconto automático de estoque
- ✅ **Controle de Estoque Automático**: Desconto automático baseado em produções realizadas
- ✅ **Tratamento de Erros**: Sistema centralizado de tratamento de exceções

**Status Atual**: Sistema totalmente funcional com todos os módulos implementados e testados.

## Especificações Técnicas

### Versões das Tecnologias
- **Java**: 21 (LTS)
- **Spring Boot**: 3.3.0
- **Spring Security**: 6.x
- **Spring Data JPA**: 3.x
- **Hibernate**: 6.x
- **MySQL**: 8.0
- **Maven**: 3.x
- **JWT**: 0.12.5
- **Lombok**: 1.18.x
- **Jackson**: Para serialização JSON

### Estrutura do Projeto

```
src/main/java/CodingTechnology/SistemaDeGestao/
├── auth/                          # Módulo de autenticação
│   ├── controller/
│   │   └── AuthController.java
│   ├── DTO/
│   │   └── AuthRequest.java
│   ├── security/
│   │   └── JwtAuthFilter.java
│   └── service/
│       └── JwtService.java
├── user/                          # Módulo de usuários
│   ├── controller/
│   │   └── UserController.java
│   ├── model/entities/
│   │   └── User.java
│   ├── repository/
│   │   └── UserRepository.java
│   └── service/
│       └── UserService.java
├── Produtos/                      # Módulo de produtos/ingredientes
│   ├── controller/
│   │   └── ProductController.java
│   ├── model/entities/
│   │   └── Product.java
│   ├── repository/
│   │   └── ProductRepository.java
│   └── service/
│       └── ProductService.java
├── receita/                       # Módulo de receitas
│   ├── controller/
│   │   └── ReceitaController.java
│   ├── model/entities/
│   │   ├── Receita.java
│   │   └── IngredienteDaReceita.java
│   ├── repository/
│   │   ├── ReceitaRepository.java
│   │   └── IngredienteDaReceitaRepository.java
│   └── service/
│       └── ReceitaService.java
├── producao/                      # Módulo de produção
│   ├── controller/
│   │   └── ProducaoController.java
│   ├── model/entities/
│   │   └── Producao.java
│   ├── repository/
│   │   └── ProducaoRepository.java
│   └── service/
│       └── ProducaoService.java
├── config/                        # Configurações da aplicação
│   ├── SecurityConfiguration.java
│   └── GlobalExceptionHandler.java
└── GestaoApplication.java         # Classe principal da aplicação
```

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        Camada de Apresentação                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Controller │  │   Controller │  │   Controller │         │
│  │   (REST)     │  │   (REST)     │  │   (REST)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                        Camada de Negócio                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  │   (Lógica)   │  │   (Lógica)   │  │   (Lógica)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    Camada de Acesso a Dados                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Repository  │  │  Repository  │  │  Repository  │         │
│  │   (JPA)      │  │   (JPA)      │  │   (JPA)      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                         Banco de Dados                           │
│                     MySQL 8.0 (via Docker)                       │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Segurança (JWT)                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  JwtAuthFilter → JwtService → SecurityConfiguration       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Módulos Implementados

### 1. Módulo de Autenticação (auth)

#### AuthController.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/controller/`

**Endpoint**: `POST /api/auth/login`
- Autentica usuário e retorna token JWT
- Endpoint público (não requer autenticação)
- Retorna token válido por 24 horas

#### JwtService.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/service/`

**Funcionalidades**:
- Geração de tokens JWT com roles
- Validação de tokens
- Extração de claims (username, roles)
- Verificação de expiração

#### JwtAuthFilter.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/security/`

**Funcionalidades**:
- Intercepta requisições HTTP
- Valida tokens JWT no header Authorization
- Configura SecurityContext com autenticação
- Limpa SecurityContext em caso de erro

### 2. Módulo de Usuários (user)

#### User.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/user/model/entities/`

```java
@Entity
@Table(name = "users")
@Data
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role;
}
```

**Características**:
- Implementa `UserDetails` para integração com Spring Security
- Roles com prefixo `ROLE_` automático
- Username único e obrigatório

#### UserRepository.java
**Métodos**:
- `findByUsername(String username)`: Busca por username
- `existsByUsername(String username)`: Verifica existência
- `deleteByUsername(String username)`: Remove por username

#### UserService.java
**Funcionalidades**:
- Criptografia automática de senhas com BCrypt
- Validação de username único
- Gerenciamento de transações

#### UserController.java
**Endpoints**:
- `GET /api/users/listAll`: Lista todos os usuários
- `POST /api/users/create`: Cria usuário (apenas ADMIN)
- `DELETE /api/users/delete/{username}`: Remove usuário (apenas ADMIN)

### 3. Módulo de Produtos (Produtos)

#### Product.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/Produtos/model/entities/`

```java
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String tipoControle;  // QUANTIDADE, PESO, VOLUME
    private String unidadeMedida;
    private Double quantidadeInicial;
    private Double quantidadeAtual;
    private Double precoCompra;
    private Double precoVenda;
}
```

**Características**:
- Suporta diferentes tipos de controle (QUANTIDADE, PESO, VOLUME)
- Controle de estoque com quantidades iniciais e atuais
- Gestão de preços de compra e venda

#### ProductRepository.java
**Métodos Customizados**:
- `findByNomeIgnoreCase(String nome)`: Busca por nome (case-insensitive, único)
- `findAllByNomeIgnoreCase(String nome)`: Busca todos com mesmo nome

#### ProductService.java
**Funcionalidades**:
- Validação de campos obrigatórios
- `getProductById(Long id)`: Busca produto por ID
- `descontarEstoque(Long produtoId, Double quantidade)`: Desconta estoque
- `adicionarEstoque(Long produtoId, Double quantidade)`: Adiciona estoque
- Validação de estoque insuficiente
- Transações garantidas

#### ProductController.java
**Endpoints**:
- `POST /api/products/create`: Cadastra produto
- `GET /api/products/list`: Lista todos os produtos
- `DELETE /api/products/delete/{id}`: Remove produto por ID
- `DELETE /api/products/delete/all-reset`: Remove todos os produtos (apenas ADMIN)

### 4. Módulo de Receitas (receita)

#### Receita.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/receita/model/entities/`

```java
@Entity
@Table(name = "receitas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @Column(name = "quantidade_padrao_produzida")
    private Integer quantidadePadraoProduzida;
    
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
    
    @OneToMany(mappedBy = "receita", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<IngredienteDaReceita> ingredientes = new ArrayList<>();
}
```

**Características**:
- Relacionamento OneToMany com ingredientes
- Timestamps automáticos (criação e atualização)
- Quantidade padrão produzida para cálculo de proporção

#### IngredienteDaReceita.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/receita/model/entities/`

```java
@Entity
@Table(name = "ingredientes_da_receita")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredienteDaReceita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receita_id", nullable = false)
    @JsonIgnore
    private Receita receita;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id", nullable = false)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Product produto;
    
    @Column(name = "quantidade_necessaria", nullable = false)
    private Double quantidadeNecessaria;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
```

**Características**:
- Relacionamento ManyToOne com Receita e Product
- `@JsonIgnore` e `@JsonIgnoreProperties` para evitar loops na serialização
- Permite deserialização parcial do Product (apenas ID ou nome)

#### ReceitaRepository.java
**Métodos Customizados**:
- `findByNomeIgnoreCase(String nome)`: Busca por nome único
- `existsByNomeIgnoreCase(String nome)`: Verifica existência
- `findByNomeContainingIgnoreCase(String nome)`: Busca parcial
- `findByIdComIngredientes(Long id)`: Busca com ingredientes carregados
- `findAllComIngredientes()`: Lista todas com ingredientes

#### ReceitaService.java
**Funcionalidades**:
- Validação de receita e ingredientes
- Busca de produtos por ID ou nome (flexível)
- Tratamento de produtos duplicados (lista IDs quando múltiplos encontrados)
- Validação de nome único para receitas
- Gerenciamento de relacionamentos com ingredientes

#### ReceitaController.java
**Endpoints**:
- `POST /api/receitas/criar`: Cria nova receita
- `GET /api/receitas/listar`: Lista todas as receitas com ingredientes
- `GET /api/receitas/buscar/{id}`: Busca receita por ID
- `GET /api/receitas/buscar?nome={nome}`: Busca receitas por nome
- `PUT /api/receitas/atualizar/{id}`: Atualiza receita
- `DELETE /api/receitas/excluir/{id}`: Remove receita

### 5. Módulo de Produção (producao)

#### Producao.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/producao/model/entities/`

```java
@Entity
@Table(name = "producoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receita_id", nullable = false)
    private Receita receita;
    
    @Column(name = "quantidade_produzida", nullable = false)
    private Integer quantidadeProduzida;
    
    @Column(name = "data_producao", nullable = false)
    private LocalDateTime dataProducao;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(name = "estoque_descontado", nullable = false)
    @Builder.Default
    private Boolean estoqueDescontado = false;
}
```

**Características**:
- Relacionamento ManyToOne com Receita
- Data de produção automática se não informada
- Flag indicando se estoque foi descontado

#### ProducaoRepository.java
**Métodos Customizados**:
- `findByReceitaId(Long receitaId)`: Busca produções por receita
- `findByPeriodo(LocalDateTime inicio, LocalDateTime fim)`: Busca por período
- `findTodasOrdenadasPorData()`: Lista ordenada por data (mais recente primeiro)

#### ProducaoService.java
**Funcionalidades**:
- Cálculo automático de proporção de ingredientes
- Validação de estoque antes de descontar
- Desconto automático de estoque após validação
- Cálculo proporcional baseado em `quantidadePadraoProduzida`
- Transações garantidas (rollback em caso de erro)

**Lógica de Cálculo**:
```
Fator de Proporção = Quantidade Produzida / Quantidade Padrão Produzida
Quantidade Necessária = Quantidade Necessária Original × Fator de Proporção
```

#### ProducaoController.java
**Endpoints**:
- `POST /api/producoes/registrar`: Registra produção e desconta estoque
- `GET /api/producoes/listar`: Lista todas as produções ordenadas
- `GET /api/producoes/buscar/{id}`: Busca produção por ID
- `GET /api/producoes/buscar-por-receita/{receitaId}`: Busca por receita

### 6. Módulo de Configuração (config)

#### SecurityConfiguration.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/config/`

**Configurações**:
- CSRF desabilitado para API REST
- Endpoints públicos: `/api/auth/**` e `/error`
- Autenticação JWT obrigatória para demais endpoints
- Sessões stateless
- Method security habilitado (`@PreAuthorize`)
- UserDetailsService integrado com UserRepository
- PasswordEncoder BCrypt

#### GlobalExceptionHandler.java
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/config/`

**Exceções Tratadas**:
- `IllegalArgumentException`: Validações de negócio (400 Bad Request)
- `HttpMessageNotReadableException`: Erros de parsing JSON (400 Bad Request)
- `MethodArgumentNotValidException`: Validação de argumentos (400 Bad Request)
- `AccessDeniedException`: Acesso negado (403 Forbidden)
- `LazyInitializationException`: Erros de carregamento lazy (500 Internal Server Error)
- `Exception`: Exceções genéricas (500 Internal Server Error)

**Formato de Resposta de Erro**:
```json
{
  "timestamp": "2025-11-29T03:12:17.879753351",
  "status": 400,
  "error": "Bad Request",
  "message": "Mensagem de erro descritiva"
}
```

## Estrutura de Banco de Dados

### Tabela `users`
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);
```

### Tabela `products`
```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    tipo_controle VARCHAR(255),
    unidade_medida VARCHAR(255),
    quantidade_inicial DOUBLE,
    quantidade_atual DOUBLE,
    preco_compra DOUBLE,
    preco_venda DOUBLE
);
```

### Tabela `receitas`
```sql
CREATE TABLE receitas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    quantidade_padrao_produzida INT,
    data_criacao DATETIME NOT NULL,
    data_atualizacao DATETIME
);
```

### Tabela `ingredientes_da_receita`
```sql
CREATE TABLE ingredientes_da_receita (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receita_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade_necessaria DOUBLE NOT NULL,
    observacoes TEXT,
    FOREIGN KEY (receita_id) REFERENCES receitas(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES products(id)
);
```

### Tabela `producoes`
```sql
CREATE TABLE producoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receita_id BIGINT NOT NULL,
    quantidade_produzida INT NOT NULL,
    data_producao DATETIME NOT NULL,
    observacoes TEXT,
    estoque_descontado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (receita_id) REFERENCES receitas(id)
);
```

## Sistema de Autorização

### Roles Disponíveis
- **ADMIN**: Acesso total ao sistema
- **RH**: Acesso limitado
- **USER**: Acesso básico

### Endpoints por Role

| Endpoint | ADMIN | RH | USER | Público |
|----------|-------|----|----- |---------|
| POST /api/auth/login | ✅ | ✅ | ✅ | ✅ |
| GET /api/users/listAll | ✅ | ✅ | ✅ | ❌ |
| POST /api/users/create | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/users/delete/{username} | ✅ | ❌ | ❌ | ❌ |
| POST /api/products/create | ✅ | ✅ | ✅ | ❌ |
| GET /api/products/list | ✅ | ✅ | ✅ | ❌ |
| DELETE /api/products/delete/{id} | ✅ | ✅ | ✅ | ❌ |
| DELETE /api/products/delete/all-reset | ✅ | ❌ | ❌ | ❌ |
| POST /api/receitas/criar | ✅ | ✅ | ✅ | ❌ |
| GET /api/receitas/listar | ✅ | ✅ | ✅ | ❌ |
| PUT /api/receitas/atualizar/{id} | ✅ | ✅ | ✅ | ❌ |
| DELETE /api/receitas/excluir/{id} | ✅ | ✅ | ✅ | ❌ |
| POST /api/producoes/registrar | ✅ | ✅ | ✅ | ❌ |
| GET /api/producoes/listar | ✅ | ✅ | ✅ | ❌ |

## Sistema JWT

### Configuração
```properties
application.security.jwt.secret-key=404E635266556A586E32723575782F413F4428472B4B6250645367566B5970
application.security.jwt.expiration=86400000  # 24 horas
```

### Fluxo de Autenticação
```
1. Cliente → POST /api/auth/login (credenciais)
   ↓
2. AuthenticationManager valida credenciais
   ↓
3. JwtService gera token com roles
   ↓
4. Token retornado ao cliente
   ↓
5. Cliente → Requisições com Header: "Authorization: Bearer {token}"
   ↓
6. JwtAuthFilter intercepta e valida token
   ↓
7. SecurityContext configurado com autenticação
   ↓
8. @PreAuthorize verifica permissões
   ↓
9. Endpoint executado
```

### Claims do Token
- **sub**: Username
- **roles**: Lista de roles do usuário
- **iat**: Data de emissão
- **exp**: Data de expiração

## Configurações de Banco de Dados

### application.properties
```properties
# Servidor
server.port=8081

# MySQL
spring.datasource.url=jdbc:mysql://localhost:2311/erp_database?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=admin
spring.datasource.password=admin
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# JWT
application.security.jwt.secret-key=404E635266556A586E32723575782F413F4428472B4B6250645367566B5970
application.security.jwt.expiration=86400000

# Logging
logging.level.org.springframework.security=DEBUG
```

### Docker Compose
```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: Mudar123
      MYSQL_DATABASE: erp_database
      MYSQL_USER: admin
      MYSQL_PASSWORD: admin
    ports:
      - "2311:3306"
    volumes:
      - ./data:/var/lib/mysql
```

## Fluxos de Negócio

### Fluxo: Cadastro de Receita
```
1. Cliente → POST /api/receitas/criar
   {
     "nome": "Brownie Tradicional",
     "quantidadePadraoProduzida": 12,
     "ingredientes": [
       {
         "produto": { "id": 1 },
         "quantidadeNecessaria": 500.0
       }
     ]
   }
   ↓
2. ReceitaService.validaReceita()
   ↓
3. Para cada ingrediente:
   - ReceitaService.validarIngrediente()
   - Busca produto por ID ou nome
   - Valida quantidade > 0
   ↓
4. ReceitaRepository.save()
   ↓
5. Retorna receita salva com ID
```

### Fluxo: Registro de Produção
```
1. Cliente → POST /api/producoes/registrar
   {
     "receita": { "id": 1 },
     "quantidadeProduzida": 24
   }
   ↓
2. ProducaoService.registrarProducao()
   ↓
3. Busca receita com ingredientes
   ↓
4. Calcula fator de proporção:
   fator = 24 / 12 = 2.0
   ↓
5. Para cada ingrediente:
   - Calcula quantidade necessária:
     quantidade = 500.0 × 2.0 = 1000.0
   - Valida estoque disponível
   ↓
6. Se estoque suficiente:
   - Desconta estoque de cada produto
   - Salva produção com estoqueDescontado = true
   ↓
7. Retorna produção registrada
```

### Fluxo: Tratamento de Erros
```
1. Exceção lançada em qualquer camada
   ↓
2. GlobalExceptionHandler intercepta
   ↓
3. Identifica tipo de exceção
   ↓
4. Cria resposta JSON padronizada:
   {
     "timestamp": "...",
     "status": 400/403/500,
     "error": "...",
     "message": "..."
   }
   ↓
5. Log do erro para diagnóstico
   ↓
6. Retorna resposta HTTP apropriada
```

## Segurança Implementada

### ✅ Implementado
- Criptografia BCrypt para senhas
- Autenticação JWT com expiração
- Autorização baseada em roles
- Validação de entrada
- Tratamento centralizado de exceções
- Logs de segurança
- Sessões stateless
- Filtro de autenticação JWT
- Method-level security com @PreAuthorize
- Endpoints públicos protegidos

### 🔒 Recomendações Futuras
- Refresh tokens
- Rate limiting
- Validação com Bean Validation (@Valid)
- Logs de auditoria
- HTTPS em produção
- Sistema de permissões mais granular
- MFA (Multi-Factor Authentication)
- Blacklist de tokens revogados
- Validação de força de senha

## Performance e Otimizações

### Implementado
- Connection Pool HikariCP (padrão Spring Boot)
- Lazy Loading em relacionamentos JPA
- Eager Loading quando necessário
- Índices em campos únicos (username)
- Cache de autoridades no Spring Security
- Validação JWT local (sem consulta ao banco)
- Sessões stateless (sem armazenamento)

### Consultas Otimizadas
- `findAllComIngredientes()`: Usa JOIN FETCH para evitar N+1
- `findByIdComIngredientes()`: Carrega relacionamentos necessários
- Transações declarativas com `@Transactional`

## Logs e Monitoramento

### Logs Configurados
- SQL: Habilitado para desenvolvimento (`show-sql=true`)
- Spring Security: DEBUG para autenticação
- ReceitaController: DEBUG para criação de receitas
- GlobalExceptionHandler: WARN/ERROR para exceções
- JwtAuthFilter: INFO/DEBUG para autenticação

### Pontos de Monitoramento
- Autenticação JWT (sucessos e falhas)
- Autorização (acessos negados)
- Operações de estoque (descontos)
- Validações de negócio
- Erros de banco de dados

## Testes

### Endpoints para Teste

#### Autenticação
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"UserAdmin","password":"Master@123"}'
```

#### Criar Produto
```bash
curl -X POST http://localhost:8081/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Chocolate em pó",
    "tipoControle": "PESO",
    "unidadeMedida": "grama",
    "quantidadeInicial": 2000.0,
    "quantidadeAtual": 2000.0,
    "precoCompra": 20.0
  }'
```

#### Criar Receita
```bash
curl -X POST http://localhost:8081/api/receitas/criar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Brownie Tradicional",
    "descricao": "Brownie de chocolate tradicional",
    "quantidadePadraoProduzida": 12,
    "ingredientes": [
      {
        "produto": { "id": 1 },
        "quantidadeNecessaria": 500.0
      }
    ]
  }'
```

#### Registrar Produção
```bash
curl -X POST http://localhost:8081/api/producoes/registrar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "receita": { "id": 1 },
    "quantidadeProduzida": 24,
    "observacoes": "Produção de teste"
  }'
```

## Dados Iniciais

### Usuário Administrador Padrão
Na primeira execução, o sistema cria automaticamente:
- **Username**: `UserAdmin`
- **Password**: `Master@123`
- **Role**: `ADMIN`

**Localização**: `GestaoApplication.java` (CommandLineRunner)

## Deploy e Produção

### Configurações Recomendadas
```properties
# application-prod.properties
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=validate
logging.level.root=WARN
logging.level.org.springframework.security=INFO
server.port=8080
application.security.jwt.secret-key=${JWT_SECRET_KEY}
application.security.jwt.expiration=${JWT_EXPIRATION}
```

### Variáveis de Ambiente
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=production-db-host
export DB_PASSWORD=secure-password
export JWT_SECRET_KEY=your-secure-jwt-secret-key
export JWT_EXPIRATION=86400000
```

## Considerações Técnicas Importantes

### Serialização JSON
- `@JsonIgnore` em relacionamentos bidirecionais para evitar loops
- `@JsonIgnoreProperties(ignoreUnknown = true)` para deserialização flexível
- Permite buscar produtos por ID ou nome na criação de receitas

### Transações
- `@Transactional` em operações que modificam múltiplas entidades
- Rollback automático em caso de erro
- Garantia de consistência de dados

### Validações
- Validação de estoque antes de descontar
- Validação de produtos duplicados (retorna IDs quando múltiplos)
- Validação de campos obrigatórios em todas as camadas

### Tratamento de Erros
- Mensagens descritivas e informativas
- Logs detalhados para diagnóstico
- Códigos HTTP apropriados (400, 403, 404, 500)
- Respostas JSON padronizadas

---

**Autor**: ThiagoMartins2001  
**Versão**: 3.0  
**Data**: Novembro 2025  
**Status**: Sistema 100% Funcional
