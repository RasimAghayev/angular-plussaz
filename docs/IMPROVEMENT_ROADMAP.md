# IMPROVEMENT_ROADMAP — angular-plussaz

## Phase applicability (4–11)

| Phase | Applies? | Plan |
|-------|----------|------|
| 4 Git hygiene | Yes | Gitleaks full history; `.vscode/` removal + `.gitignore`; verify `.gitignore`/`.gitattributes`/pre-commit secret scan; add `.github/dependabot.yml` (weekly Mon 06:00 UTC, npm + Docker + Actions, PR limits 10/5, prefixes `build(deps)`/`build(deps-dev)`/`ci(deps)`); branch hygiene — keep `main` and `test`, convert `master` → `main` (Gate 4), review/open PRs, delete merged branches, no open non-bot PRs; Renovate bot branches left for Phase 6. |
| 5 Container baseline | Yes (improve/verify) | Verify `docker build --target test` and `runtime` in Docker; add `Makefile` targets (`build`/`test`/`verify`/`up`/`down`/`lint`/`format`/`security`); capture `docs/BASELINE.md`; image scan; confirm runtime config + healthcheck. |
| 6 Upgrade to latest | Yes | Order per `DEPENDENCY_MAP.md`: base images (node 26 LTS/current, nginx digest) → Angular/build/cli → dev tools (TS 7, jsdom 31, vitest, prettier) → CI actions (checkout v7 SHA-pinned). One logical group at a time, `make verify` in Docker, lockfile committed, migrations + `CHANGELOG.md`, compare to Phase 5 baseline. |
| 7 Dead code & restructure | Yes (careful) | Angular-aware dead-code analysis; remove only proven dead code/assets/config in separate commits; depcheck false positives not removed without proof. |
| 8 Architecture | Maybe (light) | SPA already modular; apply patterns only for real present problems (ADR if any), otherwise KISS/YAGNI. |
| 9 Hardening | Yes (scoped) | Dependency/image scans, secret/env hygiene, runtime-config safety, accurate security docs (demo auth not a boundary); no DB; focus client-side + container hardening. |
| 10 CI/CD | Yes (tune) | SHA-pin actions, caching, timeouts/concurrency, fail-fast, cheap checks first; secret-scan job; keep gates ≤10 min PR budget; Dependabot added in Phase 4. |
| 11 Tests | Yes | Run/extend vitest suite in Docker; regression vs `docs/BASELINE.md`; `docs/TESTING_STRATEGY.md` + `docs/TEST_REPORT.md` with `TC_<MODULE>_<SCENARIO>_<NUMBER>` IDs; honest coverage. |

## Risks

- TypeScript 7 / Angular patch alignment / jsdom 31 may introduce breaking test or type changes — validate in Docker during Phase 6.
- Static SPA served by nginx — verify routing/health/runtime-config behavior after changes.
- `npm audit` 0 vulns claim (Phase 2, lockfile only) to be re-verified in the container.

## n/a

No database, no backend services to migrate, no Kubernetes manifests in-repo (platform scope separate), no `openapi.yaml`/`AsyncAPI` (no API served), no e2e browser tests without a browser image.

## Standing decisions mapping

SD1 latest stable (verified at runtime), SD2 Docker-first, SD3 no new dependency without a decision entry, SD4 semantic git, SD7 evidence-based dead code, SD8 per-phase checklists. Gate 10: plan submitted for approval (pending in `APPROVALS.md`).
