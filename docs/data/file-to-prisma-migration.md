# File-to-Prisma migration runbook

This command migrates canonical web identities and MVP workspaces from validated JSON fixtures to Prisma/Postgres. It does not migrate password hashes, session tokens, Electron data, or broader account-lifecycle records. Run it offline, with one operator and no concurrent writers.

## Preconditions

1. Stop web writes and retain the current application version.
2. Set `DATABASE_URL` to an explicitly disposable/tested target first and run `npm run prisma:migrate:deploy`.
3. Keep the source auth and workspace files readable and choose a private ledger/backup directory.

## Dry-run and apply

```bash
DATABASE_URL=postgresql://... npm run migrate:file-to-prisma -- dry-run \
  --auth-file .data/auth-state.json \
  --workspace-file .data/mvp-workspace.json \
  --ledger /private/lifeos-migration-ledger.json

DATABASE_URL=postgresql://... npm run migrate:file-to-prisma -- apply \
  --auth-file .data/auth-state.json \
  --workspace-file .data/mvp-workspace.json \
  --ledger /private/lifeos-migration-ledger.json \
  --backup-dir /private/lifeos-migration-backup
```

The dry-run rejects orphan workspaces, duplicate identities, duplicate represented IDs, and target collisions. The ledger contains stable source/target IDs, semantic digests, and hashes of email/invite values; it never contains password hashes or tokens. Apply makes mode-`0600` byte copies before importing and verifies every normalized workspace digest after import. A failed batch automatically deletes only ledger-recorded identities.

## Rollback and file restore

```bash
DATABASE_URL=postgresql://... npm run migrate:file-to-prisma -- rollback \
  --ledger /private/lifeos-migration-ledger.json
```

Manual rollback refuses to delete an imported user if its normalized identity, active workspace, or retained-recovery fingerprint differs from the ledger, preventing post-migration writes from being discarded. The original JSON files are never modified by migration. If an original file is independently damaged, stop the server, validate the backup, and restore it byte-for-byte with the operating system copy command before explicitly selecting `LIFEOS_MVP_REPOSITORY=file`.

## Disposable drill evidence

On 2026-07-17, PostgreSQL `16-alpine` on localhost received both repository migrations. A one-user fixture with an active reflection and retained recovery completed dry-run and apply; email normalization and all three stable IDs were present, both source/backup SHA-256 pairs matched, and the transaction-level fingerprint passed. A deliberate identity change made rollback fail closed; after restoring the expected fingerprint, ledger rollback returned user, reflection, and recovery row counts to zero. This proves the mechanics against a disposable database, not production capacity, uptime, or cross-process migration safety.
