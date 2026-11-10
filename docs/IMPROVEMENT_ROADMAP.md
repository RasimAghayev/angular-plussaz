# IMPROVEMENT_ROADMAP — angular-plussaz

## Phase applicability (4–11)
| Phase | Applies? | Plan |
|-------|----------|------|
| 4 Git hygiene | Yes | Gitleaks full history, branch/PR cleanup, verify .gitignore/.gitattributes & pre-commit secret scan, Dependabot config present/validated, remove committed `.vscode/` if treated as hygiene/artifact. |
| 5 Container baseline | Yes (improve/verify) | Dockerfile/compose/CI exist; verify `docker build` targets and compose test/app in Docker, add/confirm `Makefile` targets (`build/test/verify/up/down`), capture `docs/BASELINE.md`, image scan, ensure runtime config works. |
| 6 Upgrade to latest | Yes | Order: base images (node/nginx digests, runtime majors as compatible) → Angular/framework libs → dev tools (TS, vitest, jsdom, prettier) → CI actions. One logical group at a time, verify in Docker, update lockfile. TS/jsdom majors may need migrations. |
| 7 Dead code & restructure | Yes (careful) | Use Angular-aware analysis; do not remove depcheck false positives without proof. Remove real dead code/assets/config only with evidence. Align to upgraded conventions. |
| 8 Architecture | Maybe (light) | SPA already modular; apply patterns only for real present problems (ADR if any). KISS/YAGNI. |
| 9 Hardening | Yes (scoped) | Dependency/image scans, secret/env hygiene, runtime config safety, accurate security docs (demo auth). No DB; focus client-side and container/nginx headers as appropriate. |
| 10 CI/CD | Yes (tune) | Validate/pin actions, caching, timeouts/concurrency, keep gates (format/tests/audit/build) within budget. |
| 11 Tests | Yes | Run/extend Vitest suite in Docker, regression vs baseline, document strategy/report and coverage honestly. |

## Risks
- TypeScript 7 / Angular patch alignment / jsdom 31 may introduce breaking test or type changes.
- Static SPA served by nginx — verify routing/health/runtime-config behavior after changes.

## n/a
No database, no backend services to migrate, no K8s manifests in-repo (platform scope separate).

## Standing decisions mapping
SD1 latest stable (verified at runtime), SD2 Docker-first, SD3 deps decisions before adding, SD4 semantic git, SD7 evidence-based dead code, SD8 per-phase checklists. Gate 10: plan submitted for approval.
