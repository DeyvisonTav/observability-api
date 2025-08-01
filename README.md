# 🔍 Observability API

Uma API RESTful robusta construída com NestJS focada em observabilidade, monitoramento e rastreamento distribuído.

## 📋 Descrição

Este projeto implementa uma API completa com observabilidade avançada, incluindo telemetria, tracing distribuído, logs estruturados e métricas. A API fornece um CRUD completo de usuários como exemplo de implementação, mas foi arquitetada para ser facilmente extensível.

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe para TypeScript
- **[OpenTelemetry](https://opentelemetry.io/)** - Observabilidade e telemetria
- **[Jaeger](https://www.jaegertracing.io/)** - Tracing distribuído
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação da API
- **[scalar](https://scalar.com/)** - Documentação moderna da API
- **[Docker](https://www.docker.com/)** - Containerização

## ✨ Funcionalidades

### CRUD de usuários para teste de observabilidade
- ✅ Criar usuário
- ✅ Buscar usuário por ID
- ✅ Buscar usuário por email
- ✅ Listar todos os usuários
- ✅ Atualizar usuário
- ✅ Remover usuário

### 🔍 Observabilidade
- ✅ **Tracing distribuído** com OpenTelemetry e Jaeger
- ✅ **Logs estruturados** com contexto de trace
- ✅ **Interceptadores** para padronização de respostas
- ✅ **Filtros globais** para tratamento de exceções
- ✅ **Validações automáticas** com class-validator

### 📚 Documentação
- ✅ **Swagger UI** - Interface interativa da API
- ✅ **Scalar** - Documentação moderna da API
- ✅ **OpenAPI 3.0** - Especificação completa

## 🛠️ Configuração do Projeto

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Docker** e **Docker Compose**

### Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd observability

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### Configuração do Banco de Dados

```bash
# Subir PostgreSQL e Jaeger
docker-compose up -d

# Executar migrations
npx drizzle-kit generate
npx drizzle-kit migrate
```

## 🚦 Executando o Projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod

# Debug
npm run start:debug
```

A API estará disponível em `http://localhost:${process.env.PORT}`

## 📖 Documentação da API

### Interfaces Disponíveis

- **Swagger UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Scalar**: [http://localhost:3000/api/scalar](http://localhost:3000/api/scalar)
- **OpenAPI JSON**: [http://localhost:3000/api/json](http://localhost:3000/api/json)

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/users` | Criar novo usuário |
| `GET` | `/users` | Listar todos os usuários |
| `GET` | `/users/:id` | Buscar usuário por ID |
| `GET` | `/users/email/:email` | Buscar usuário por email |
| `PUT` | `/users/:id` | Atualizar usuário |
| `DELETE` | `/users/:id` | Remover usuário |

## 🔍 Monitoramento e Observabilidade

### Jaeger UI
Acesse o Jaeger para visualizar traces distribuídos:
- **URL**: [http://localhost:16686](http://localhost:16686)

### Portas dos Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| API | 3000 | Aplicação principal |
| PostgreSQL | 5432 | Banco de dados |
| Jaeger UI | 16686 | Interface do Jaeger |
| Jaeger Collector | 14268 | Coleta de traces |
| OTLP gRPC | 4317 | OpenTelemetry gRPC |
| OTLP HTTP | 4318 | OpenTelemetry HTTP |

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes e2e
npm run test:e2e
```

## 🏗️ Estrutura do Projeto

```
src/
├── common/              # Componentes compartilhados
│   ├── filters/         # Filtros globais de exceção
│   ├── interceptors/    # Interceptadores de resposta
│   └── interfaces/      # Interfaces base
├── config/              # Configurações da aplicação
├── database/            # Configuração do banco de dados
│   ├── migrations/      # Scripts de migração
│   └── schemas/         # Esquemas do Drizzle ORM
├── modules/             # Módulos da aplicação
│   └── user/           # Módulo de usuários
│       ├── controllers/ # Controllers
│       ├── dtos/       # Data Transfer Objects
│       ├── entities/   # Entidades
│       ├── interfaces/ # Interfaces do módulo
│       ├── repositories/ # Repositórios
│       └── services/   # Services
└── main.ts             # Ponto de entrada da aplicação
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Executar em modo de desenvolvimento
npm run start:debug     # Executar em modo debug

# Build
npm run build           # Compilar projeto
npm run start:prod      # Executar versão de produção

# Qualidade de código
npm run lint            # Executar ESLint
npm run format          # Formatar código com Prettier

# Banco de dados
npm run db:generate     # Gerar migrations
npm run db:push         # Aplicar mudanças no banco
npm run db:studio       # Abrir Drizzle Studio
```

## 🐳 Docker

O projeto inclui configuração Docker completa:

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs dos serviços
docker-compose logs -f

# Parar todos os serviços
docker-compose down
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ usando <a href="https://nestjs.com/">NestJS</a>
</p>
