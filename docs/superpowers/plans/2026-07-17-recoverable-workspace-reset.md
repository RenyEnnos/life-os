# Recoverable Workspace Reset Implementation Plan

**Goal:** Make canonical workspace reset deliberate, exportable, and recoverable without expanding into account lifecycle or general persistence migration.

**Architecture:** A strict portable envelope crosses the HTTP/repository boundary. Reset is prepared with password + exact phrase, authorized by a short-lived digest-bound token, and committed only if the workspace is unchanged. Each backend retains the recovery in the same mutation that clears data. Restore transactionally replaces the canonical workspace.

**Dependencies:** Existing Zod, bcrypt, jsonwebtoken, express-rate-limit, Prisma, Vitest, Supertest, and Playwright only.

## Task 1: Lock the HTTP contract red

- Add schemas and tests for exact phrases, password bounds, strict envelope/version/invariants, CSRF, bodyless DELETE removal, digest conflict, reset/recovery rate limits, and failed reauthentication.
- Add a response-loss test that retrieves the retained recovery after reset.

## Task 2: Implement the portable contract

- Add envelope types/schema, analytics recomputation, deterministic digesting, and short-lived reset token helpers.
- Add the reset/export, reset commit, latest recovery, and recovery routes.
- Mount a route-specific 1 MiB JSON parser for portable recovery while retaining the ordinary 32 KiB contract everywhere else.

## Task 3: Implement repository atomicity

- Extend `MvpRepository` with export, recoverable reset, latest recovery, and restore.
- File: retain recovery + clear in one store write; restore by strict replace.
- Prisma: add recovery model/migration; retain + delete in one transaction; restore dependencies in one transaction.
- Add backend invariant and injected-failure tests.

## Task 4: Remove stale canonical reset surfaces

- Remove the bodyless reset method from the canonical web API/store and adjust test setup without hiding failures.
- Document Electron reset as unresolved #111 scope, not equivalent recovery.
- Update route map, threat model, and README.

## Task 5: Verify and deliver

- Run focused tests, Prisma integration tests, full suite, typecheck, lint, web/server builds, canonical E2E, and diff check.
- Request independent data-safety/security review and final code review; resolve every material finding.
- Commit with Lore trailers, push a draft PR closing #124, pass canonical gates, merge, validate #124, then close parent #108 only after auditing both children.
