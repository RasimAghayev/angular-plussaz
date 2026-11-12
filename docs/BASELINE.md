# Baseline — Angular PlussAz container engine work (Phase 5)

This file is the behaviour contract of the repository as it enters Phase 6.
Every later change must keep this contract green (regression against it).

Recorded by running the stack entirely inside Docker — nothing was executed on
the host except Docker itself.

## How the baseline was produced

| Step | Command | Result |
|------|---------|--------|
| compose validation | `docker compose --env-file var/.env config --quiet` | exit 0 |
| test stage (runs format + unit tests) | `docker build -f build/app/Dockerfile --target test .` | exit 0 |
| runtime stage | `docker build -f build/app/Dockerfile --target runtime .` | exit 0 |
| whole gate | `make verify` | exit 0 |
| start the stack | `make up` (depends on `verify`) | exit 0 |
| stop the stack | `make down` | exit 0 |
| lint (prettier + tsc) | `make lint` | exit 0 |
| security (npm audit) | `make security` | exit 0 |
| format (prettier --write) | `make format` | exit 0, no file changed |

`var/.env` was created from `.env.example` (placeholders only) before every
compose command. No secret was ever logged, printed, or baked into an image.

## Stack

| Item | Value |
|------|-------|
| Repository | `angular-plussaz` |
| Compose project name | `angular-plussaz` (`name:` in `docker-compose.yml`) |
| Reserved port block (`projects/info/state/ports.md`) | `20160-20169` |
| Default host port (`APP_PORT`) | `20160` (container port `8080`) |
| Default API (`API_BASE_URL`) | `https://jsonplaceholder.typicode.com` |
| Runtime image | `angular-plussaz-app:latest`, 104 MB, multi-arch digest-pinned base |
| Test image | `angular-plussaz-test:latest` |
| Docker / BuildKit | Docker 29.9.3, buildx v0.38.1 |

## Dockerfile stages (`build/app/Dockerfile`)

`base` (pinned `node:24.22.0-alpine@sha256:44fce696...`) → `deps`
(`npm ci` with a BuildKit npm cache mount) → `build` (`npm run build`) →
`test` (runs `npm run format:check && npm run test:ci`; **the build fails if
they fail**) → `runtime` (nginx `1.31-alpine`, non-root `nginx` user,
exec-form `ENTRYPOINT ["/entrypoint.sh"]`, `HEALTHCHECK` on `/healthz`).

## Tests (the behaviour contract)

Runner: vitest via `@angular/build:unit-test`, executed inside the `test`
stage, no browser, no network, no database (the API calls are held by
`HttpClient` testing backend).

| Metric | Value |
|--------|-------|
| Test files | 15 passed (15) |
| Test cases | 57 passed (57) |
| Duration | 6.65 s |
| Prettier check | passed (`All matched files use Prettier code style!`) |
| Type check (`tsc --noEmit`) | passed (silent on success) |
| Coverage | **not configured** — `ng test --watch=false` runs without `--coverage`; no coverage report is produced. Flagged as an out-of-scope finding (Phase 11's job) rather than silently introduced here. |

### Test-case snapshot

| File | Cases |
|------|-------|
| `src/app/core/session.service.spec.ts` | 6 |
| `src/app/core/runtime-config.service.spec.ts` | 4 |
| `src/app/posts/user.service.spec.ts` | 2 |
| `src/app/core/api-error.spec.ts` | 5 |
| `src/app/core/notification.service.spec.ts` | 4 |
| `src/app/components/pagination/pagination.component.spec.ts` | 4 |
| `src/app/components/footer/footer.component.spec.ts` | 1 |
| `src/app/core/auth.guard.spec.ts` | 2 |
| `src/app/app.spec.ts` | 3 |
| `src/app/posts/list/list.component.spec.ts` | 3 |
| `src/app/components/header/header.component.spec.ts` | 3 |
| `src/app/posts/add/add.component.spec.ts` | 3 |
| `src/app/auth/sign-in/sign-in.component.spec.ts` | 4 |
| `src/app/posts/edit/edit.component.spec.ts` | 3 |
| `src/app/posts/post.service.spec.ts` | 10 |

Key behaviours held by the suite (from `docs/testing.md`):
- posts service repeats a read on a server error, never repeats a write
- user service lists the users
- every API-error shape has a sentence
- runtime config reads `config.json`, falls back to the compiled address, handles the broken file
- session sign in / sign out / broken storage entry
- the guard closes write pages to unsigned-in visitors
- success and failure messages never stand next to each other
- list / create / edit / sign-in pages

## Build snapshot

`npm run build` (production configuration) inside the `build` stage:

| Item | Value |
|------|-------|
| Result | `Compiled successfully` |
| Output location | `/app/dist/angular-plussaz` (browser dir served by nginx) |
| Initial total | 619.04 kB raw / 125.04 kB transfer |
| `main-AMLBRLM7.js` | 307.53 kB raw / 80.55 kB transfer |
| `styles-Z3ITUIS5.css` | 231.06 kB raw / 22.88 kB transfer |
| `scripts-TTWY4XDY.js` | 80.45 kB raw / 21.60 kB transfer |

## Runtime snapshot (container started with `make up`)

| Check | Command | Result |
|-------|---------|--------|
| Health endpoint | `GET http://127.0.0.1:20160/healthz` | HTTP 200, body `ok` |
| Application root | `GET http://127.0.0.1:20160/` | HTTP 200, Angular SPA (`app-root`, hashed assets) |
| Container state | `docker ps` | `Up (healthy)`, `0.0.0.0:20160->8080/tcp` |
| Runtime user | `docker inspect` | `User=nginx` (non-root) |
| Entrypoint | `docker inspect` | `ENTRYPOINT ["/entrypoint.sh"]` (exec form) |
| Healthcheck | `docker inspect` | `wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1` |
| Image size | `docker inspect --format='{{.Size}}'` | 104 MB (103,866,310 bytes) |

The `/healthz` answer is a plain `ok`; it does not touch the API, so a
container is healthy when its web server answers.

## Security snapshot

| Check | Command | Result |
|-------|---------|--------|
| Dependency audit | `npm audit --audit-level=high` (inside the test-stage image) | `found 0 vulnerabilities` |
| Secrets | `.dockerignore` excludes `.env*`, `*.key`, `*.pem`, `*.crt`, `secrets/`; no secret in `ARG`/`ENV`/`COPY` layers | clean |

## Notes / assumptions

- `.env.example` holds placeholders only (`APP_PORT=20160`,
  `API_BASE_URL=https://jsonplaceholder.typicode.com`); real values live in
  `var/.env`, which is never committed and never baked into an image.
- This is a frontend with no database, so `make migrate` and `make seed` are
  explicit no-ops (exit 0). Nothing in this phase invents a database.
- `make up` depends on `make verify`, so the stack only starts after the test
  stage passes — matching the Docker standard ("build fails if tests fail").
- Coverage is not configured; do not report a coverage percentage that was not
  measured. Phase 11 owns adding coverage and new tests.
