# Design Logic

## Soft Delete Strategy
Currently, `repoFactory` uses `delete()`. Users report "data never disappears", implying the DB might have a rule converting DELETE to UPDATE `deleted_at`, but the API continues to return it.
**Decision**: We will explicitly implement Soft Delete in the application layer (`BaseRepo`) to ensure consistency regardless of DB rules.
- `remove(id)` -> `update(id, { deleted_at: new Date() })`
- `list()` -> `select('*').is('deleted_at', null)`

## Calendar OAuth
The callback endpoint `/api/calendar/callback` must remain public to receive Google's redirect.
**Security**: The callback should strictly redirect to the frontend with the `code`. The actual token exchange happens via `POST /connect` which IS authenticated.
**Improvement**: Ensure `process.env.FRONTEND_URL` is strictly validated to prevent open redirect vulnerabilities.

## Realtime Auth
SSE cannot send custom headers easily in strict environments.
**Decision**: Continue using `withCredentials: true` (Cookies).
**Verification**: Ensure `api/routes/realtime.ts` (not yet read) extracts user from Cookie, NOT just Authorization header.

## Protected Routes
Investigation shows `ProtectedRoute` exists and checks `!user`.
**Analysis**: The user report might be based on stale client builds. We will verify the build process ensures latest code is running.
