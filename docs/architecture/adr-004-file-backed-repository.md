---
type: decision
status: active
last_updated: 2026-04-27
tags: [architecture, decision-record]
---

# ADR-004: File-Backed Repository

## Status

Accepted

## Date

2026-03-19

## Context

The MVP backend needs a persistence layer for user accounts, workspace state, and MVP data. The team needed to decide between file-based storage, database-backed storage, or a hybrid approach.

Key forces:

- Development simplicity: the local dev experience should not require running a database server.
- The application already uses SQLite for Electron local storage.
- The Express API (`api/app.ts`) runs separately from Electron during development.
- Prisma with PostgreSQL is available for production deployments.

## Decision

The default persistence layer for the API is a **file-backed repository** using JSON files on disk. This applies to both the auth repository (`FileBackedAuthRepository`) and the MVP repository (`FileBackedMvpRepository`).

When `DATABASE_URL` is configured or `LIFEOS_MVP_REPOSITORY=prisma`, the Prisma-backed repository (`PrismaBackedMvpRepository`) is used instead.

### Auth Repository

- Stores user accounts and invite data in `.data/auth-state.json`.
- File path: `<project_root>/.data/auth-state.json`
- Seeded invites are loaded from `LIFEOS_INVITES` environment variable.

### MVP Repository

- Default: `FileBackedMvpRepository` (JSON file storage)
- Alternative: `PrismaBackedMvpRepository` (PostgreSQL via Prisma)

## Consequences

### Positive

- Zero-config local development: no database server required.
- Transparent data storage: JSON files are human-readable and debuggable.
- Easy backup: copy `.data/` directory to back up all user data.
- Prisma migration path is available when needed.

### Negative

- File-based storage does not support concurrent access from multiple processes.
- No transactional guarantees across files (each file is a separate atomic write).
- Not suitable for production deployments with multiple users.
- Auth state and MVP state are stored in separate files, which can drift out of sync.

### Risks

- If the application scales beyond a single user, the file-backed approach will not scale.
- JSON file corruption could lose all data (mitigated by atomic writes).

## Alternatives Considered

1. **SQLite for API storage:** Would have used the same `better-sqlite3` approach as Electron. Rejected because the Express API runs in a different process and the file-backed approach was simpler for a single-user local dev setup.

2. **Supabase as default:** Would have required Supabase credentials for all development. Rejected because the team wanted zero-config local development.

3. **In-memory with periodic flush:** Would have been faster but loses data on crash. Rejected because durability is a requirement.

## References

- `api/authRepository.ts` — `FileBackedAuthRepository` implementation
- `api/mvpRepository.ts` — `FileBackedMvpRepository` implementation
- `api/prismaMvpRepository.ts` — Prisma-backed alternative
- `api/app.ts` — repository selection logic
