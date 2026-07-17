# LifeOS MVP Route Map

This file documents the implemented route and API contract for the canonical MVP in `docs/mvp/canonical-mvp.md`.

## Frontend Routes

### Canonical MVP routes

- `GET /mvp`
  Purpose: workspace overview for the weekly operating loop
- `GET /mvp/onboarding`
  Purpose: capture identity, goals, commitments, constraints, and planning pain
- `GET /mvp/weekly-review`
  Purpose: generate and confirm a weekly plan
- `GET /mvp/today`
  Purpose: execute current priorities and save a daily check-in
- `GET /mvp/reflection`
  Purpose: save reflection and product feedback
- `GET /mvp/admin`
  Purpose: internal analytics surface
  Current state: client routing is only presentation; data loads from the server-authorized admin endpoint
  Authorization: the authenticated email must exactly match `LIFEOS_ADMIN_EMAILS`

### Legacy broader-suite routes still present in the shell

These routes exist in `src/config/routes/index.tsx`, but they are not canonical MVP scope:

- `/`
- `/tasks`
- `/habits`
- `/calendar`
- `/journal`
- `/health`
- `/finances`
- `/projects`
- `/ai-assistant`
- `/focus`
- `/gamification`
- `/settings`
- `/design`
- `/university`

## Backend Contract

### Health

- `GET /api/health`
  Output: API health status

### Auth

- `POST /api/auth/register`
  Input: `email`, `password`, `name`, `inviteCode`
  Output: session token, serialized user, profile
- `POST /api/auth/login`
  Input: `email`, `password`
  Output: session token, serialized user, profile
- `GET /api/auth/verify`
  Output: serialized authenticated user
- `POST /api/auth/logout`
  Output: success flag
- `PATCH /api/auth/profile`
  Input: optional `name`, `theme`
  Output: updated user and profile

### MVP workspace

- `GET /api/mvp/workspace`
  Output: current onboarding, plan, execution, analytics, reflections, and feedback state
- `DELETE /api/mvp/workspace`
  Output: reset workspace state for the authenticated user

### Internal administration

- `GET /api/mvp/admin/overview`
  Authorization: authenticated email must exactly match a valid comma-separated entry in `LIFEOS_ADMIN_EMAILS`
  Output: the administrator's analytics, event stream, and feedback only
  Failure: `401` without a valid session; `403` for authenticated non-administrators
  Destructive operations: none; workspace reset remains a user-scoped endpoint pending the recovery controls tracked in #108

### Onboarding

- `PUT /api/mvp/onboarding`
  Input: onboarding payload
  Output: saved onboarding snapshot

### Weekly plan

- `POST /api/mvp/weekly-plans/generate`
  Input: structured weekly review context
  Output: generated plan with priorities and action items
- `POST /api/mvp/weekly-plans/:planId/confirm`
  Output: confirmed plan

### Daily execution

- `PATCH /api/mvp/action-items/:actionItemId`
  Input: action item updates such as `status` and `note`
  Output: updated workspace analytics and action state
- `POST /api/mvp/daily-checkins`
  Input: daily execution check-in payload
  Output: saved daily check-in and updated analytics

### Reflection and feedback

- `POST /api/mvp/reflections`
  Input: reflection payload
  Output: saved reflections collection
- `POST /api/mvp/feedback`
  Input: feedback payload
  Output: saved feedback collection

## Important Contract Notes

- There is no implemented `POST /api/mvp/auth/invite/accept` endpoint. Invite acceptance currently happens through `POST /api/auth/register`.
- Development mode, localhost, Vite flags, invite metadata, and UI visibility never authorize the backend admin endpoint.
- All auth/profile/MVP writes use strict bounded Zod schemas; unknown fields and invalid values return `400`, malformed JSON returns `400`, and bodies above 32 KiB return `413`.
- Cookie-authenticated unsafe methods require an exact configured `Origin`. Authorization bearer tokens are explicit authority and do not depend on browser CSRF protections.
- Logout increments a persisted per-user session version, invalidating existing cookie and bearer tokens for that account.
- Authentication is limited to 10 attempts per 15 minutes by direct peer, ordinary authenticated writes to 120 per 15 minutes per user, and plan generation to 20 per hour per user.
- Express intentionally keeps `trust proxy=false`; forwarded client IP headers are not accepted in the supported direct deployment.
- `POST /api/mvp/workspace/reset/export` requires password reauthentication plus exact `RESET MY WORKSPACE` confirmation and returns a versioned portable export with a ten-minute digest-bound reset token.
- `POST /api/mvp/workspace/reset` repeats password and exact confirmation, verifies the prepared token, rejects changed workspaces with `409`, and retains recovery in the same repository mutation that clears the workspace.
- `GET /api/mvp/workspace/recovery/latest` retrieves the latest retained user-scoped export; `POST /api/mvp/workspace/recovery` requires password plus exact `RESTORE MY WORKSPACE` and transactionally replaces the workspace from a strict envelope.
- Reset and recovery each use an independent limit of three attempts per hour per user, including failed reauthentication or validation attempts. Recovery/reset payload routes allow at most 10 MiB after authentication/CSRF/limiting, with the strict envelope capped at 8 MiB, so a portable workspace can exceed the ordinary 32 KiB write limit without raising that global boundary.
- The former bodyless `DELETE /api/mvp/workspace` and silent canonical web client/store reset are removed. Electron's separate reset bridge is non-canonical and remains explicitly owned by #111.
- The route map should be treated as executable contract documentation, not as a proposal list. If a route is not implemented, do not document it here as current behavior.
