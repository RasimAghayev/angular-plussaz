# TECHNICAL_DEBT — angular-plussaz

| ID | Priority | Area | Item | Notes |
|----|----------|------|------|------|
| TD-1 | P1 | Dependencies | Angular packages/build/cli patch updates (22.2.3→22.2.5/22.2.6) | Low-risk patch bumps (Phase 6). |
| TD-2 | P1 | Dev tooling | TypeScript ~6.0.2 → 7.x (major), jsdom 30→31 (major), vitest 5.0.5→5.1.x, tslib minor | Staged upgrades with migration/verification in Docker. |
| TD-3 | P1 | Base images | node 24.22.0-alpine / nginx 1.31-alpine patch+digest refresh (consider node 26 LTS/current per policy) | Pin by digest at upgrade (Phase 5/6). |
| TD-4 | P1 | CI actions | `actions/checkout` v4.4.0 → v7.0.x (SHA-pinned) | Update in CI pass (Phase 6/10). |
| TD-5 | P2 | Hygiene | `.vscode/` committed (IDE artifacts) | Remove/ignore per hygiene rules (Phase 4/7). |
| TD-6 | P2 | Dead/unused analysis | depcheck reports false positives (bootstrap assets, tslib, toolchain) | Use Angular-aware tooling (knip) before any removal (Phase 7). |
| TD-7 | P2 | Security posture clarity | Sign-in is demo convenience, not auth boundary | Keep docs accurate; no fake hardening (Phase 9). |
| TD-8 | P3 | Docs alignment | Keep docs/decisions aligned after upgrades | Phase 15. |
