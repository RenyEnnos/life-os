# Experimental Electron data export

Electron remains experimental under ADR-0001. This procedure preserves data before any archival decision; it does not promote desktop support or import data into the canonical web runtime.

1. Sign in to the Electron identity that owns the data and use **Settings → Your data → Download my data**. The `lifeos.desktop.export` envelope contains that identity's MVP workspace, recoveries and owned legacy SQLite rows.
2. Keep the desktop database and MVP JSON read-only. The export records ownerless legacy rows separately and reports the excluded sync-queue count. It never reads or exports `auth_session` access/refresh tokens or sync-queue payloads.
3. Sign in independently to the intended web account. From web Settings, request the account export with the current password and the claimed desktop source user ID. The password-reauthenticated response records a `user-asserted` claim containing `sourceRuntime`, `sourceUserId` and `targetWebUserId`; it proves control of the target web account only and does not infer identity from email or prove control of the desktop source.
4. Preserve both envelopes together. Verify their source IDs, checksums and record counts before any later import or archival. A future import must dry-run collisions and remain atomic; #111 does not authorize an import.

Rollback is preservation-only: retain the original Electron database, MVP JSON and compatible application reader. Never copy desktop tokens into browser storage or web auth state. If a source identity is unknown or an ownerless row exists, leave it unmapped for explicit review.
