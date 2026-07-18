Status: HISTORICAL
Authority: completed delivery record only
Delivered issue: #115
Delivered PR: #119
Merged: 2026-07-16
Merge SHA: `50dc0eaabf8ba627c70462583c7c4270d6db060b`
Current successor: `docs/release-verification-ladder.md` and `docs/setup-guide.md`
Authorizes implementation: no

# Single-process Web Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the built LifeOS SPA and API from one Express process and prove the same port, fixture, health, routing, and cleanup contract in Docker.

**Architecture:** `createApp` gains an optional static-directory boundary and preserves `/api/*` as API-only. The production entrypoint supplies `dist`; Docker, Compose, and the manual smoke all use port 3001, an explicit synthetic session secret, and file-backed persistence.

**Tech Stack:** TypeScript, Express 4, Supertest, Vitest, Docker, Docker Compose, GitHub Actions

## Global Constraints

- Add no dependency.
- Keep one Express process; do not add Nginx, Redis, or a second static server.
- Never return the SPA shell for an `/api/*` request.
- Keep `LIFEOS_SESSION_SECRET` mandatory and use only synthetic fixture values in tests.
- Do not claim controlled-demo, beta, public, or production readiness.
- Keep the Docker workflow manual until its stability is proved.

---

### Task 1: Lock the SPA and API routing contract

**Files:**
- Create: `api/__tests__/static.test.ts`
- Modify: `api/app.ts`
- Modify: `api/server.ts`

**Interfaces:**
- Consumes: existing `createApp(repository?, authRepository?)` and Express middleware.
- Produces: `CreateAppOptions { staticDir?: string }` as the third `createApp` parameter; production entrypoint passes `path.resolve(process.cwd(), 'dist')`.

- [ ] **Step 1: Write the failing routing test**

Create a temporary directory containing `index.html` with a unique marker. Build the app with `createApp(undefined, undefined, { staticDir })`. Assert with Supertest that `/` and `/mvp/today` return status 200 plus the marker, `/api/health` returns JSON status `ok`, and `/api/not-a-route` returns 404 without the marker. Remove the directory in `afterAll`.

- [ ] **Step 2: Run the test and verify RED**

Run: `LIFEOS_SESSION_SECRET=test-secret npm test -- api/__tests__/static.test.ts`

Expected: TypeScript or assertion failure because `createApp` does not accept or serve `staticDir`.

- [ ] **Step 3: Implement the minimal Express boundary**

In `api/app.ts`, import `node:path`, add:

```ts
export interface CreateAppOptions {
  staticDir?: string;
}
```

Accept `options: CreateAppOptions = {}` as the third parameter. After all concrete API routes and before the error handler, when `options.staticDir` exists, install `express.static(options.staticDir)` and a GET fallback that calls `next()` for `/api` and `/api/*`, otherwise sends `path.join(options.staticDir, 'index.html')`.

In `api/server.ts`, import `node:path` and call:

```ts
const app = createApp(undefined, undefined, {
  staticDir: path.resolve(process.cwd(), 'dist'),
});
```

- [ ] **Step 4: Run the routing test and verify GREEN**

Run: `LIFEOS_SESSION_SECRET=test-secret npm test -- api/__tests__/static.test.ts`

Expected: all routing assertions pass.

- [ ] **Step 5: Run nearby API regression tests**

Run: `LIFEOS_SESSION_SECRET=test-secret npm test -- api/__tests__/static.test.ts api/__tests__/mvp.test.ts api/__tests__/auth.test.ts`

Expected: all tests pass and unknown API paths remain 404.

### Task 2: Align the container topology and acceptance workflow

**Files:**
- Modify: `docker-compose.yml`
- Modify: `.github/workflows/docker-acceptance-smoke.yml`
- Modify: `src/shared/lib/__tests__/releaseGate.test.ts`

**Interfaces:**
- Consumes: image process on port 3001, `/app/.data`, inherited Dockerfile healthcheck, and SPA routing from Task 1.
- Produces: one Compose `app` service and manual `docker-smoke` evidence for the real built image.

- [ ] **Step 1: Add failing release-contract assertions**

Extend `releaseGate.test.ts` to read the Compose and Docker workflow files and assert:

```ts
expect(compose).toContain('"3001:3001"')
expect(compose).toContain('LIFEOS_SESSION_SECRET')
expect(compose).toContain('LIFEOS_MVP_REPOSITORY=file')
expect(compose).not.toMatch(/^\s{2}(redis|nginx):/m)
expect(workflow).toContain('.State.Health.Status')
expect(workflow).not.toContain('--health-cmd')
expect(workflow).toContain('http://127.0.0.1:3001/mvp/today')
expect(workflow).toContain('http://127.0.0.1:3001/api/auth/verify')
```

- [ ] **Step 2: Run the contract test and verify RED**

Run: `npm test -- src/shared/lib/__tests__/releaseGate.test.ts`

Expected: failures for port 3000, missing fixture/health arguments, missing route checks, and retained Redis/Nginx services.

- [ ] **Step 3: Simplify Compose to one service**

Keep only `app`. Publish `3001:3001`, set `PORT=3001`, require `${LIFEOS_SESSION_SECRET:?LIFEOS_SESSION_SECRET is required}`, set `LIFEOS_MVP_REPOSITORY=file`, and mount `life-os-data:/app/.data`. Remove unrelated Supabase, Groq, Redis, Nginx, network, deploy-reservation, and missing-mount declarations. Keep one named volume `life-os-data`.

- [ ] **Step 4: Make the manual smoke exercise the image contract**

Run the container on `3001:3001` with `LIFEOS_SESSION_SECRET=synthetic-docker-smoke-secret` and `LIFEOS_MVP_REPOSITORY=file`. Do not pass `--health-cmd`; wait on `docker inspect --format='{{.State.Health.Status}}'` until healthy or timeout so the smoke proves the Dockerfile's inherited healthcheck.

After health, use `curl --fail` to verify `/api/health`, `/`, and `/mvp/today`. Verify `GET /api/auth/verify` returns HTTP 401. Keep unconditional logs and `docker rm -f` cleanup.

- [ ] **Step 5: Run the contract test and static validation**

Run: `npm test -- src/shared/lib/__tests__/releaseGate.test.ts`

Run: `ruby -e "require 'yaml'; YAML.parse_file('.github/workflows/docker-acceptance-smoke.yml'); YAML.parse_file('docker-compose.yml')"`

Run: `LIFEOS_SESSION_SECRET=synthetic-compose-check docker compose config --quiet`

Expected: test and parsers pass; Compose renders one service with port 3001.

### Task 3: Prove the built artifact and runtime end to end

**Files:**
- Modify only if verification exposes a defect: files owned by Tasks 1-2.

**Interfaces:**
- Consumes: production build, Docker image, single-process route contract.
- Produces: reproducible local evidence suitable for PR review and rollback.

- [ ] **Step 1: Run repository verification**

Run sequentially:

```bash
npm run typecheck
npm run lint
LIFEOS_SESSION_SECRET=test-secret-for-local-verification npm run test
npm run build
npm run build:server
git diff --check
```

Expected: typecheck, tests, builds, and diff check exit 0; lint has 0 errors. Record existing warnings separately.

- [ ] **Step 2: Build and run the real image**

Run:

```bash
docker build -t lifeos-runtime-smoke:issue-115 .
docker run -d --name lifeos-runtime-smoke-115 -p 3001:3001 \
  -e LIFEOS_SESSION_SECRET=synthetic-docker-smoke-secret \
  -e LIFEOS_MVP_REPOSITORY=file \
  lifeos-runtime-smoke:issue-115
```

Wait until `.State.Health.Status` is `healthy`. Curl `/api/health`, `/`, `/mvp/today`, and `/api/auth/verify`; expected statuses are 200, 200, 200, and 401.

- [ ] **Step 3: Prove cleanup and inspect scope**

Run `docker rm -f lifeos-runtime-smoke-115`, then confirm `docker ps -a --filter name=lifeos-runtime-smoke-115 --format '{{.Names}}'` is empty. Run `git status --short` and confirm only planned source, test, container, workflow, spec, and plan files changed.

- [ ] **Step 4: Independent review and commit**

Request a read-only reviewer for issue acceptance, security boundary, and route behavior. Address blocking findings, rerun affected verification, then commit with Lore trailers recording the local-only constraint, rejected multi-process alternatives, exact tests, and gaps.

- [ ] **Step 5: Draft PR and GitHub evidence**

Push the branch and open a draft PR closing #115. Keep it draft until the existing `web / static-and-unit` check is green and the manual Docker smoke is dispatched successfully. Record the image/run/cleanup commands and rollback. Merge only after all review threads and checks are resolved, then rerun or confirm the relevant evidence on `main` before marking #115 validated.
