# Guia de Diagnóstico - Erro 403 Forbidden

## Problema
Ao tentar usar o endpoint `DELETE /api/products/delete/all-reset`, está retornando erro 403.

## Soluções Implementadas

### 1. Endpoint de Diagnóstico
Foi adicionado um novo endpoint para verificar as authorities do usuário autenticado:

**GET /api/auth/me**

Este endpoint retorna informações sobre o usuário autenticado e suas authorities.

### 2. Logs Melhorados
- Logs de INFO no JwtAuthFilter mostrando o processamento de cada requisição
- Logs detalhando as authorities sendo definidas
- Logs no ProductController mostrando quem está chamando o endpoint

## Como Testar Corretamente

### Passo 1: Fazer Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"UserAdmin\", \"password\": \"Master@123\"}"
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Passo 2: Verificar Autenticação (Diagnóstico)
```bash
curl -X GET http://localhost:8081/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada (usuário ADMIN):**
```json
{
  "authenticated": true,
  "username": "UserAdmin",
  "authorities": [
    "ROLE_ADMIN"
  ],
  "principal": "User",
  "userDetailsAuthorities": [
    "ROLE_ADMIN"
  ]
}
```

**Importante:** Verifique se o campo `authorities` contém `"ROLE_ADMIN"` (com o prefixo `ROLE_`).

### Passo 3: Testar o Endpoint Problema
```bash
curl -X DELETE http://localhost:8081/api/products/delete/all-reset \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -v
```

A flag `-v` mostra mais detalhes da resposta HTTP.

### Passo 4: Verificar os Logs do Servidor

Procure nos logs do servidor por mensagens como:

```
INFO - Processing request: DELETE /api/products/delete/all-reset
INFO - Setting authentication for user: UserAdmin with authorities: [ROLE_ADMIN]
INFO - Authentication successfully set in SecurityContext for user: UserAdmin
INFO - Delete all-reset called by user: UserAdmin with authorities: [ROLE_ADMIN]
```

## Possíveis Problemas e Soluções

### Problema 1: Token não está sendo enviado
**Sintoma:** No log aparece "No Bearer token found in request"

**Solução:** Certifique-se de que está enviando o header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Erro comum:** Espaço após "Bearer" ou token entre aspas.

### Problema 2: Token inválido ou expirado
**Sintoma:** No log aparece "Token invalid for user" ou "Failed to extract username from JWT"

**Solução:** 
1. Faça login novamente para obter um novo token
2. Os tokens expiram após 24 horas

### Problema 3: Usuário não tem role ADMIN
**Sintoma:** No endpoint `/api/auth/me` o campo `authorities` não contém `ROLE_ADMIN`

**Solução:**
1. Verifique se o usuário tem role "ADMIN" no banco de dados
2. Faça login novamente para gerar um token com as authorities corretas

### Problema 4: Authorities sem prefixo ROLE_
**Sintoma:** No endpoint `/api/auth/me` as authorities aparecem sem o prefixo `ROLE_`

**Solução:** Isso já foi corrigido no código. Se ainda ocorrer, verifique se o token foi gerado após a correção.

## Teste Completo com Script

Crie um arquivo `test-endpoint.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8081"

echo "1. Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "UserAdmin", "password": "Master@123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
    echo "ERRO: Falha no login"
    echo "Resposta: $LOGIN_RESPONSE"
    exit 1
fi

echo "Token obtido: ${TOKEN:0:50}..."
echo ""

echo "2. Verificando autenticação..."
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo ""
echo "3. Testando endpoint delete/all-reset..."
curl -v -X DELETE $BASE_URL/api/products/delete/all-reset \
  -H "Authorization: Bearer $TOKEN"

echo ""
```

Execute: `bash test-endpoint.sh`

## Exemplo de Requisição Correta (cURL completo)

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "UserAdmin", "password": "Master@123"}' \
  | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "Token: $TOKEN"

# 2. Verificar auth
curl -X GET http://localhost:8081/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Testar endpoint
curl -v -X DELETE http://localhost:8081/api/products/delete/all-reset \
  -H "Authorization: Bearer $TOKEN"
```

## Verificação no Postman

1. **Variável de Ambiente:** Crie uma variável `jwt_token` no Postman

2. **Request de Login:**
   - Method: POST
   - URL: `http://localhost:8081/api/auth/login`
   - Body (JSON):
     ```json
     {
       "username": "UserAdmin",
       "password": "Master@123"
     }
     ```
   - **Tests Tab (para salvar o token):**
     ```javascript
     if (pm.response.code === 200) {
         var jsonData = pm.response.json();
         pm.environment.set("jwt_token", jsonData.token);
     }
     ```

3. **Request de Verificação:**
   - Method: GET
   - URL: `http://localhost:8081/api/auth/me`
   - Headers:
     ```
     Authorization: Bearer {{jwt_token}}
     ```

4. **Request do Endpoint:**
   - Method: DELETE
   - URL: `http://localhost:8081/api/products/delete/all-reset`
   - Headers:
     ```
     Authorization: Bearer {{jwt_token}}
     ```

## Checklist de Verificação

- [ ] Token foi obtido com sucesso do endpoint `/api/auth/login`
- [ ] Token está sendo enviado no header `Authorization: Bearer TOKEN`
- [ ] Endpoint `/api/auth/me` retorna `"ROLE_ADMIN"` no campo `authorities`
- [ ] Logs do servidor mostram "Authentication successfully set"
- [ ] Logs do servidor mostram "Delete all-reset called by user"

## Próximos Passos se o Problema Persistir

1. Compartilhe a resposta completa do endpoint `/api/auth/me`
2. Compartilhe os logs do servidor (especialmente as linhas com "INFO" relacionadas à autenticação)
3. Verifique se o usuário no banco de dados realmente tem `role = "ADMIN"`