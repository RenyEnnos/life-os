Status: HISTORICAL
Authority: completed delivery record only
Delivered issue: #109
Delivered PR: #127
Merged: 2026-07-17
Merge SHA: `29ec38891856ad4eb1b15d1fd2add929adbbef4a`
Current successor: `docs/data/file-to-prisma-migration.md`
Authorizes implementation: no

# Durable persistence and migration implementation plan

1. Add red tests for explicit repository resolution: `DATABASE_URL` alone must not activate Prisma; invalid/unset selection and Prisma without URL fail closed.
2. Add one shared atomic JSON helper using only Node APIs: process-wide per-path queue, strict read errors, temp-file sync/rename, backup, and restore.
3. Route auth and MVP file repositories through the helper and strict Zod schemas. Test malformed/truncated bytes, failed rename, and concurrent writes through two repository instances for both stores.
4. Add a file-to-Prisma migration command with `dry-run`, `apply`, and `rollback`; write a versioned redacted ledger, detect identity/record collisions, preserve represented IDs, and compare semantic workspace digests.
5. Exercise backup/restore/rollback on disposable file fixtures and the migration lifecycle against a disposable PostgreSQL 16 container. Confirm the existing Prisma reset remains one serializable transaction.
6. Update README, environment example, architecture/threat-model documentation, and package scripts. Run focused tests, full suite, typecheck, lint, Prisma validation, server/web builds, migration drill, and independent data-safety/code review.
