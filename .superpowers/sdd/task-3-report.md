# Task 3 verification report — issue #115

Date: 2026-07-16
Branch: `agent/single-process-container-115`

## Repository verification

| Command | Exit | Result |
| --- | ---: | --- |
| `npm run typecheck` | 0 | TypeScript clean. |
| `npm run lint` | 0 | 0 errors, 9 existing warnings. |
| `LIFEOS_SESSION_SECRET=test-secret-for-local-verification npm run test` (sandbox) | 1 | 3 API tests could not bind `0.0.0.0`: `listen EPERM`; environment limitation. |
| Same test command outside sandbox | 0 | 74 files passed, 3 skipped; 611 tests passed, 62 skipped. |
| `npm run build` | 0 | Web production build completed; 2705 modules transformed. |
| `npm run build:server` | 0 | Server TypeScript build completed. |
| `git diff --check` | 0 | No whitespace errors. |

The lint warnings are pre-existing React fast-refresh/hook warnings plus one unused eslint-disable; no lint errors were reported. The passing test run still emits known test stderr from intentionally exercised error paths and jsdom canvas/scroll limitations.

## Independent review and correction

Read-only review found two blocking fallback defects in `api/app.ts`:

- case and percent-encoded variants of `/api` could receive `index.html`;
- missing static assets could receive `index.html` instead of 404.

The shared fallback now canonicalizes the request path, excludes every `/api` variant, and only applies SPA fallback to extensionless client routes. `api/__tests__/static.test.ts` covers `/API`, `/Api/not-a-route`, `/%61pi/not-a-route`, and three missing assets. Focused regression command `LIFEOS_SESSION_SECRET=test-secret-for-local-verification npx vitest run api/__tests__/static.test.ts` exited 0 (1 file, 1 test).

## Docker smoke and cleanup

Attempted command:

```bash
docker build -t lifeos-runtime-smoke:issue-115 .
```

The escalated command was aborted during the authorization/execution boundary, so no completed image-build result, container ID, health status, or HTTP status evidence is available. Consequently the expected `/api/health` 200, `/` 200, `/mvp/today` 200, and `/api/auth/verify` 401 statuses were **not verified** in this run.

No `docker run` command completed, so this run did not create the named container and there was no Task-3-created container to clean up. The explicit `docker rm -f lifeos-runtime-smoke-115` and empty `docker ps -a` confirmation remain unverified gaps.

## Scope and gaps

Correction scope is limited to Task 1 files: `api/app.ts` and `api/__tests__/static.test.ts`, plus this Task 3 report. No PR, push, merge, or GitHub evidence was created by this task.

Remaining blocker before claiming full Task 3 acceptance: complete the real Docker build/run/healthy wait, capture all four HTTP statuses, remove the container, and prove the filtered container list is empty.
