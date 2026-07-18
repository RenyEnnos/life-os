Status: HISTORICAL
Authority: completed delivery record only
Delivered issue: #124
Delivered PR: #126
Merged: 2026-07-17
Merge SHA: `39d6066f0732ff0f1a008eeb72ff0e60ba8b9307`
Current successor: `docs/contracts/personal-data-lifecycle.md`
Authorizes implementation: no

# Recoverable Workspace Reset Design

## Scope

Issue #124 replaces the canonical web `DELETE /api/mvp/workspace` with a two-step, password-reauthenticated reset. It does not implement full-account export/deletion (#110), general file atomicity or backup policy (#109), or Electron migration/recovery (#111).

The lazier option is to remove reset entirely. It is rejected because the parent acceptance explicitly requires a usable, tested recovery path.

## Portable envelope

The shared envelope is strict and versioned:

```ts
{
  format: 'lifeos.mvp.workspace',
  version: 1,
  exportedAt: string,
  workspace: MvpWorkspaceSnapshot
}
```

It contains no user ID, credential, invite, token, or password hash. The authenticated user supplies ownership. Strings, collections, IDs, ratings, dates, event types, and nested objects retain the canonical HTTP bounds; analytics is recomputed instead of trusted. Version or invariant mismatches fail before repository mutation. This envelope represents the canonical visible workspace, not archived relational history.

## HTTP flow

The exact reset phrase is `RESET MY WORKSPACE`; the exact restore phrase is `RESTORE MY WORKSPACE`. Matching is case-sensitive and whitespace-sensitive.

1. `POST /api/mvp/workspace/reset/export` accepts password plus reset phrase, reauthenticates with bcrypt, and returns the envelope plus a short-lived signed reset token bound to the user and envelope digest.
2. `POST /api/mvp/workspace/reset` accepts password, reset phrase, reset token, and the prepared export. It reauthenticates, verifies that the token digest matches that envelope, and asks the repository to compare the prepared digest with the current workspace before resetting.
3. In the same repository mutation/transaction, reset persists a retained recovery record and replaces the workspace with an empty snapshot. The response returns the empty workspace, recovery ID, and retained export.
4. `GET /api/mvp/workspace/recovery/latest` returns the latest retained envelope after authentication.
5. `POST /api/mvp/workspace/recovery` accepts password, restore phrase, and a portable envelope. It replaces the current workspace transactionally.

Cookie requests inherit the exact-Origin policy from #123. Bearer requests remain explicit authority. Reset preparation/commit share a strict per-user limiter; recovery has a separate limiter. Reset commit and recovery receive a bounded 10 MiB parser only after authentication, CSRF, and rate limiting because a complete history can exceed ordinary write size; the envelope itself is capped at 8 MiB and every nested value remains strictly validated. The general 32 KiB parser remains unchanged.

## Repository guarantees

`MvpRepository` gains export, recoverable reset, latest recovery, and restore operations.

- File-backed: the store document contains both workspaces and retained recoveries. Backup creation and clearing occur in one in-memory update followed by one store write. Broader temp-file/fsync/rename and multiprocess safety remain #109.
- Prisma-backed: a versioned JSON recovery row is created in the same database transaction as all workspace deletes. Restore deletes current workspace rows and recreates the canonical snapshot in one transaction, preserving represented IDs/timestamps and relational dependencies.
- Restore replaces rather than merges. Analytics is recomputed. A reset digest mismatch returns conflict and performs no mutation.

A failed reset cannot destroy the only recoverable copy: the client already received the prepared envelope, and the repository creates its retained copy in the same mutation as deletion. If deletion rolls back, so does recovery creation and the original workspace remains.

## Electron boundary

The canonical web client/store loses its bodyless reset call. Electron's separate IPC/preload reset remains non-canonical and is explicitly owned by #111; it is not evidence that the web recovery contract covers desktop data.

## Verification

Tests must prove strict envelope validation, password and exact-phrase rejection, CSRF inheritance, separate destructive limits, no bodyless web reset, response-loss recovery through the retained copy, digest conflict, failure rollback, and export-reset-restore semantic equality for file and Prisma implementations. Full suite, typecheck, lint, web/server builds, canonical E2E, independent data-safety review, and final code review remain merge gates.
