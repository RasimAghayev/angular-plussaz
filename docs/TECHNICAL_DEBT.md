# TECHNICAL_DEBT — angular-plussaz

| ID | Priority | Area | Item | Notes |
|----|----------|------|------|-------|
| TD-1 | P1 | Dependencies | Angular packages patch-behind (`@angular/*` 22.2.3 → 22.2.5) | Low-risk patch bumps (Phase 6). |
| TD-2 | P1 | Dev tooling / build | `@angular/build` / `@angular/cli` 22.2.3 → 22.2.6; `@angular/compiler-cli` 22.2.3 → 22.2.5 | Patch bumps (Phase 6). |
| TD-3 | P1 | Dev tooling | TypeScript ~6.0.2 → 7.x (major) | Staged upgrade with migration/verification in Docker; may require type/migration changes (Phase 6). |
| TD-4 | P1 | Tests | jsdom 30 → 31 (major); vitest 5.0.5 → 5.1.x | Verify test behavior after jsdom major (Phase 6). |
| TD-5 | P1 | Dev tooling | tslib 2.8.1 → 2.9.1 (minor) | Patch/minor bump (Phase 6). |
| TD-6 | P1 | Base images | node `24.22.0-alpine` → `24.22.2-alpine` (patch); consider node 26 LTS/current; nginx `1.31` → `1.31.8-alpine` | Pin by digest at upgrade (Phases 5/6). |
| TD-7 | P1 | CI actions | `actions/checkout` v4.4.0 → v7 (major), SHA-pinned | Update in CI pass (Phases 6/10). |
| TD-8 | P2 | Hygiene | `.vscode/` committed (`extensions.json`, `launch.json`, `tasks.json`) | Remove/ignore per CLAUDE.md decision 13 (Phase 4). |
| TD-9 | P2 | Dead/unused analysis | depcheck flags `@angular/compiler`, `bootstrap`, `tslib` and all dev deps as unused — Angular false positives | Re-check with Angular-aware tooling (knip) before any removal (Phase 7). |
| TD-10 | P2 | Build/tooling | No `Makefile` (`make build/test/verify/up/down`) | Add in Phase 5 container baseline. |
| TD-11 | P2 | Dependabot | No `.github/dependabot.yml` | Add weekly (Mon 06:00 UTC) npm + Docker + Actions config (Phases 4/6). |
| TD-12 | P2 | CI | No secret-scan job; actions pinned by tag not SHA beyond checkout; no caching/concurrency | Add secret scan, SHA-pin actions, caching, concurrency, timeouts (Phase 10). |
| TD-13 | P2 | Security posture clarity | Sign-in is demo convenience, not an auth boundary | Keep docs accurate; no fake hardening (Phase 9). |
| TD-14 | P3 | Observability | No `/health/live` + `/health/ready` split; `/health/ready` does not touch the API by design | Evaluate adding readiness against the API (Phase 9). |
| TD-15 | P3 | Testing | No coverage threshold; no e2e/browser tests; nginx config not exercised by tests | Add coverage reporting; e2e needs a browser image (out of scope for Phase 11 without one) (Phase 11). |
| TD-16 | P3 | Docs alignment | Keep docs/decisions aligned after upgrades | Phase 15. |

No P0 items confirmed. Dead-code removals are evidence-based only (standing decision 7). Breaking changes to this repo's own public contract would require Gate 5.
