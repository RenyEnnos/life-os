# HTTP Boundary and Session Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every canonical Express write bounded and make logout revoke copied web sessions without trusting client-only or proxy-controlled state.

**Architecture:** Put strict request schemas in one server module, resolve signed sessions through one helper, and apply the installed rate limiter at the route groups that own each cost. Persist one integer session version per file-backed user; no session table or refresh-token layer is introduced.

**Tech Stack:** Express 5, Zod, express-rate-limit, jsonwebtoken, bcryptjs, Vitest, Supertest

## Global Constraints

- No new dependency.
- JSON body limit is exactly 32 KiB.
- `trust proxy` remains false.
- Cookie-authenticated unsafe writes require an exact allowed Origin.
- Logout revocation is persisted and invalidates copied bearer tokens.
- Reset/recovery behavior remains owned by #124.

---

### Task 1: Strict request schemas and parser errors

**Files:**
- Create: `api/requestSchemas.ts`
- Create: `api/__tests__/httpBoundary.test.ts`
- Modify: `api/app.ts`

**Interfaces:**
- Produces strict exported schemas for every auth/profile/MVP write and `parseRequest(schema, value)` behavior in routes.
- Produces 400 for invalid/malformed JSON and 413 above 32 KiB.

- [ ] Write failing tests for unknown keys, invalid bounds, impossible dates, malformed JSON, and a 32 KiB overflow.
- [ ] Run `npm test -- api/__tests__/httpBoundary.test.ts` and confirm failures are caused by the unbounded boundary.
- [ ] Implement the schemas and parse them before every repository call.
- [ ] Run the focused test and `npm run typecheck`; require green output.

### Task 2: Persisted session revocation

**Files:**
- Modify: `api/authRepository.ts`
- Modify: `api/app.ts`
- Modify: `api/__tests__/auth.test.ts`
- Modify: `electron/ipc/mvpHandler.ts`

**Interfaces:**
- `StoredUser.sessionVersion: number`
- `FileBackedAuthRepository.revokeSessions(userId): Promise<StoredUser>`
- JWT claim `sv: number`

- [ ] Write a failing API test that copies the issued bearer, logs out, then receives 401 with that bearer.
- [ ] Write a failing repository test showing a legacy user without `sessionVersion` loads as version zero.
- [ ] Run the focused tests and confirm the missing revocation/version failures.
- [ ] Add legacy normalization, emit `sv`, centralize authenticated-user resolution, and increment on logout.
- [ ] Update the synthetic Electron `StoredUser` construction with version zero.
- [ ] Re-run auth/API tests and typecheck.

### Task 3: Cookie CSRF and cost-aware throttling

**Files:**
- Modify: `api/app.ts`
- Modify: `api/__tests__/httpBoundary.test.ts`
- Modify: `api/__tests__/auth.test.ts`
- Modify: `api/__tests__/mvp.test.ts`

**Interfaces:**
- Session resolution returns token source `bearer|cookie`.
- Ordinary write limiter: 120/15 minutes per authenticated user.
- Plan generation limiter: 20/hour per authenticated user.

- [ ] Write failing tests for cookie write without/mismatched Origin, allowed exact Origin, bearer write without Origin, auth throttling, expensive-write throttling, and spoofed `X-Forwarded-For` not bypassing direct-peer limiting.
- [ ] Run the tests and confirm expected security failures.
- [ ] Add the cookie-origin guard and installed rate limiters with user-ID keys after authentication.
- [ ] Add exact allowed Origin headers to existing cookie-agent API fixtures.
- [ ] Re-run focused tests and confirm 401/403/429 behavior.

### Task 4: Documentation and complete verification

**Files:**
- Modify: `README.md`
- Modify: `docs/mvp/route-map.md`
- Modify: `docs/security/2026-07-16-operating-modes-threat-model.md`

- [ ] Document bounds, session revocation, CSRF token-source policy, limiter buckets, direct-peer proxy policy, and the #124 reset dependency.
- [ ] Run focused tests, full `npm test`, `npm run typecheck`, `npm run lint`, local web build, server build, and `git diff --check`.
- [ ] Request an independent security review; fix every material finding and rerun affected checks.
- [ ] Commit with Lore trailers, push a draft PR closing #123, pass canonical GitHub gates, merge, and mark #123 validated.
- [ ] Unblock #124 and continue the #108 parent without closing it.

