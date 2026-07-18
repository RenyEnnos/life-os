Status: HISTORICAL
Authority: completed delivery record only
Delivered issue: #109
Delivered PR: #127
Merged: 2026-07-17
Merge SHA: `29ec38891856ad4eb1b15d1fd2add929adbbef4a`
Current successor: `docs/operations/file-to-prisma-migration.md`
Authorizes implementation: no

# Durable persistence and migration design

Issue #109 makes repository selection deliberate, keeps JSON confined to one Node process, and provides an auditable path from file workspaces to Prisma/Postgres. It does not move web password/session authority out of the auth JSON file; full account lifecycle is #110 and Electron data is #111.

## Decisions

- `LIFEOS_MVP_REPOSITORY` is the only repository selector. It must be exactly `file` or `prisma`; `DATABASE_URL` alone never selects Prisma, and Prisma requires a non-empty `DATABASE_URL`.
- File stores share one process-wide mutation queue per resolved path. Writes use a same-directory temporary file, file sync, atomic rename, and best-effort directory sync. Multiple processes remain unsupported; partner beta uses Prisma.
- Missing JSON files mean an empty store. Malformed, truncated, or structurally invalid files fail with a contextual corruption error and are never replaced by an empty state.
- File backup and restore are byte-for-byte operations using the same atomic replacement primitive. Source files remain untouched during Prisma migration.
- The selected durable MVP store is Prisma/Postgres. Web identity remains mapped by the existing stable auth user ID; password hashes and tokens are never copied to the migration ledger or Prisma.

## Migration contract

The migration command reads and validates auth plus MVP JSON, produces a versioned ledger, and records source checksums, source/target user IDs, normalized email, workspace digest, and every represented workspace record ID. It rejects duplicate source user IDs/emails, orphan workspaces, cross-user record-ID collisions, and collisions already present in the target.

`dry-run` performs validation and target collision inspection without writes. `apply` first creates byte-identical backups, then imports identities and strict workspace envelopes. Each workspace restore remains transactional; any batch failure deletes only identities created by that ledger. Post-import semantic digests must match before success. `rollback` deletes only ledger-created target identities after verifying the ledger, leaving the original file stores and backups available.

The existing Prisma reset transaction is unchanged: recovery creation and workspace deletion stay in one serializable transaction.

## Limits and rollback

This design deliberately avoids lockfiles or distributed locking for JSON. If more than one Node process must write the same file, stop using file mode and select Prisma. Rollback is: run the ledger rollback for a failed/abandoned import, verify target absence, restore file backups only if the originals were independently damaged, and explicitly select `file`.
