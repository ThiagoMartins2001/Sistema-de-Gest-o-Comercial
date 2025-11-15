# Documentação da API - Sistema de Gestão de Vendas e Estoque

## Autor
**ThiagoMartins2001**

## Informações Gerais

- **Base URL**: `http://localhost:8081`
- **Content-Type**: `application/json`
- **Autenticação**: JWT (JSON Web Tokens)
- **Versão**: 2.0
- **Estrutura**: Organização modular por funcionalidade (auth/, user/, config/)

## Sobre o Sistema

Este é um **Sistema de Gestão de Vendas e Estoque** em desenvolvimento, focado em:
- Gestão de vendas
- Controle de estoque
- Cadastro de produtos
- Cadastro de receitas (composição de produtos)
- Cálculo automático de uso de materiais

**Status Atual**: Sistema base com autenticação JWT, gerenciamento de usuários e gestão de produtos totalmente implementados e funcionais. Funcionalidades de vendas e estoque avançado em desenvolvimento.

## Endpoints Disponíveis

### 1. Autenticação JWT

#### POST /api/auth/login
Autentica um usuário e retorna um token JWT válido.

**URL**: `http://localhost:8081/api/auth/login`

**Método**: `POST`

**Autenticação**: Não requerida (endpoint público)

**Headers**:
```
Content-Type: application/json
```

**Corpo da Requisição**:
```json
{
  "username": "UserAdmin",
  "password": "Master@123"
}
```

**Parâmetros**:
- `username` (string, obrigatório): Nome de usuário único
- `password` (string, obrigatório): Senha do usuário

**Respostas**:

**Sucesso (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erro - Credenciais inválidas (400 Bad Request)**:
```json
{
  "error": "Invalid credentials"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "UserAdmin",
    "password": "Master@123"
  }'
```

**Exemplo de Uso (JavaScript)**:
```javascript
fetch('http://localhost:8081/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'UserAdmin',
    password: 'Master@123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Token JWT:', data.token);
  localStorage.setItem('jwt_token', data.token);
})
.catch(error => console.error('Erro:', error));
```

---

### 2. Criação de Usuário (Admin)

#### POST /api/users/create
Cria um novo usuário no sistema (apenas para administradores).

**URL**: `http://localhost:8081/api/users/create`

**Método**: `POST`

**Autenticação**: Obrigatória (apenas ADMIN)

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Corpo da Requisição**:
```json
{
  "username": "Usuarioteste",
  "password": "senhaDoRh1234",
  "role": "RH"
}
```

**Parâmetros**:
- `username` (string, obrigatório): Nome de usuário único
- `password` (string, obrigatório): Senha do usuário (será criptografada)
- `role` (string, obrigatório): Papel do usuário (ADMIN, RH, USER)

**Respostas**:

**Sucesso (201 Created)**:
```
User created successfully:
```

**Erro - Username já existe (409 Conflict)**:
```
Name already in use:
```

**Erro - Acesso negado (403 Forbidden)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

**Erro - Não autorizado (401 Unauthorized)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -X POST http://localhost:8081/api/users/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "username": "Usuarioteste",
    "password": "senhaDoRh1234",
    "role": "RH"
  }'
```

**Exemplo de Uso (JavaScript)**:
```javascript
const token = localStorage.getItem('jwt_token');

fetch('http://localhost:8081/api/users/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    username: 'Usuarioteste',
    password: 'senhaDoRh1234',
    role: 'RH'
  })
})
.then(response => response.text())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

---

### 3. Listagem de Usuários

#### GET /api/users/listAll
Lista todos os usuários registrados no sistema.

**URL**: `http://localhost:8081/api/users/listAll`

**Método**: `GET`

**Autenticação**: JWT Bearer Token obrigatório

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Respostas**:

**Sucesso (200 OK)**:
```json
[
  {
    "id": 1,
    "username": "UserAdmin",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "Usuarioteste",
    "role": "RH"
  }
]
```

**Erro - Não autorizado (401 Unauthorized)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8081/api/users/listAll
```

**Exemplo de Uso (JavaScript)**:
```javascript
const token = localStorage.getItem('jwt_token');

fetch('http://localhost:8081/api/users/listAll', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

---

### 4. Exclusão de Usuário (Admin)

#### DELETE /api/users/delete/{username}
Remove um usuário do sistema por username (apenas para administradores).

**URL**: `http://localhost:8081/api/users/delete/{username}`

**Método**: `DELETE`

**Autenticação**: Obrigatória (apenas ADMIN)

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Parâmetros**:
- `username` (string, obrigatório): Nome de usuário a ser removido (path variable)

**Respostas**:

**Sucesso (200 OK)**:
```
User deleted successfully!
```

**Erro - Usuário não encontrado (404 Not Found)**:
```
User not found
```

**Erro - Acesso negado (403 Forbidden)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

**Erro - Não autorizado (401 Unauthorized)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -X DELETE \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8081/api/users/delete/Usuarioteste
```

**Exemplo de Uso (JavaScript)**:
```javascript
const token = localStorage.getItem('jwt_token');

fetch('http://localhost:8081/api/users/delete/Usuarioteste', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.text())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

---

## Códigos de Status HTTP

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| 200 | OK | Requisição bem-sucedida (listagens, criação de produtos) |
| 201 | Created | Usuário criado com sucesso |
| 204 | No Content | Operação bem-sucedida sem conteúdo (exclusões) |
| 400 | Bad Request | Dados inválidos na requisição, credenciais inválidas ou campos obrigatórios ausentes |
| 401 | Unauthorized | Autenticação necessária ou falhou |
| 403 | Forbidden | Acesso negado (endpoints restritos apenas para ADMIN) |
| 404 | Not Found | Endpoint não encontrado, usuário não encontrado ou produto não encontrado |
| 409 | Conflict | Username já existe |
| 500 | Internal Server Error | Erro interno do servidor |

---

## Autenticação JWT

### Como Funciona
A autenticação JWT utiliza tokens Bearer no header `Authorization`. O fluxo é:

1. **Login**: Cliente envia credenciais para `/api/auth/login`
2. **Validação**: Servidor valida credenciais e gera token JWT
3. **Resposta**: Token JWT é retornado ao cliente
4. **Uso**: Cliente usa token em requisições subsequentes
5. **Validação**: Servidor valida token automaticamente em cada requisição

### Formato
```
Authorization: Bearer <JWT_TOKEN>
```

### Exemplo de Token JWT
```javascript
// Token JWT típico (exemplo)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVc2VyQWRtaW4iLCJpYXQiOjE2MzU2NzI4MDAsImV4cCI6MTYzNTc1OTIwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Uso em requisições
fetch('/api/users/listAll', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Configuração JWT Atual
- **Chave Secreta**: `404E635266556A586E32723575782F413F4428472B4B6250645367566B5970`
- **Expiração**: 24 horas (86400000 ms)
- **Algoritmo**: HMAC-SHA256
- **Claims**: Username, roles, issued at, expiration

---

### 5. Cadastro de Produto

#### POST /api/products/create
Cadastra um novo produto/ingrediente no sistema.

**URL**: `http://localhost:8081/api/products/create`

**Método**: `POST`

**Autenticação**: JWT Bearer Token obrigatório

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Corpo da Requisição**:
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

**Parâmetros**:
- `nome` (string, obrigatório): Nome do produto/ingrediente
- `tipoControle` (string, obrigatório): Tipo de controle (QUANTIDADE, PESO, VOLUME)
- `unidadeMedida` (string, obrigatório): Unidade de medida (unidade, grama, litro, etc.)
- `quantidadeInicial` (double, opcional): Quantidade inicial comprada
- `quantidadeAtual` (double, opcional): Quantidade atual no estoque
- `precoCompra` (double, opcional): Preço de compra do produto
- `precoVenda` (double, opcional): Preço de venda do produto

**Respostas**:

**Sucesso (200 OK)**:
```json
{
  "id": 1,
  "nome": "Chocolate em pó",
  "tipoControle": "PESO",
  "unidadeMedida": "grama",
  "quantidadeInicial": 1000.0,
  "quantidadeAtual": 1000.0,
  "precoCompra": 20.0,
  "precoVenda": 0.0
}
```

**Erro - Campos obrigatórios ausentes (400 Bad Request)**:
```
O nome do produto é obrigatório.
```
ou
```
O tipo de controle é obrigatório.
```
ou
```
A unidade de medida é obrigatória.
```

**Erro - Não autorizado (401 Unauthorized)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -X POST http://localhost:8081/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "nome": "Chocolate em pó",
    "tipoControle": "PESO",
    "unidadeMedida": "grama",
    "quantidadeInicial": 1000.0,
    "quantidadeAtual": 1000.0,
    "precoCompra": 20.0,
    "precoVenda": 0.0
  }'
```

---

### 6. Listagem de Produtos

#### GET /api/products/list
Lista todos os produtos cadastrados no sistema.

**URL**: `http://localhost:8081/api/products/list`

**Método**: `GET`

**Autenticação**: JWT Bearer Token obrigatório

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Respostas**:

**Sucesso (200 OK)**:
```json
[
  {
    "id": 1,
    "nome": "Chocolate em pó",
    "tipoControle": "PESO",
    "unidadeMedida": "grama",
    "quantidadeInicial": 1000.0,
    "quantidadeAtual": 1000.0,
    "precoCompra": 20.0,
    "precoVenda": 0.0
  },
  {
    "id": 2,
    "nome": "Açúcar",
    "tipoControle": "QUANTIDADE",
    "unidadeMedida": "kg",
    "quantidadeInicial": 5.0,
    "quantidadeAtual": 4.5,
    "precoCompra": 15.0,
    "precoVenda": 0.0
  }
]
```

**Erro - Não autorizado (401 Unauthorized)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8081/api/products/list
```

---

### 7. Exclusão de Produto por ID

#### DELETE /api/products/delete/{id}
Remove um produto do sistema pelo ID.

**URL**: `http://localhost:8081/api/products/delete/{id}`

**Método**: `DELETE`

**Autenticação**: JWT Bearer Token obrigatório

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Parâmetros**:
- `id` (long, obrigatório): ID do produto a ser removido (path variable)

**Respostas**:

**Sucesso (204 No Content)**:
```
(Resposta vazia)
```

**Erro - Produto não encontrado (404 Not Found)**:
```
(Resposta vazia)
```

**Erro - Não autorizado (401 Unauthorized)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -X DELETE \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8081/api/products/delete/1
```

---

### 8. Exclusão Geral e Reset do ID (Admin)

#### DELETE /api/products/delete/all-reset
Remove todos os produtos do sistema e reinicia o contador de ID (apenas para administradores).

**URL**: `http://localhost:8081/api/products/delete/all-reset`

**Método**: `DELETE`

**Autenticação**: Obrigatória (apenas ADMIN)

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Respostas**:

**Sucesso (204 No Content)**:
```
(Resposta vazia)
```

**Erro - Acesso negado (403 Forbidden)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

**Erro - Não autorizado (401 Unauthorized)**:
```json
{
  "timestamp": "2024-01-01T12:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

**Exemplo de Uso (cURL)**:
```bash
curl -X DELETE \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8081/api/products/delete/all-reset
```

---

## Códigos de Status HTTP

### Python (requests)
```python
import requests
import json

class GestaoClient:
    """Cliente Python para o Sistema de Gestão de Vendas e Estoque"""
    def __init__(self, base_url="http://localhost:8081"):
        self.base_url = base_url
        self.token = None
    
    def login(self, username, password):
        """Autentica usuário e obtém token JWT"""
        url = f"{self.base_url}/api/auth/login"
        data = {
            "username": username,
            "password": password
        }
        
        response = requests.post(url, json=data)
        if response.status_code == 200:
            self.token = response.json()["token"]
            return True
        return False
    
    def create_user(self, username, password, role):
        """Cria novo usuário (apenas ADMIN)"""
        if not self.token:
            return "Token não disponível. Faça login primeiro."
        
        url = f"{self.base_url}/api/users/create"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }
        data = {
            "username": username,
            "password": password,
            "role": role
        }
        
        response = requests.post(url, json=data, headers=headers)
        return response.status_code, response.text
    
    def list_users(self):
        """Lista todos os usuários"""
        if not self.token:
            return "Token não disponível. Faça login primeiro."
        
        url = f"{self.base_url}/api/users/listAll"
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        return response.text
    
    def delete_user(self, username):
        """Exclui usuário (apenas ADMIN)"""
        if not self.token:
            return "Token não disponível. Faça login primeiro."
        
        url = f"{self.base_url}/api/users/delete/{username}"
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        response = requests.delete(url, headers=headers)
        return response.status_code, response.text

# Exemplo de uso
client = GestaoClient()

# Login como admin
if client.login("UserAdmin", "Master@123"):
    print("Login realizado com sucesso!")
    
    # Criar usuário
    status, result = client.create_user("Usuarioteste", "senhaDoRh1234", "RH")
    print(f"Criação: {status} - {result}")
    
    # Listar usuários
    users = client.list_users()
    print(f"Usuários: {users}")
    
    # Excluir usuário
    status, result = client.delete_user("Usuarioteste")
    print(f"Exclusão: {status} - {result}")
else:
    print("Falha no login")
```

### Java (HttpClient)
```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Cliente Java para o Sistema de Gestão de Vendas e Estoque
 */
public class GestaoClient {
    private static final String BASE_URL = "http://localhost:8081";
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final ObjectMapper mapper = new ObjectMapper();
    private String token;
    
    public boolean login(String username, String password) throws Exception {
        String json = String.format(
            "{\"username\":\"%s\",\"password\":\"%s\"}",
            username, password
        );
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/api/auth/login"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            Map<String, String> result = mapper.readValue(response.body(), Map.class);
            this.token = result.get("token");
            return true;
        }
        return false;
    }
    
    public String createUser(String username, String password, String role) throws Exception {
        if (token == null) {
            return "Token não disponível. Faça login primeiro.";
        }
        
        String json = String.format(
            "{\"username\":\"%s\",\"password\":\"%s\",\"role\":\"%s\"}",
            username, password, role
        );
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/api/users/create"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + token)
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        return response.body();
    }
    
    public String listUsers() throws Exception {
        if (token == null) {
            return "Token não disponível. Faça login primeiro.";
        }
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/api/users/listAll"))
            .header("Authorization", "Bearer " + token)
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        return response.body();
    }
    
    public String deleteUser(String username) throws Exception {
        if (token == null) {
            return "Token não disponível. Faça login primeiro.";
        }
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/api/users/delete/" + username))
            .header("Authorization", "Bearer " + token)
            .DELETE()
            .build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        return response.body();
    }
}
```

### PHP (cURL)
```php
<?php

/**
 * Cliente PHP para o Sistema de Gestão de Vendas e Estoque
 */
class GestaoClient {
    private $baseUrl = 'http://localhost:8081';
    private $token = null;
    
    public function login($username, $password) {
        $data = [
            'username' => $username,
            'password' => $password
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/api/auth/login');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $result = json_decode($response, true);
            $this->token = $result['token'];
            return true;
        }
        return false;
    }
    
    public function createUser($username, $password, $role) {
        if ($this->token === null) {
            return ['code' => 401, 'response' => 'Token não disponível. Faça login primeiro.'];
        }
        
        $data = [
            'username' => $username,
            'password' => $password,
            'role' => $role
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/api/users/create');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return ['code' => $httpCode, 'response' => $response];
    }
    
    public function listUsers() {
        if ($this->token === null) {
            return ['code' => 401, 'response' => 'Token não disponível. Faça login primeiro.'];
        }
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/api/users/listAll');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return ['code' => $httpCode, 'response' => json_decode($response, true)];
    }
    
    public function deleteUser($username) {
        if ($this->token === null) {
            return ['code' => 401, 'response' => 'Token não disponível. Faça login primeiro.'];
        }
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/api/users/delete/' . $username);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return ['code' => $httpCode, 'response' => $response];
    }
}

// Exemplo de uso
$client = new GestaoClient();

// Login como admin
if ($client->login('UserAdmin', 'Master@123')) {
    echo "Login realizado com sucesso!\n";
    
    // Criar usuário
    $result = $client->createUser('Usuarioteste', 'senhaDoRh1234', 'RH');
    echo "Criação: " . $result['code'] . " - " . $result['response'] . "\n";
    
    // Listar usuários
    $users = $client->listUsers();
    echo "Usuários: " . print_r($users, true) . "\n";
    
    // Excluir usuário
    $result = $client->deleteUser('Usuarioteste');
    echo "Exclusão: " . $result['code'] . " - " . $result['response'] . "\n";
} else {
    echo "Falha no login\n";
}

?>
```

---

## Testes com Postman

### Collection JSON
```json
{
  "info": {
    "name": "Sistema de Gestão API v2.0",
    "description": "Testes da API do Sistema de Gestão com JWT"
  },
  "item": [
    {
      "name": "Login JWT",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"UserAdmin\",\n  \"password\": \"Master@123\"\n}"
        },
        "url": {
          "raw": "http://localhost:8081/api/auth/login",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8081",
          "path": ["api", "auth", "login"]
        }
      }
    },
    {
      "name": "Criar Usuário (Admin)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"Usuarioteste\",\n  \"password\": \"senhaDoRh1234\",\n  \"role\": \"RH\"\n}"
        },
        "url": {
          "raw": "http://localhost:8081/api/users/create",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8081",
          "path": ["api", "users", "create"]
        }
      }
    },
    {
      "name": "Listar Usuários",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:8081/api/users/listAll",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8081",
          "path": ["api", "users", "listAll"]
        }
      }
    },
    {
      "name": "Excluir Usuário (Admin)",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "http://localhost:8081/api/users/delete/{{username}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8081",
          "path": ["api", "users", "delete", "{{username}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "jwt_token",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    {
      "key": "username",
      "value": "Usuarioteste"
    }
  ]
}
```

---

## Sistema de Roles

### Roles Disponíveis
- **ADMIN**: Acesso total ao sistema
  - Pode criar usuários
  - Pode excluir usuários
  - Pode listar usuários
  - Pode criar, listar e excluir produtos
  - Pode excluir todos os produtos e resetar IDs
- **RH**: Acesso limitado (futuras implementações)
  - Pode criar, listar e excluir produtos (por ID)
  - Pode listar usuários
- **USER**: Acesso básico (futuras implementações)
  - Pode criar, listar e excluir produtos (por ID)
  - Pode listar usuários

### Fluxo de Autenticação
1. **Login**: Usuário faz login com username/password
2. **Token**: Sistema retorna token JWT válido por 24 horas
3. **Autorização**: Token é enviado no header `Authorization: Bearer <token>`
4. **Validação**: Sistema valida token e verifica permissões

---

## Limitações Atuais

1. **Autenticação**: JWT implementado e testado ✅
2. **Validação**: Validação básica de username único e campos de produtos ✅
3. **Roles**: ADMIN, RH, USER ✅
4. **Endpoints**: Operações básicas de usuário (CRUD parcial) ✅
5. **Endpoints**: Operações básicas de produtos (CRUD parcial) ✅
6. **Segurança**: Sem rate limiting ou validação avançada
7. **Autorização**: Endpoints de usuários e produtos restritos por role ✅
8. **Registro**: Sem endpoint público de registro de usuários
9. **Refresh Tokens**: Não implementado
10. **Revogação**: Sem sistema de revogação de tokens
11. **Produtos**: Sem endpoint de atualização (PUT/PATCH) ainda

---

## Próximas Versões

### v2.1 (Planejado) - Funcionalidades Avançadas de Estoque e Vendas
- [ ] Testes completos do sistema JWT
- [ ] Refresh tokens
- [ ] Validação de entrada com Bean Validation
- [ ] Rate limiting
- [ ] Logs de auditoria
- [ ] Endpoint para atualização de usuários
- [ ] Endpoint público de registro de usuários
- [ ] **Endpoint para atualização de produtos (PUT/PATCH)**
- [ ] **Busca e filtros de produtos**
- [ ] **Controle de estoque avançado**
- [ ] **Sistema de vendas**
- [ ] **Cadastro de receitas**
- [ ] **Cálculo de uso de materiais**
- [ ] **Histórico de movimentações de estoque**

### v2.2 (Planejado) - Análises e Relatórios
- [ ] Dashboard de vendas
- [ ] Relatórios de consumo de materiais
- [ ] Análise de rentabilidade por produto
- [ ] Sistema de notificações (estoque baixo)
- [ ] Sistema de permissões mais granular
- [ ] Blacklist de tokens revogados

---

## Status do Sistema JWT

**✅ IMPLEMENTADO E FUNCIONAL**: O sistema JWT está implementado e testado. As funcionalidades incluem:

- ✅ Geração de tokens JWT
- ✅ Validação de tokens JWT
- ✅ Filtro de autenticação JWT
- ✅ Configuração de segurança JWT
- ✅ Endpoint de login JWT
- ✅ Configuração de beans de autenticação
- ✅ DTO para requisições de autenticação
- ✅ Testes de integração
- ✅ Validação de cenários de erro
- ✅ Testes de segurança
- ✅ Testes de performance

---

## Nova Estrutura do Projeto

### Organização Modular
O projeto foi reorganizado para melhor separação de responsabilidades:

```
## Análise Detalhada das Classes

### Estrutura do Sistema

```
src/main/java/CodingTechnology/SistemaDeGestao/
├── user/                          # Módulo de usuários
│   ├── controller/                # Controladores de usuário
│   │   └── UserController.java
│   ├── model/                     # Entidades de usuário
│   │   └── User.java
│   ├── repository/                # Repositórios de usuário
│   │   └── UserRepository.java
│   └── service/                   # Serviços de usuário
│       └── UserService.java
├── auth/                          # Módulo de autenticação
│   ├── controller/                # Controladores de autenticação
│   │   └── AuthController.java
│   ├── DTO/                       # DTOs de autenticação
│   │   └── AuthRequest.java
│   └── security/                  # Componentes de segurança
│       ├── JwtAuthFilter.java
│       └── JwtService.java
├── config/                       # Configurações da aplicação
│   └── SecurityConfiguration.java
└── GestaoApplication.java        # Classe principal
```

### Benefícios da Nova Estrutura
- **Separação Clara**: Cada módulo tem responsabilidades específicas
- **Manutenibilidade**: Código mais organizado e fácil de manter
- **Escalabilidade**: Facilita adição de novos módulos (produtos, vendas, estoque)
- **Testabilidade**: Melhor isolamento para testes unitários
- **Reutilização**: Componentes podem ser reutilizados entre módulos

**Autor**: ThiagoMartins2001  
**Versão da API**: 2.0  
**Última Atualização**: Dezembro 2024