# Habithos

🇺🇸 [Read in English](README.md)

Um rastreador de hábitos gamificado — um "RPG da vida real". O usuário cria hábitos, rotinas, missões e recompensas
pessoais; cumpri-los gera XP, níveis, moedas, atributos e sequências (streaks), e faz um personagem evoluir.

> 🚧 Em desenvolvimento. Este também é um projeto de aprendizado, com foco em TypeScript e arquitetura full stack.

## Tecnologias

| Camada         | Tecnologias                                               |
| -------------- | --------------------------------------------------------- |
| Frontend       | React 19, Vite, TypeScript, Tailwind CSS                  |
| Backend        | Node.js, Express 5, TypeScript                            |
| Banco de dados | PostgreSQL 18 (Docker), Drizzle ORM, node-postgres (`pg`) |
| Compartilhado  | Regras do jogo como funções TypeScript puras e testadas   |
| Ferramentas    | npm workspaces, Vitest, ESLint, Prettier                  |

## Estrutura do projeto

```
apps/
  api/        API Express (o schema do banco e as migrations ficam aqui)
  web/        Aplicação React
packages/
  shared/     Código usado pelos dois apps (regras do jogo, tipos)
docker-compose.yml   Serviço PostgreSQL para desenvolvimento local
```

## Pré-requisitos

- Node.js 24+ e npm 11+
- Docker Desktop (em execução)

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o seu arquivo de ambiente a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
   Depois edite o `.env`: defina uma senha em `POSTGRES_PASSWORD`, `DATABASE_URL` e `TEST_DATABASE_URL`,
   e troque o `JWT_SECRET` por um valor aleatório, por exemplo a saída de:
   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```
3. Suba o banco e aplique as migrations:
   ```bash
   npm run db:up
   npm run db:migrate
   ```
4. Inicie a API e a aplicação web:
   ```bash
   npm run dev
   ```
   - Web: http://localhost:5173
   - Health check da API: http://localhost:5173/api/health

## Scripts

| Script                                 | Descrição                                                       |
| -------------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                          | Inicia a API e a aplicação web juntas                           |
| `npm test`                             | Roda os testes uma vez (`test:watch` para continuar observando) |
| `npm run typecheck`                    | Verifica os tipos de todos os workspaces                        |
| `npm run lint`                         | Roda o lint no repositório inteiro                              |
| `npm run format`                       | Formata o código com o Prettier                                 |
| `npm run db:up`                        | Sobe o PostgreSQL no Docker e espera até ele ficar pronto       |
| `npm run db:down`                      | Para e remove o contêiner (os dados são mantidos)               |
| `npm run db:logs`                      | Acompanha os logs do banco                                      |
| `npm run db:psql`                      | Abre o `psql` dentro do contêiner do banco                      |
| `npm run db:generate -- --name <nome>` | Gera uma migration a partir das mudanças no schema              |
| `npm run db:migrate`                   | Aplica as migrations pendentes                                  |
| `npm run db:create-test`               | Cria o banco `habithos_test` (uma vez só)                       |

## Variáveis de ambiente

| Variável            | Descrição                                                                |
| ------------------- | ------------------------------------------------------------------------ |
| `POSTGRES_USER`     | Usuário do banco, criado na primeira inicialização                       |
| `POSTGRES_PASSWORD` | Senha desse usuário                                                      |
| `POSTGRES_DB`       | Nome do banco                                                            |
| `POSTGRES_PORT`     | Porta do PostgreSQL na sua máquina (padrão `5433`)                       |
| `DATABASE_URL`      | String de conexão usada pela API e pelo Drizzle Kit                      |
| `PORT`              | Porta da API (opcional, padrão `3333`)                                   |
| `NODE_ENV`          | `development`, `test` ou `production` (opcional, padrão `development`)   |
| `JWT_SECRET`        | Segredo usado para assinar os tokens de login (mínimo de 32 caracteres)  |
| `TEST_DATABASE_URL` | String de conexão do banco de testes; o nome precisa terminar em `_test` |

As variáveis são validadas quando a API inicia; se alguma estiver faltando ou for inválida, a API para e lista os
problemas. Se mudar a `PORT`, atualize também o proxy de `/api` em `apps/web/vite.config.ts`.

## Fluxo de banco de dados

1. Altere o schema em `apps/api/src/db/schema/`.
2. Gere uma migration: `npm run db:generate -- --name descreva_a_mudanca`.
3. Revise o SQL gerado em `apps/api/drizzle/`.
4. Aplique: `npm run db:migrate`.

Nunca edite uma migration que já foi aplicada — crie uma nova.

## Testes

Os testes da API usam um banco separado, `habithos_test`, no mesmo contêiner. Crie-o uma vez:

```bash
npm run db:up
npm run db:create-test
```

Depois disso, o `npm test` aplica as migrations no banco de testes automaticamente antes de rodar. O contêiner do
banco precisa estar rodando (`npm run db:up`).
