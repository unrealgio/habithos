# Habithos

🇧🇷 [Leia em português](README.pt-BR.md)

A gamified habit tracker — a "real-life RPG". Users create habits, routines, missions and personal rewards;
completing them earns XP, levels, coins, attributes and streaks, and evolves a personal character.

> 🚧 Work in progress. This is also a learning project focused on TypeScript and full-stack architecture.

## Tech stack

| Layer    | Technologies                                              |
| -------- | --------------------------------------------------------- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS                  |
| Backend  | Node.js, Express 5, TypeScript                            |
| Database | PostgreSQL 18 (Docker), Drizzle ORM, node-postgres (`pg`) |
| Shared   | Game rules as pure, tested TypeScript functions           |
| Tooling  | npm workspaces, Vitest, ESLint, Prettier                  |

## Project structure

```
apps/
  api/        Express API (database schema and migrations live here)
  web/        React app
packages/
  shared/     Code used by both apps (game rules, types)
docker-compose.yml   PostgreSQL service for local development
```

## Prerequisites

- Node.js 24+ and npm 11+
- Docker Desktop (running)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file from the example:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`: set a password in `POSTGRES_PASSWORD`, `DATABASE_URL` and `TEST_DATABASE_URL`,
   and replace `JWT_SECRET` with a random value, for example the output of:
   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```
3. Start the database and apply the migrations:
   ```bash
   npm run db:up
   npm run db:migrate
   ```
4. Start the API and the web app:
   ```bash
   npm run dev
   ```
   - Web: http://localhost:5173
   - API health check: http://localhost:5173/api/health

## Scripts

| Script                                 | Description                                              |
| -------------------------------------- | -------------------------------------------------------- |
| `npm run dev`                          | Starts the API and the web app together                  |
| `npm test`                             | Runs the test suite once (`test:watch` to keep watching) |
| `npm run typecheck`                    | Type-checks every workspace                              |
| `npm run lint`                         | Lints the whole repository                               |
| `npm run format`                       | Formats the code with Prettier                           |
| `npm run db:up`                        | Starts PostgreSQL in Docker and waits until it is ready  |
| `npm run db:down`                      | Stops and removes the container (data is kept)           |
| `npm run db:logs`                      | Follows the database logs                                |
| `npm run db:psql`                      | Opens `psql` inside the database container               |
| `npm run db:generate -- --name <name>` | Generates a migration from schema changes                |
| `npm run db:migrate`                   | Applies pending migrations                               |
| `npm run db:create-test`               | Creates the `habithos_test` database (once)              |

## Environment variables

| Variable            | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `POSTGRES_USER`     | Database user created on first start                                    |
| `POSTGRES_PASSWORD` | Password for that user                                                  |
| `POSTGRES_DB`       | Database name                                                           |
| `POSTGRES_PORT`     | Host port for PostgreSQL (default `5433`)                               |
| `DATABASE_URL`      | Connection string used by the API and by Drizzle Kit                    |
| `PORT`              | API port (optional, default `3333`)                                     |
| `NODE_ENV`          | `development`, `test` or `production` (optional, default `development`) |
| `JWT_SECRET`        | Secret used to sign login tokens (at least 32 characters)               |
| `TEST_DATABASE_URL` | Connection string of the test database; its name must end with `_test`  |

The variables are validated when the API starts; if one is missing or invalid, the API stops and lists the problems.
If you change `PORT`, also update the `/api` proxy in `apps/web/vite.config.ts`.

## Database workflow

1. Change the schema in `apps/api/src/db/schema/`.
2. Generate a migration: `npm run db:generate -- --name describe_the_change`.
3. Review the generated SQL in `apps/api/drizzle/`.
4. Apply it: `npm run db:migrate`.

Never edit a migration that was already applied — create a new one instead.

## Tests

API tests run against a separate database, `habithos_test`, in the same container. Create it once:

```bash
npm run db:up
npm run db:create-test
```

After that, `npm test` applies the migrations to the test database automatically before running. The database
container must be running (`npm run db:up`).
