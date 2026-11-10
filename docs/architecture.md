# ARCHITECTURE — angular-plussaz

## Overview
Angular 22 single-page application (standalone components, signals) built with `@angular/build`, served as static assets by nginx in production container. No server-side application logic or database in this repo.

## Modules / structure
- `src/main.ts`, `app/app.*`, `app/app.routes.ts`, `app/app.config.ts` — bootstrap, root shell, routing, providers.
- `app/core/` — runtime config (`RuntimeConfigService`), `API_BASE_URL` injection token, auth guard, session service/model, notification service, API error/retry helpers.
- `app/auth/` — sign-in component (demo convenience auth).
- `app/posts/` — post/user models & services, list/add/edit components.
- `app/components/` — header, footer, pagination.
- `src/environments/` — build-time defaults; runtime override via `config.json`.

## Data & integrations
- External REST API (default `https://jsonplaceholder.typicode.com`) consumed via Angular HTTP; base URL resolved at runtime. CRUD-like UI operations depend on remote API behavior (JSONPlaceholder is a mock — writes not truly persisted).

## Runtime/deployment
- Docker multi-stage: Node build/test stages (digest-pinned), nginx runtime (digest-pinned) with custom config/entrypoint, non-root `nginx`, healthcheck on `/healthz`, port 8080.
- Compose: `app` service, `test` profile service; env-driven `APP_PORT`, `API_BASE_URL`.

## Boundaries
Clear separation: core (infra/cross-cutting) vs feature (posts/auth) vs presentational components. No DDD/CQRS/EDA — not warranted for a small SPA.
