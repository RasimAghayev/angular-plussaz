# REPOSITORY_AUDIT — angular-plussaz

## Structure
- `src/` Angular app (core, auth, posts, components, environments). `public/` assets/config. `build/` Docker/nginx assets. `docs/` rich existing documentation. `.github/workflows/ci.yml`. `.vscode/` committed.

## Stack & tooling
Angular 22, TypeScript 6.x, RxJS 7, Bootstrap 5, Vitest 5/jsdom 30, Prettier 3, npm 11.x package manager metadata. Node 24-alpine build base, nginx 1.31-alpine runtime.

## Config & env
`.env.example` (APP_PORT, API_BASE_URL placeholders). Runtime config via `config.json`. `.gitignore`/`.dockerignore` present; `.vscode/` tracked (hygiene issue).

## API/contracts
Consumes external JSON API (`/posts`, `/users` patterns implied by services/routes) — contract defined by upstream (JSONPlaceholder default), not by this repo.

## Database
None (stateless SPA).

## Tests
Vitest unit/specs across app/core/posts/components/auth (`*.spec.ts`). CI runs format check + `test:ci` in Docker test target. Coverage/baseline to be captured in Phase 5.

## CI/CD & Docker
GitHub Actions: checkout pinned SHA, compose validate, build test, run tests, `npm audit --audit-level=high`, build app. Docker: multi-stage, digest-pinned bases, non-root runtime, healthcheck, resource hints in compose.

## Docs
README and multiple docs (`architecture`, `api`, `business-logic`, `deployment`, `security`, `testing`, `development-setup`, decisions) exist.

## Smells / risks
- Dependency majors/minors behind (TS 7, jsdom 31, vitest minor, Angular patch/build patch, actions v7).
- depcheck false positives — removals need Angular-aware verification.
- Committed `.vscode/` (IDE artifacts).
- Demo auth is not real security — must not be overstated.

## Secrets
No committed secrets observed in sampled configs; `.env` excluded. Full-history scan in Phase 4.
