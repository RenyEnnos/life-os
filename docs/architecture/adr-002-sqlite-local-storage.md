---
type: decision
status: active
last_updated: 2026-04-27
tags: [architecture, decision-record]
---

# ADR-002: SQLite Local Storage

## Status

Accepted

## Date

2026-03-19

## Context

LifeOS requires persistent local storage for all user data. The application must work offline by default, with optional cloud sync for users who opt in.

Key forces:

- Privacy-first: user data should remain on the user's device unless they explicitly enable sync.
- Performance: local reads/writes must be fast for a responsive desktop experience.
- Simplicity: the data layer should not require running a separate database server.
- The team already had experience with `better-sqlite3` from earlier development.

## Decision

All user data is stored locally in SQLite via `better-sqlite3` in the Electron main process. The database file is stored in the Electron `userData` directory in production and the project root in development.

WAL (Write-Ahead Logging) mode is enabled for concurrent read/write performance.

## Consequences

### Positive

- Zero-config storage: no database server needed for local development or production use.
- Strong data locality: user data never leaves the device unless sync is explicitly enabled.
- Fast reads and writes with WAL mode for responsive UI.
- Simple backup: users can copy a single file to back up their data.
- Schema migrations are managed inline via `PRAGMA table_info` checks and `ALTER TABLE`.

### Negative

- No built-in multi-device sync. Sync requires Supabase or another external service.
- SQLite file locking limits concurrent write access to a single process.
- Schema migration is manual (column existence checks) rather than using a migration tool.

### Risks

- Database corruption is possible if the main process crashes during a write (mitigated by WAL mode).
- Schema drift could occur if migrations are not carefully tested across versions.

## Alternatives Considered

1. **IndexedDB (browser storage):** Would work in the web runtime but has performance limitations for complex queries and is not accessible from the Electron main process. Rejected because the primary runtime is Electron.

2. **PostgreSQL (local or remote):** Would provide better query capabilities but requires running a database server, which violates the zero-config local-first requirement. Used only when `DATABASE_URL` is configured for Prisma-backed storage.

3. **JSON file storage:** Simpler but lacks query capabilities, transaction support, and concurrent access handling. Rejected in favor of SQLite.

## References

- `electron/db/database.ts` — SQLite initialization and schema
- `electron/db/` — repository implementations
- `api/prismaMvpRepository.ts` — alternative Prisma-backed storage
- `SECURITY.md` — data storage security considerations
