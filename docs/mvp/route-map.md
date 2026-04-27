---
type: reference
status: active
last_updated: 2026-04-27
tags: [mvp, product]
---

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
  Current state: accepted for internal/local/dev use via non-role controls (environment, invite, and operator process controls)
  Production policy: role-based authorization is required before any partner-production rollout

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
- There is no dedicated backend admin overview endpoint. The `/mvp/admin` surface currently reads from workspace state rather than a separate analytics API.
- The route map should be treated as executable contract documentation, not as a proposal list. If a route is not implemented, do not document it here as current behavior.
