<div align="center">

# W-W Backend (NestJS)

Lightweight, modular, and production-oriented backend service for the W-W platform built with **NestJS**, **Prisma**, and **pnpm**. Designed for clarity, scalability, and feature-flag driven evolution.

</div>

## Table of Contents

1. Overview
2. Features
3. Tech Stack
4. Project Structure
5. Getting Started
6. Environment Variables
7. Running & Scripts
8. Database & Migrations
9. Optional Redis Integration
10. API Documentation (Swagger)
11. Testing
12. Security
13. Contributing
14. License

## 1. Overview

This repository houses the backend services for W-W. It provides authentication, membership, wallet foundation, and extensible domain modules. Redis is currently disabled but the code remains in place for future activation.

## 2. Features

- JWT-based auth (access & refresh tokens)
- Rate limiting (Nest Throttler)
- Modular architecture (Auth, Users, Membership, Wallet, Redis placeholder)
- Prisma ORM (PostgreSQL)
- Centralized response filters & exception handling
- Optional Redis caching/pubsub (fully disabled by default)
- Structured logging (Winston)
- Swagger auto-generated docs

## 3. Tech Stack

- **Runtime:** Node.js (NestJS + Fastify adapter)
- **ORM:** Prisma
- **DB:** PostgreSQL
- **Cache / PubSub (optional):** Redis (ioredis + Keyv) – currently disabled
- **Auth:** Passport JWT strategies
- **Testing:** Jest (unit & e2e)
- **Logging:** Winston
- **Package Manager:** pnpm

## 4. Project Structure

```
src/
    modules/
        auth/
        common/
        feature-flags/
        membership/
        users/
        wallet/
        redis/   (disabled; keep for future use)
    lib/
    config/
    filters/
    middleware/
    main.ts
```

Core principles:

- Separation by domain (feature-focused modules)
- Providers & services isolated from controllers
- Shared infrastructure (Prisma, hashing, throttling) lives in `common` module
- Optional integrations (Redis) are isolated and can be toggled without touching active modules

## 5. Getting Started

Prerequisites:

- Node.js >= 18
- pnpm (`npm i -g pnpm`)
- PostgreSQL instance (local or managed)

Setup:

```bash
pnpm install
cp .env-sample .env   # create & edit values
pnpm prisma migrate deploy
pnpm run start:dev
```

If using Docker for DB:

```bash
docker-compose up -d
```

## 6. Environment Variables

Essential variables (see `src/env.ts` for full list):

| Key                                   | Description                          |
| ------------------------------------- | ------------------------------------ |
| `NODE_ENV`                            | `development` or `production`        |
| `API_PORT`                            | Port the HTTP server listens on      |
| `API_URL`                             | Base URL (without version path)      |
| `DATABASE_URL`                        | PostgreSQL connection string         |
| `JWT_SECRET`                          | Access token secret                  |
| `JWT_EXPIRATION_TIME`                 | Access token lifetime (seconds)      |
| `JWT_REFRESH_SECRET`                  | Refresh token secret                 |
| `JWT_REFRESH_EXPIRATION_TIME`         | Refresh token lifetime (seconds)     |
| `HASH_SALT_ROUNDS`                    | bcrypt salt rounds                   |
| `RATE_LIMIT_DEFAULT_TTL_MS`           | Throttler window TTL in ms           |
| `RATE_LIMIT_DEFAULT_LIMIT`            | Requests allowed per window          |
| `REDIS_REST_URL` / `REDIS_REST_TOKEN` | Reserved for future Redis REST usage |

Add others (Firebase, Sentry, etc.) as needed based on integration.

## 7. Running & Scripts

```bash
# Development (watch)
pnpm run start:dev

# Production build & run
pnpm run build
pnpm run start:prod

# Format & lint
pnpm run lint
pnpm run format   # if configured
```

## 8. Database & Migrations (Prisma)

Generate client after schema changes:

```bash
pnpm prisma generate
```

Create a new migration:

```bash
pnpm prisma migrate dev --name <migration_name>
```

Apply migrations in deployment:

```bash
pnpm prisma migrate deploy
```

View data (GUI):

```bash
pnpm prisma studio
```

## 9. Optional Redis Integration

Redis code is kept but currently disabled:

- `RedisModule` import commented in `common.module.ts`
- Cache falls back to in-memory

Enable later by: uncommenting imports & providers and adding proper Redis env vars.

## 10. API Documentation (Swagger)

Auto-generated at runtime. Default path:

```
/docs
```

Bearer auth schemes for access & refresh tokens are preconfigured.

## 11. Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

Test files live beside services (`*.spec.ts`).

## 12. Security

See `SECURITY.md` for responsible disclosure and out-of-scope items.

## 13. Contributing

1. Fork & branch (`feat/<short-name>`)
2. Keep changes focused & small
3. Run lint & tests before pushing
4. Open PR with clear description & context

## 14. License

This project is released under the [MIT License](LICENSE).

---

Made with care for the W-W platform. Future enhancements: enable Redis, add GraphQL gateway, expand wallet domain.
