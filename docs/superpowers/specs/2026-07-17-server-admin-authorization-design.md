# Server Admin Authorization Design

Issue: #107
Decision source: `docs/security/2026-07-16-operating-modes-threat-model.md`

## Decision

The canonical web runtime will reuse its existing authenticated user and add one server-side email allowlist, `LIFEOS_ADMIN_EMAILS`. Client flags, hostname checks, and user metadata remain presentation hints and never authorize an API request.

The server exposes one read-only `GET /api/mvp/admin/overview` operation. It returns only the authenticated administrator's MVP analytics, event stream, and feedback. This matches the data the existing internal surface actually renders without inventing cross-user aggregation or repository-wide access.

The admin surface loses its reset button. Workspace reset remains an authenticated user's self-service operation at `DELETE /api/mvp/workspace`; its confirmation, recovery, and CSRF redesign belong to #108. There is no admin reset endpoint.

## Authorization contract

- no session: `401` through the existing authentication middleware;
- authenticated email absent from the normalized allowlist: `403`;
- authenticated allowlisted email: `200` with only `analytics`, `events`, and `feedback`;
- empty or malformed allowlist entries grant nothing;
- invite code, hostname, development mode, Vite flags, and metadata do not participate in the server decision.

The allowlist is an interim reversible policy for the current small internal surface. A database role system is deliberately deferred until roles must be managed dynamically.

## Evidence

API tests cover unauthenticated, ordinary-user, allowlisted-admin, feedback/event visibility, response minimization, and the absence of an admin reset route. UI tests only prove that the surface calls the protected endpoint and does not expose destructive reset.

## Scope

This change does not create cross-user analytics, mutable roles, an admin account-management API, a second token type, recoverable reset, partner-beta approval, or public-production support.
