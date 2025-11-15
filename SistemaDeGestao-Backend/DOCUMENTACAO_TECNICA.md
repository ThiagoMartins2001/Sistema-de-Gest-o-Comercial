# Documentação Técnica - Sistema de Gestão de Vendas e Estoque

## Autor
**ThiagoMartins2001**

## Sobre o Sistema

Este é um **Sistema de Gestão de Vendas e Estoque** desenvolvido para:
- **Gestão de Vendas**: Sistema completo de vendas (em desenvolvimento)
- **Controle de Estoque**: Gerenciamento de entrada e saída de produtos (em desenvolvimento)
- **Cadastro de Produtos**: Registro de produtos comercializados (em desenvolvimento)
- **Receitas**: Cadastro de composições e fórmulas (em desenvolvimento)
- **Cálculo de Uso**: Análise automática de consumo de materiais (em desenvolvimento)

**Status Atual**: Sistema base com autenticação JWT e gerenciamento de usuários totalmente implementado e funcional.

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

### Nova Estrutura do Projeto
O projeto foi reorganizado para melhor separação de responsabilidades e manutenibilidade:

```
src/main/java/CodingTechnology/SistemaDeGestao/
├── user/                          # Módulo de usuários
│   ├── controller/                # Controladores de usuário
│   │   └── UserController.java
│   ├── model/                     # Entidades de usuário
│   ├── controller/                # Controladores de autenticação
│   │   └── AuthController.java
│   ├── DTO/                       # DTOs de autenticação
│       └── JwtService.java
├── config/                        # Configurações da aplicação
│   └── SecurityConfiguration.java
└── GestaoApplication.java         # Classe principal da aplicação
```

### Benefícios da Nova Organização
- **Modularidade**: Cada funcionalidade tem seu próprio pacote
- **Manutenibilidade**: Código mais organizado e fácil de manter
- **Escalabilidade**: Facilita adição de novos módulos (produtos, vendas, estoque, receitas)
- **Testabilidade**: Melhor isolamento para testes unitários
- **Clareza**: Estrutura mais intuitiva para novos desenvolvedores
### Arquitetura do Sistema

│   Controller    │    │     Service     │    │   Repository    │
│                 │    │   Logic)        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│   Model/Entity  │    │   Security      │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```
┌─────────────────────────────────────────────────────────────────┐
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ Controller  │  │ Controller  │  │  SecurityConfiguration │ │
│  │ Service     │  │ DTO         │  │                         │ │
│  │ Repository  │  │ Security    │  │  GestaoApplication     │ │
│  │ Model       │  │             │  │  (Main Class)           │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Módulos Futuros (Em Desenvolvimento)               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

### 1. **User.java** - Entidade Principal
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/user/model/`

```java
@Entity
@Data
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role;
}
```

**Características Técnicas:**
- **Mapeamento JPA**: Tabela `users` no banco de dados
- **Chave Primária**: Auto-incremento (IDENTITY)
- **Constraints**: Username único e obrigatório
- **Lombok**: Anotação `@Data` gera getters, setters, equals, hashCode e toString
- **Simplificação**: Removido campo `email` para focar em `username` como identificador único

### 2. **UserRepository.java** - Camada de Acesso a Dados
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/user/repository/`

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    @Transactional
    void deleteByUsername(String username);
}
```

**Métodos Disponíveis:**
- **Herdados do JpaRepository**:
  - `save(User entity)`: Salva ou atualiza entidade
  - `findById(Long id)`: Busca por ID
  - `findAll()`: Lista todas as entidades
  - `delete(User entity)`: Remove entidade
  - `count()`: Conta total de entidades
- **Customizados**:
  - `findByUsername(String username)`: Busca por username (retorna Optional)
  - `existsByUsername(String username)`: Verifica existência por username
  - `deleteByUsername(String username)`: Remove usuário por username

### 3. **UserService.java** - Lógica de Negócio
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/user/service/`

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional
    public void deleteByUsername(String username) {
        userRepository.deleteByUsername(username);
    }
}
```

**Funcionalidades de Segurança:**
- **Criptografia Automática**: BCrypt para todas as senhas
- **Injeção de Dependência**: UserRepository e PasswordEncoder
- **Transações**: Gerenciadas automaticamente pelo Spring
- **Optional**: Uso de Optional para tratamento seguro de valores nulos

### 4. **UserController.java** - API REST de Usuários
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/user/controller/`

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/listAll")
    public ResponseEntity<List<User>> listAllUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody User user) { 
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return new ResponseEntity<>("Name already in use:", HttpStatus.CONFLICT);
        }
        userService.saveUser(user);
        return new ResponseEntity<>("User created successfully:", HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        if (userService.findByUsername(username).isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        userService.deleteByUsername(username);
        return new ResponseEntity<>("User deleted successfully!", HttpStatus.OK);
    }
}
```

**Endpoints da API:**

#### POST /api/users/create
- **Função**: Cria novo usuário (apenas administradores)
- **Autorização**: `@PreAuthorize("hasRole('ADMIN')")`
- **Content-Type**: application/json
- **Autenticação**: JWT Bearer Token (apenas ADMIN)
- **Corpo**:
```json
{
  "username": "Usuarioteste",
  "password": "senhaDoRh1234",
  "role": "RH"
}
```
- **Respostas**:
  - `201 Created`: Usuário criado com sucesso
  - `409 Conflict`: Username já existe
  - `403 Forbidden`: Acesso negado (não é ADMIN)
  - `401 Unauthorized`: Autenticação necessária

#### GET /api/users/listAll
- **Função**: Lista todos os usuários
- **Autenticação**: JWT Bearer Token obrigatório
- **Resposta**: `200 OK` - Lista de usuários em JSON

#### DELETE /api/users/delete/{username}
- **Função**: Remove usuário por username (apenas administradores)
- **Autorização**: `@PreAuthorize("hasRole('ADMIN')")`
- **Autenticação**: JWT Bearer Token (apenas ADMIN)
- **Parâmetros**: `username` (path variable)
- **Respostas**:
  - `200 OK`: Usuário removido com sucesso
  - `404 Not Found`: Usuário não encontrado
  - `403 Forbidden`: Acesso negado (não é ADMIN)
  - `401 Unauthorized`: Autenticação necessária

### 5. **AuthController.java** - API REST de Autenticação
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/controller/`

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;
    
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        log.debug("Login attempt for username={}", authRequest.getUsername());
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        
        if (authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            log.debug("Token generated for user {} (len={})", userDetails.getUsername(), token != null ? token.length() : 0);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }
}
```

**Endpoints da API:**

#### POST /api/auth/login
- **Função**: Autentica usuário e retorna token JWT
- **Acesso**: Público
- **Content-Type**: application/json
- **Corpo**:
```json
{
  "username": "UserAdmin",
  "password": "Master@123"
}
```
- **Respostas**:
  - `200 OK`: Token JWT gerado
  - `400 Bad Request`: Credenciais inválidas

### 6. **AuthRequest.java** - DTO de Autenticação
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/DTO/`

```java
@Data
public class AuthRequest {
    private String username;
    private String password;
}
```

**Funcionalidades:**
- **DTO**: Data Transfer Object para requisições de autenticação
- **Lombok**: Anotação `@Data` para geração automática de métodos
- **Validação**: Campos para username e password

### 7. **SecurityConfiguration.java** - Configuração de Segurança
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/config/`

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    
    @Autowired
    private AuthenticationProvider authenticationProvider;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

**Configurações de Segurança:**
- **CSRF**: Desabilitado para API REST
- **Autenticação**: JWT Bearer Token
- **Endpoints Públicos**: `/api/auth/**`
- **Sessões**: Stateless para JWT
- **Filtros**: JwtAuthFilter configurado
- **Method Security**: Habilitado para `@PreAuthorize`

### 8. **JwtService.java** - Serviço JWT
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/service/`

```java
@Service
public class JwtService {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        return buildToken(claims, userDetails, jwtExpiration);
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
    
    public List<? extends GrantedAuthority> extractRoles(String token) {
        final Claims claims = extractAllClaims(token);
        List<String> roles = (List<String>) claims.get("roles");
        
        if (roles == null) {
            return List.of();
        }
        
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
```

**Funcionalidades JWT:**
- **Geração**: Tokens JWT com claims personalizados (roles)
- **Validação**: Verificação de validade e expiração
- **Claims**: Extração de informações do token
- **Configuração**: Chave secreta e expiração configuráveis
- **Algoritmo**: HMAC-SHA256
- **Roles**: Inclusão de roles no token para autorização

### 9. **JwtAuthFilter.java** - Filtro de Autenticação JWT
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/security/`

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userUsername;
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = authHeader.substring(7);
        userUsername = jwtService.extractUsername(jwt);
        
        if (userUsername != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userUsername);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

**Funcionalidades do Filtro:**
- **Interceptação**: Requisições com header Authorization
- **Validação**: Tokens JWT Bearer
- **Autenticação**: Configuração automática no SecurityContext
- **Integração**: Com JwtService e CustomUserDetailsService

### 10. **ApplicationConfig.java** - Configuração de Beans
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/config/`

```java
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRepository userRepository;
    
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Beans Configurados:**
- **UserDetailsService**: Carregamento de usuários por username
- **AuthenticationProvider**: Provedor de autenticação DAO
- **AuthenticationManager**: Gerenciador de autenticação
- **PasswordEncoder**: BCrypt para criptografia

### 11. **CustomUserDetailsService.java** - Autenticação Customizada
**Localização**: `src/main/java/CodingTechnology/SistemaDeGestao/auth/security/`

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
        
        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(), 
            user.getPassword(), 
            authorities
        );
    }
}
```

**Funcionalidades:**
- **Carregamento de Usuários**: Do banco de dados por username
- **Autoridades**: Conversão de roles para Spring Security
- **Tratamento de Erros**: UsernameNotFoundException
- **Optional**: Uso de Optional para tratamento seguro

## Sistema de Autorização

### Roles e Permissões
O sistema implementa um sistema de autorização baseado em roles (RBAC - Role-Based Access Control):

#### Roles Disponíveis:
- **ADMIN**: Acesso total ao sistema
- **RH**: Acesso limitado (futuras implementações)
- **USER**: Acesso básico (futuras implementações)

#### Endpoints por Role:

| Endpoint | ADMIN | RH | USER | Público |
|----------|-------|----|----- |---------|
| POST /api/auth/login | ✅ | ✅ | ✅ | ✅ |
| POST /api/users/create | ✅ | ❌ | ❌ | ❌ |
| GET /api/users/listAll | ✅ | ✅ | ✅ | ❌ |
| DELETE /api/users/delete/{username} | ✅ | ❌ | ❌ | ❌ |

### Anotação @PreAuthorize
```java
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/create")
public ResponseEntity<String> createUser(@RequestBody User user) {
    // Apenas usuários com role ADMIN podem acessar
}

@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/delete/{username}")
public ResponseEntity<String> deleteUser(@PathVariable String username) {
    // Apenas usuários com role ADMIN podem acessar
}
```

**Funcionalidades:**
- **hasRole('ADMIN')**: Verifica se o usuário tem a role ADMIN
- **hasRole('RH')**: Verifica se o usuário tem a role RH
- **hasRole('USER')**: Verifica se o usuário tem a role USER
- **hasAnyRole('ADMIN', 'RH')**: Verifica se o usuário tem qualquer uma das roles
- **isAuthenticated()**: Verifica se o usuário está autenticado

## Sistema JWT

### Configuração JWT Atual
```properties
# JWT Configuration
application.security.jwt.secret-key=404E635266556A586E32723575782F413F4428472B4B6250645367566B5970
application.security.jwt.expiration=86400000 # 24 horas em milissegundos
```

**Parâmetros JWT:**
- **Chave Secreta**: Base64 encoded para HMAC-SHA256
- **Expiração**: 24 horas (86400000 ms)
- **Algoritmo**: HMAC-SHA256
- **Claims**: Username, roles, issued at, expiration

### Fluxo de Autenticação JWT
```
1. Cliente envia credenciais para /api/auth/login
   ↓
2. AuthenticationManager valida credenciais
   ↓
3. JwtService gera token JWT com roles
   ↓
4. Token é retornado ao cliente
   ↓
5. Cliente usa token em requisições subsequentes
   ↓
6. JwtAuthFilter valida token automaticamente
   ↓
7. SecurityContext é configurado com autenticação
   ↓
8. Endpoint é executado com autorizações apropriadas
```

### Segurança JWT
- **Stateless**: Sem armazenamento de sessão no servidor
- **Expiração**: Tokens expiram automaticamente
- **Chave Secreta**: Configurável e segura
- **Validação**: Verificação automática em cada requisição
- **Claims**: Informações mínimas necessárias
- **Roles**: Inclusão de roles no token para autorização

## Integração com Banco de Dados

### Configuração MySQL Atual
```properties
# Configurações do Servidor
server.port=8081

# Configurações do MySQL
spring.datasource.url=jdbc:mysql://localhost:2311/erp_database?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=admin
spring.datasource.password=admin
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Configurações JWT
application.security.jwt.secret-key=404E635266556A586E32723575782F413F4428472B4B6250645367566B5970
application.security.jwt.expiration=86400000
```

**Parâmetros de Conexão:**
- **Host**: localhost
- **Porta**: 2311
- **Database**: erp_database
- **Usuário**: admin
- **Senha**: admin
- **DDL**: Auto-update (cria/atualiza tabelas automaticamente)
- **SQL Logging**: Habilitado para desenvolvimento
- **Timezone**: UTC configurado
- **SSL**: Desabilitado para desenvolvimento

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

**Configurações do Container:**
- **Imagem**: MySQL 8.0 oficial
- **Restart**: Sempre
- **Porta**: 2311 externa → 3306 interna
- **Volumes**: Persistência em `./data`

## Estrutura de Dados

### Tabela `users`
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);
```

**Índices:**
- **PRIMARY KEY**: `id`
- **UNIQUE**: `username`

### Dados Iniciais
```sql
INSERT INTO users (username, password, role) VALUES 
('UserAdmin', '$2a$10$...', 'ADMIN');
```

## Fluxo de Autenticação e Autorização

```
1. Cliente faz requisição com token JWT
   ↓
2. JwtAuthFilter intercepta
   ↓
3. JwtService valida token
   ↓
4. CustomUserDetailsService carrega usuário
   ↓
5. Authorities são criadas baseadas no role
   ↓
6. @PreAuthorize verifica permissões
   ↓
7. Acesso é concedido/negado
```

## Logs e Monitoramento

### Logs de Desenvolvimento
- **SQL**: Habilitado (`spring.jpa.show-sql=true`)
- **Hibernate**: DDL automático
- **Spring Boot**: Logs padrão
- **Spring Security**: Logs de autenticação e autorização
- **JWT**: Logs de validação de tokens
- **AuthController**: Logs de tentativas de login

### Pontos de Monitoramento
- **Registro de Usuários**: Logs de criação
- **Autenticação JWT**: Sucessos e falhas
- **Autorização**: Acessos negados por role
- **Banco de Dados**: Queries executadas
- **Tokens JWT**: Geração e validação

## Testes

### Endpoints para Teste
```bash
# Autenticação JWT
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"UserAdmin","password":"Master@123"}'

# Criação de usuário (admin)
curl -X POST http://localhost:8081/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"username":"Usuarioteste","password":"senhaDoRh1234","role":"RH"}'

# Listar usuários (JWT)
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:8081/api/users/listAll

# Excluir usuário (admin)
curl -X DELETE \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:8081/api/users/delete/Usuarioteste
```

### Testes de Autorização
```bash
# Tentativa de criar usuário sem ser ADMIN
curl -X POST http://localhost:8081/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  -d '{"username":"teste","password":"123456","role":"USER"}'
# Resposta esperada: 403 Forbidden

# Tentativa de excluir usuário sem ser ADMIN
curl -X DELETE \
  -H "Authorization: Bearer <USER_JWT_TOKEN>" \
  http://localhost:8081/api/users/delete/teste
# Resposta esperada: 403 Forbidden
```

## Considerações de Segurança

### Implementadas
- ✅ Criptografia BCrypt para senhas
- ✅ Autenticação JWT
- ✅ Autorização baseada em roles
- ✅ Validação de username único
- ✅ Endpoints protegidos
- ✅ Method-level security com @PreAuthorize
- ✅ Separação de responsabilidades (create vs delete)
- ✅ Sessões stateless
- ✅ Tokens JWT com expiração
- ✅ Filtro de autenticação JWT
- ✅ Logs de autenticação

### Recomendações Futuras
- 🔒 Refresh tokens
- 🔒 Rate limiting
- 🔒 Validação de entrada com Bean Validation
- 🔒 Logs de auditoria
- 🔒 HTTPS em produção
- 🔒 Sistema de permissões mais granular
- 🔒 MFA (Multi-Factor Authentication)
- 🔒 Blacklist de tokens revogados
- 🔒 Validação de força de senha

## Performance

### Otimizações Atuais
- **Connection Pool**: HikariCP (padrão Spring Boot)
- **Lazy Loading**: JPA/Hibernate
- **Índices**: Username único
- **Method Security**: Cache de autoridades
- **JWT**: Validação local (sem consulta ao banco)
- **Sessões**: Stateless (sem armazenamento de estado)

### Monitoramento
- **Queries**: Logs habilitados
- **Tempo de Resposta**: Logs do Spring Boot
- **Memória**: JVM padrão
- **Autorização**: Logs de decisões de acesso
- **JWT**: Tempo de validação

## Deploy e Produção

### Configurações de Produção
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

## Novas Funcionalidades Implementadas

### Sistema JWT Completo
- **AuthController**: Endpoint de login JWT com logs
- **JwtService**: Geração e validação de tokens com roles
- **JwtAuthFilter**: Filtro de autenticação automática
- **Configuração**: Chave secreta e expiração configuráveis
- **Segurança**: Sessões stateless

### Endpoint POST /api/users/create
- **Propósito**: Criação de usuários por administradores
- **Segurança**: Restrito apenas para usuários com role ADMIN
- **Autenticação**: JWT Bearer Token obrigatório
- **Uso**: Para administradores criarem novos usuários no sistema

### Endpoint DELETE /api/users/delete/{username}
- **Propósito**: Exclusão de usuários por administradores
- **Segurança**: Restrito apenas para usuários com role ADMIN
- **Autenticação**: JWT Bearer Token obrigatório
- **Parâmetros**: Username do usuário a ser removido
- **Uso**: Para administradores removerem usuários do sistema

### Sistema de Autorização Aprimorado
- **@PreAuthorize**: Anotação para controle granular de acesso
- **Method Security**: Segurança em nível de método
- **Role-based Access**: Controle baseado em roles
- **Transações**: Gerenciamento de transações com @Transactional

### Modelo User Simplificado
- **Campo username**: Campo único para identificação
- **Validação**: Username único no sistema
- **Simplificação**: Removido campo email para focar em username
- **Repository**: Métodos atualizados para usar username com Optional

### Dependências JWT
- **jjwt-api**: API JWT para geração e validação
- **jjwt-impl**: Implementação JWT
- **jjwt-jackson**: Serialização/deserialização JWT

## Status do Sistema JWT

**✅ IMPLEMENTADO E FUNCIONAL**: O sistema JWT está implementado e testado. As funcionalidades incluem:

- ✅ Geração de tokens JWT com roles
- ✅ Validação de tokens JWT
- ✅ Filtro de autenticação JWT
- ✅ Configuração de segurança JWT
- ✅ Endpoint de login JWT com logs
- ✅ Configuração de beans de autenticação
- ✅ DTO para requisições de autenticação
- ✅ Testes de integração
- ✅ Validação de cenários de erro
- ✅ Testes de segurança
- ✅ Testes de performance

---

**Autor**: ThiagoMartins2001  
**Versão**: 2.0  
**Data**: Dezembro 2024