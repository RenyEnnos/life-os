# Task 1 report — SPA and API routing contract

## Summary

Implemented the issue #115 Task 1 contract in the authorized files:

- added `CreateAppOptions { staticDir?: string }` as the third `createApp` parameter;
- served static assets and the SPA `index.html` fallback only outside `/api`;
- configured the production entrypoint to serve `path.resolve(process.cwd(), 'dist')`;
- added a Supertest regression covering `/`, a client route, health, and an unknown API route.

No dependencies, migrations, unrelated refactors, or other product behavior were added.

## TDD evidence

### RED

Command:

```text
LIFEOS_SESSION_SECRET=test-secret npm test -- api/__tests__/static.test.ts
```

The first sandboxed attempt failed with `listen EPERM` and was not accepted as RED. Re-running with permission to bind a local ephemeral port produced the intended behavioral failure:

```text
api/__tests__/static.test.ts (1 test | 1 failed)
expected 404 to be 200
api/__tests__/static.test.ts:29:25
```

This proved the test detected the missing SPA boundary before production code changed.

### GREEN

Command:

```text
LIFEOS_SESSION_SECRET=test-secret npm test -- api/__tests__/static.test.ts
```

Result: exit 0; 1 test file passed, 1 test passed.

### Nearby API regressions

Command:

```text
LIFEOS_SESSION_SECRET=test-secret npm test -- api/__tests__/static.test.ts api/__tests__/mvp.test.ts api/__tests__/auth.test.ts
```

Result: exit 0; 3 test files passed, 3 tests passed. The static test specifically verifies `/api/not-a-route` remains 404 and does not contain the SPA marker.

## Repository validation

- `npm run typecheck`: exit 0.
- `npm run lint`: exit 0 with 9 pre-existing warnings outside the Task 1 files and zero errors.
- `npm run build`: started and completed its prebuild typecheck/lint stages; the final Vite phase reached `transforming...`, but the supervising turn was interrupted before a terminal result was captured. It is therefore not claimed as passed.
- `git diff --check`: exit 0.

## Acceptance criteria

- `CreateAppOptions` exported and accepted as the third parameter: implemented and typechecked.
- `/` and `/mvp/today` return the temporary `index.html`: verified.
- `/api/health` retains JSON `{ data: { status: 'ok' } }`: verified.
- `/api/not-a-route` remains 404 without the marker: verified.
- production entrypoint resolves `dist` from `process.cwd()`: implemented and typechecked.

## Self-review

- Diff is limited to the three Task 1 implementation/test files plus this required report.
- Static middleware is installed after all concrete API routes and before the error handler.
- The fallback explicitly delegates `/api` and `/api/*` to Express, preventing SPA masking.
- Existing two-argument `createApp` callers remain source-compatible through the default options value.
- No secret value is stored; `test-secret` is a non-production test-only environment value.

## Risks, limitations, and intentionally unperformed work

- Full build completion is unverified because execution was interrupted during Vite transformation; no build failure was observed.
- Lint warnings are outside the authorized Task 1 files and were intentionally not changed.
- No broader test suite, runtime deployment, container build, or manual browser check was performed.
- The implementation uses the existing Express and Node APIs; no new abstraction or dependency was introduced.
