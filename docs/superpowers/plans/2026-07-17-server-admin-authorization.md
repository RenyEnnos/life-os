# Server Admin Authorization Implementation Plan

> Issue #107. Execute with TDD and keep the server contract authoritative.

**Goal:** Make the current internal MVP analytics surface depend on explicit server authorization while removing its destructive admin exposure.

**Architecture:** A small allowlist parser and Express authorization middleware reuse `req.authUser`. A single read-only endpoint projects the current workspace to analytics/events/feedback. The UI fetches that projection and never treats its route guard as authority.

**Dependencies:** Existing Express auth middleware, MVP repository, React query/store primitives, Vitest, Supertest. No new package.

## Task 1: Lock the server boundary

**Files:**
- Modify: `api/__tests__/mvp.test.ts`
- Modify: `api/app.ts`

1. Add failing API tests for 401, 403, allowlisted 200, minimized response, and 404/405 for an admin reset route.
2. Run the focused test and confirm the expected failures.
3. Add the smallest normalized allowlist check and read-only endpoint.
4. Run the focused API tests to green.

## Task 2: Make the UI consume server authority

**Files:**
- Modify: `src/features/mvp/api/mvp.api.ts`
- Modify: `src/features/mvp/pages/MvpSurfacePage.tsx`
- Modify or add: relevant MVP UI tests

1. Add a failing presentation test proving protected overview loading and no reset control.
2. Add the typed API projection and load it only for `surface="admin"`.
3. Render loading, denial, and overview states without reading privileged data directly from the general workspace store.
4. Run focused UI tests to green.

## Task 3: Align configuration and documentation

**Files:**
- Modify: `.github/workflows/ci.yml` or test fixtures only if required
- Modify: `README.md`
- Modify: `docs/mvp/route-map.md`
- Modify: `docs/mvp/canonical-mvp.md`
- Modify: `docs/security/2026-07-16-operating-modes-threat-model.md`

1. Document `LIFEOS_ADMIN_EMAILS` as an exact server allowlist and state that UI gates are secondary.
2. Record that the endpoint is read-only/current-admin scoped and no admin reset exists.
3. Keep partner beta unsupported until the remaining #108-#111 gates pass.

## Task 4: Verify and integrate

1. Run focused API/UI tests, full test suite, typecheck, lint, web/server builds, and canonical E2E.
2. Run an independent security/code review and address material findings.
3. Commit with Lore trailers, open a draft PR, inspect exact-head checks/comments, then mark ready and merge only when relevant gates are green.
