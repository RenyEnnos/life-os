# Personal data lifecycle

This is the enforceable lifecycle for the canonical web MVP. Electron-only legacy modules remain outside this contract until #111.

## Inventory and retention

| Data | Purpose | Store | Retention | Export | Deletion |
| --- | --- | --- | --- | --- | --- |
| Email, name, theme, onboarding flag, timestamps | authentication and profile | private auth JSON; identity is duplicated in Prisma when that MVP repository is selected | account lifetime | account metadata | user and claimed invite are removed |
| Password hash, session version | authentication and session revocation | private auth JSON | account lifetime | never exported | removed; issued sessions stop resolving |
| Invite email/code and claim timestamps | invitation access control | private auth JSON | until claim/account deletion or operator withdrawal | never exported because the code is a credential | claimed invite is removed with the account |
| SHA-256 digest of a deleted invite identity | prevent configured seed from silently recreating a deleted invitation | private auth JSON | retained while the same invite seed remains configured | not exported | contains no raw email/code; a genuinely new invitation code creates a new identity |
| Onboarding profile, goals, commitments and constraints | personalize the planning loop | selected MVP repository | account lifetime | workspace JSON envelope | removed |
| Weekly review, plan, priorities, actions and notes | planning and execution | selected MVP repository | account lifetime | workspace JSON envelope | removed |
| Daily check-ins, reflections and feedback | user-requested tracking and reflection | selected MVP repository | account lifetime | workspace JSON envelope | removed |
| MVP event names/timestamps and computed counts | product behavior and in-product summaries | selected MVP repository | account lifetime | workspace JSON envelope | removed |
| Up to five workspace recovery envelopes | recovery after explicit workspace reset | selected MVP repository | until replaced by the five-record cap or account deletion | included in account export | removed |
| Theme, language, accessibility, onboarding, focus, sanctuary, dynamic-now and user preferences | device experience | browser local storage, guarded by the current account owner marker | until account transition, local clear or account deletion from Settings | added only when the owner marker matches the authenticated account | known LifeOS keys and owner marker are removed |
| Local sync diagnostics | offline synchronization status | browser IndexedDB, capped at 100 entries | until local clear or account deletion | added to downloaded JSON by the browser | removed by the Settings deletion flow |
| Auth/session state and query cache | offline continuity | browser IndexedDB and local storage | until logout/cache expiry or account deletion | never portable because it can contain credentials/duplicates | removed by the Settings deletion flow |

Derived analytics in the workspace are recomputed from exported records. They are not an independent processor or retention store.

## Subject operations

- `POST /api/auth/data-export` requires an authenticated session, allowed write origin and current password. It returns `lifeos.account.export` version 1 without password hashes, invite codes, session versions or another user's records.
- Settings > Data downloads that server envelope and adds the current device's known LifeOS preference keys.
- `POST /api/auth/delete-account` additionally requires the exact phrase `DELETE MY ACCOUNT`.
- Deletion first persists a pending intent that revokes session resolution, then atomically removes the selected MVP user's identity, active records and recoveries, and finally purges auth/invite data. If MVP deletion fails, the intent is cancelled and the account remains usable with old sessions revoked. If only the final auth purge is interrupted, the API returns an accepted/pending result: the account remains inaccessible and reconciliation finishes the purge.
- File deletion writes sanitized state to the active file and `.bak`. Prisma uses the `User` cascade in one serializable transaction.

Pending intents are reconciled on application restart. A crash before MVP deletion leaves the account inaccessible and the intent durable; restart retries the idempotent MVP deletion before final auth purge. Repository tombstones reject stale writes as soon as deletion starts, preventing already-authenticated requests from recreating rows.

## Operational backups

Runtime database and migration backups are exceptional copies, not active stores. Encrypt them, restrict access to the maintainer, retain them for at most 30 days, then destroy them. Never restore a backup without replaying deletions recorded after its creation. The file-to-Prisma migration backup directory follows the same limit; after the rollback window, remove it and retain only the non-plaintext ledger.

Run restore drills only in a disposable isolated database, verify user scoping and counts, then destroy the fixture. Never use production personal data for a drill.

## Logs and processors

- Server errors emit only `MVP API request failed`; request bodies and exception objects are not logged.
- Browser errors retain only allowlisted name/code and fixed component/action labels. Messages, stacks, URLs, user IDs and arbitrary metadata are discarded.
- Authentication UI does not log email, user agent, credentials or raw errors.
- Host logs, if retained, expire within 7 days and are accessible only to the maintainer.

Google Analytics, Sentry tracing/replay and custom error forwarding are disabled in every supported MVP mode. Sampling is zero, replay is off, no vendor receives a subject identifier, and downstream deletion is not applicable. Enabling a processor requires a reviewed change documenting payloads, purpose/legal basis or consent, sampling, retention, access owner, subject lookup and tested deletion.
