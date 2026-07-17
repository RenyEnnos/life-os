# Fail-Closed Operating Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make unsupported shared configuration fail during web build and server startup while preserving explicit local development.

**Architecture:** A pure shared validator exposes build and server checks. Vite and the Express entry point call the narrow check they own; repository, workflow, Docker, and artifact tests prove the contract.

**Tech Stack:** TypeScript, Vite, Express, Vitest, Docker Compose.

## Global Constraints

- No new dependency.
- Never include secret values in diagnostics.
- Support only `local-dev` and `controlled-demo`.
- Keep partner-beta and public-production unsupported.

---

### Task 1: Shared configuration policy

**Files:**
- Create: `shared/operatingMode.ts`
- Test: `shared/operatingMode.test.ts`

**Interfaces:**
- Produces: `validateBuildOperatingMode(env): OperatingMode` and `validateServerOperatingMode(env): OperatingMode`.

- [ ] Write tests for missing/unknown mode, valid local development, valid controlled demo, and every controlled-demo rejection.
- [ ] Run `npm test -- shared/operatingMode.test.ts` and confirm failure because the module does not exist.
- [ ] Implement the smallest pure validator with variable-name-only errors.
- [ ] Run the targeted test and confirm it passes.

### Task 2: Build and startup enforcement

**Files:**
- Modify: `vite.config.ts`
- Modify: `api/server.ts`
- Modify: `playwright.release.config.ts`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: both validators from Task 1.

- [ ] Extend tests to assert Vite and server use the validator and canonical E2E supplies a mode.
- [ ] Run the tests and confirm the new assertions fail.
- [ ] Load Vite env, validate build configuration, disable source maps and Trae badge in `controlled-demo`, and validate server configuration before listening.
- [ ] Give CI and canonical E2E explicit synthetic operating modes; rerun targeted tests.

### Task 3: Rendered deployment and artifact contract

**Files:**
- Modify: `Dockerfile`
- Modify: `docker-compose.yml`
- Modify: `.github/workflows/docker-acceptance-smoke.yml`
- Modify: `src/shared/lib/__tests__/releaseGate.test.ts`

**Interfaces:**
- Consumes: the controlled-demo environment contract from Task 1.

- [ ] Add failing checks for required rendered config and absence of maps, fallback invite, weak Redis default, privileged secret, and vendor badge.
- [ ] Declare controlled-demo build/runtime inputs in Docker and synthetic smoke inputs in the workflow.
- [ ] Build the web artifact in controlled-demo mode and inspect it with the release-contract test.

### Task 4: Operator documentation and full verification

**Files:**
- Modify: `README.md`
- Modify: `docs/release-verification-ladder.md`
- Modify: `docs/security/2026-07-16-operating-modes-threat-model.md`

**Interfaces:**
- Documents: exact local-dev and controlled-demo commands plus #87 gate limits.

- [ ] Update active docs without claiming partner-beta/public support.
- [ ] Run targeted tests, full tests, typecheck, lint, web/server builds, canonical E2E, rendered Compose validation, and diff checks.
- [ ] Record any environmental limitation separately from repository failures.
