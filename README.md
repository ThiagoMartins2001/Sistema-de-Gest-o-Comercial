# Sistema de Gestão de Vendas e Estoque

**Autor:** ThiagoMartins2001

## 📋 Visão Geral do Projeto

O **Sistema de Gestão de Vendas e Estoque** é uma solução robusta desenvolvida para facilitar o controle administrativo de pequenos e médios negócios. Seu foco principal é oferecer uma gestão eficiente de estoque, controle de produção e administração de receitas, automatizando processos que normalmente são manuais e propensos a erros.

O sistema atua como o "cérebro" das operações, gerenciando desde a entrada de ingredientes até a produção final, garantindo que o estoque físico corresponda sempre ao registro digital.

### 🎯 Principais Objetivos

- **Controle Preciso de Estoque:** Monitoramento em tempo real de matérias-primas e produtos acabados.
- **Automação de Baixa de Estoque:** Ao registrar uma produção, o sistema calcula e desconta automaticamente os ingredientes necessários baseados na receita.
- **Padronização de Processos:** Cadastro de receitas detalhadas para garantir consistência na produção.
- **Segurança e Auditoria:** Controle de acesso através de diferentes níveis de permissão (Administrador, RH, Usuário).

## 🚀 Funcionalidades Principais

O sistema é composto por duas grandes partes:

### Frontend (Novo! 🎨)
Desenvolvido em **Next.js 14** e **Tailwind CSS**, oferece uma interface moderna e responsiva.
- **Dashboard Interativo**: Visão geral do sistema.
- **Gestão Visual**: Tabelas e formulários intuitivos para produtos e receitas.
- **Autenticação**: Interface segura de login.

### Backend (Core ⚙️)
API robusta em **Spring Boot** que gerencia toda a lógica de negócios.

### 1. Gestão de Estoque Inteligente
- Controle de produtos por **Quantidade**, **Peso** (kg/g) ou **Volume** (l/ml).
- Monitoramento de preços de compra e venda.

### 2. Engenharia de Cardápio e Receitas
- Cadastro detalhado de receitas.
- Vinculação de ingredientes a produtos do estoque.
- Definição de quantidades padrão de produção.

### 3. Controle de Produção
- Registro simplificado de produções realizadas.
- **Cálculo Automático**: O sistema valida se há ingredientes suficientes antes de autorizar a produção.
- Histórico completo de todas as produções realizadas.

### 4. Segurança e Acesso
- Login seguro com criptografia e JWT.
- Perfis de acesso diferenciados (Admin, User).

## 🐳 Como Rodar o Projeto (Docker)

A maneira mais fácil de iniciar o sistema completo (Frontend + Backend + Banco de Dados) é usando o Docker.

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd SistemaDeGestao
   ```

2. **Inicie os serviços**:
   Isso fará o build do Frontend e Backend e iniciará o banco de dados.
   ```bash
   docker-compose up --build -d
   ```

3. **Acesse o Sistema**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8081](http://localhost:8081)

## 📚 Documentação Técnica

Este arquivo README foca no propósito e nas funcionalidades do negócio. Se você é um desenvolvedor e procura informações sobre:

- Instalação Manual
- Endpoints da API e Exemplos JSON
- Estrutura de Pastas (Frontend e Backend)
- Detalhes sobre o Banco de Dados

Por favor, consulte nossa **[Documentação Técnica Detalhada](DOCUMENTACAO_TECNICA.md)**.

## 🔮 O Que Vem Por Aí? (Roadmap)

Estamos constantemente melhorando o sistema. As próximas atualizações focam em:

- **Controle de Vendas**: Módulo completo de PDV.
- **Dashboard Gerencial**: Gráficos e indicadores de desempenho.
- **Relatórios Avançados**: Análise de rentabilidade e desperdício.
- **Logs de Auditoria**: Rastreio detalhado de ações dos usuários.

## 🤝 Contribuição

Contribuições são sempre bem-vindas!
1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/IncrivelFeature`)
3. Adicione suas mudanças (`git commit -m 'Adicionando uma Incrível Feature'`)
4. Faça o Push da Branch (`git push origin feature/IncrivelFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido por Thiago Martins** 🚀
