# ARCHITECTURE — angular-plussaz

## Overview

Angular 22 single-page application (standalone components, signals, zoneless change detection) consumed as static assets by nginx in a production container. No server-side application logic and no database live in this repo. The application is a client of an external JSON API (default: the public mock JSONPlaceholder) and renders what the API answers.

## Goals and constraints

- One image, many environments: the API address is read at runtime from `config.json` (written by the container entrypoint from `API_BASE_URL`) with a compiled default in `src/environments/environment.ts`, so no rebuild is needed to point the image at another API.
- No secrets in the image or repository: the API target is a public mock; the browser session holds a name only.
- Zoneless, standalone, signal-first: the application uses the modern Angular programming model with no NgModules and no zone.js.
- Client-side paging only: ten posts per page, paged in the browser from the full list the API returns.

## Modules / structure

| Area | Files | Responsibility |
|---|---|---|
| Bootstrap | `src/main.ts`, `src/app/app.config.ts`, `src/app/app.routes.ts`, `src/app/app.ts`, `src/app/app.html` | Application bootstrap, providers, routing, root shell with header/footer/notification frame. |
| Core | `src/app/core/` | Runtime config (`RuntimeConfigService`), API base URL token (`API_BASE_URL`), API error sentences (`api-error`), read retry (`api-retry`), auth guard (`auth.guard`), session (`session.service`, `session-user`), notifications (`notification.service`). |
| Feature: posts | `src/app/posts/{post.model,post.service,user.model,user.service,list,add,edit}` | Post/User models and services, list/add/edit pages. |
| Feature: auth | `src/app/auth/sign-in/sign-in.*` | Username-based sign in (demo convenience), session start, return-URL handling. |
| Presentational | `src/app/components/{header,footer,pagination}` | Shared UI components. |
| Build assets | `public/favicon.ico`, `src/styles.css`, `src/index.html` | Static assets and global styles. |
| Container | `build/app/Dockerfile`, `build/nginx/{nginx.conf,default.conf.template,entrypoint.sh}` | Multi-stage image, nginx runtime, runtime config writing. |
| Environments | `src/environments/{environment,environment.development}.ts` | Compiled API base URL defaults. |

## Data flow

1. `bootstrapApplication` boots `App` with `appConfig`.
2. `appConfig` runs `provideAppInitializer(() => inject(RuntimeConfigService).load())`, which fetches `config.json` (relative to `document.baseURI`, cache disabled) before the first page is drawn; a missing or broken file falls back to the compiled `environment.apiBaseUrl`.
3. `PostService` / `UserService` inject `API_BASE_URL` (resolved from the runtime config) and call the external API through `HttpClient` with the fetch backend.
4. Reads are retried twice on network loss (status 0) or server errors (≥500) with a 250 ms pause via `withReadRetry`; 404 is final; writes are never retried.
5. `describeApiError` turns any error shape into one user-facing sentence; the raw API answer never reaches the screen.
6. `NotificationService` holds success/error signals; `App` shows the current message and auto-clears it after five seconds, cancelling the timer when a new message arrives.
7. `authGuard` gates the write pages (`posts-add`, `posts-edit/:id`); unsigned-in visitors are redirected to `/login` with the intended path as `returnUrl` (only same-origin paths accepted).
8. `SessionService` stores the user in `localStorage` under `angular-plussaz.session.v1` and exposes `isSignedIn` / `user` signals.

## Boundaries

- Core (infra/cross-cutting) vs feature (posts/auth) vs presentational components: clear separation, one responsibility per module.
- Application boundary: the external API is the only truth about posts/users; the browser holds no copy of posts, only the session and the current page state.
- Security boundary: the sign in and the guard are interface conveniences, not authentication or authorization. The public API answers every caller; a caller can always call the API directly. Documented as such in `docs/security.md`.
- No DDD/CQRS/EDA: not warranted for this small, single-context SPA; KISS and YAGNI apply.

## Runtime / deployment

- Multi-stage Dockerfile (`build/app/Dockerfile`): `base` → `deps` → `build` → `test` → `runtime`. Base images digest-pinned (`node:24.22.0-alpine`, `nginx:1.31-alpine`).
- Runtime serves static files from `/usr/share/nginx/html` as user `nginx` (non-root), `EXPOSE 8080`, `HEALTHCHECK` on `/healthz` (plain `ok`, does not touch the API), `ENTRYPOINT ["/entrypoint.sh"]`.
- Entrypoint writes `config.json` and renders `default.conf.template` with `envsubst` (`API_BASE_URL`), then `exec nginx -g 'daemon off;'`.
- nginx config: SPA fallback (`try_files $uri $uri/ /index.html`), hash-named assets cached `public, immutable`, `index.html`/`config.json` `no-store`, security headers (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, CSP with `connect-src` limited to `'self'` and the API address).
- Compose: `app` service (restart always, resource limits) and `test` profile service (no env file, network only); env-driven `APP_PORT` / `API_BASE_URL`; single `angular-plussaz` network.
