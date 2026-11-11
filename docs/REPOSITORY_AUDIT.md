# REPOSITORY_AUDIT — angular-plussaz

## Structure

- `src/` Angular app (core, auth, posts, components, environments). `public/` assets. `build/` Docker/nginx assets. `docs/` documentation set. `.github/workflows/ci.yml`. `.vscode/` committed (hygiene issue).
- No `Makefile` (Phase 5 gap). No `openapi.yaml`/`AsyncAPI` (not applicable — no API served).

## Stack & tooling

Angular 22, TypeScript ~6.0.2, RxJS 7, Bootstrap 5, Vitest 5 / jsdom 30, Prettier 3, npm 11.x package-manager metadata. Node 24-alpine build base, nginx 1.31-alpine runtime. npm (`package.json`, `package-lock.json` lockfileVersion 3). Single ecosystem (npm); no Composer/Pip/Go/Cargo/Maven/NuGet.

## Config & env

`.env.example` (placeholders `APP_PORT=8080`, `API_BASE_URL=https://jsonplaceholder.typicode.com`). Runtime config via `config.json` written by the entrypoint; compiled default in `src/environments/*.ts`. `.gitignore` and `.dockerignore` exclude `.env*`; `.env` not present. `.vscode/` tracked (IDE artifact, Phase 4). Env/config names shared across the stack: `API_BASE_URL`, `APP_PORT`.

## API / contracts

The repo is a client of an external JSON API (JSONPlaceholder default). Calls: `GET/POST/PUT/DELETE /posts[/{id}]`, `GET /users/`. Contract defined by the upstream mock, not by this repo. Client-side validation before each call. Read retry (status 0 / ≥500, 2 attempts, 250 ms); no write retry. No auth header; public API. Errors converted to user-facing sentences (`describeApiError`).

## Database

None. Stateless SPA. Posts/users live on the external API; browser holds only the session (`localStorage` key `angular-plussaz.session.v1`) and page state in signals. No schema, migrations, indexes, constraints, transactions, or backup/recovery in this repo.

## Tests

vitest + jsdom, 15 spec files / 57 cases, colocated (`*.spec.ts`), run in the Docker `test` target (`npm run format:check && npm run test:ci`), no network, no database. Covered: services (`PostService`, `UserService`), error helper, runtime config, session, guard, notifications, root component, list/add/edit/sign-in components, header/footer/pagination. No coverage threshold; no e2e/browser tests; nginx config not exercised by tests (validated via `/healthz` in the container).

## CI/CD & Docker

GitHub Actions: single workflow `.github/workflows/ci.yml` (push/PR to `master`/`test`), `permissions: contents: read`, checkout pinned by SHA (`v4.4.0`), compose validate, build test image, run format+unit tests, `npm audit --audit-level=high`, build app image. No caching, no concurrency group, no timeout per step beyond job-level 30 min, no secret-scan job, no publish/deploy. No `.github/dependabot.yml`. Docker: multi-stage, digest-pinned bases, non-root runtime (`nginx`), healthcheck, resource limits in compose, `.dockerignore` excludes secrets and build/test artifacts. `test` target runs `npm run format:check && npm run test:ci`.

## Docs

README + `docs/{architecture,api,business-logic,database,deployment,development-setup,security,testing,README}.md` + `docs/REPOSITORY_AUDIT.md` + `docs/TECHNICAL_DEBT.md` + `docs/IMPROVEMENT_ROADMAP.md` + `docs/decisions/0001..0004` + `docs/diagrams/legacy-class-template.drawio`. Rich and accurate; this phase produces the canonical uppercase `docs/ARCHITECTURE.md`, `docs/REPOSITORY_AUDIT.md`, `docs/TECHNICAL_DEBT.md`, `docs/IMPROVEMENT_ROADMAP.md`.

## Smells / risks

- Dependencies behind latest (Phase 6): Angular packages/build/cli patch-behind, TypeScript 6→7 (major), jsdom 30→31 (major), vitest minor, tslib minor, node/nginx image refresh, `actions/checkout` v4→v7 (major).
- depcheck false positives (bootstrap via `angular.json` assets, tslib via `@angular/core` runtime, `@angular/compiler` via AOT builder, dev deps via npm scripts) — Angular-aware re-check required before any removal (Phase 7).
- Committed `.vscode/` (IDE artifacts).
- Demo auth is not a security boundary — must not be overstated or "hardened" into false security.
- No `Makefile`; no Dependabot config; no secret-scan job in CI.
- `npm audit` reported 0 vulns at Phase 2 time against the lockfile only; re-verify in container.

## Secrets

No committed secrets observed; `.env.example` holds placeholders only; `.env` excluded from git and the image. Full-history secret scan in Phase 4 (gitleaks).
