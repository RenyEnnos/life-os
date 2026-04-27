# LifeOS Canonical MVP

Status: active source of truth
Last updated: 2026-03-28
Owner: Product Strategist

## Product Decision

LifeOS should be framed in this repository as one product only: an invite-only weekly operating loop implemented inside the existing React + Express workspace.

## What This Means

The MVP is not the entire LifeOS productivity suite.

The MVP is the narrow loop that helps a design partner:

1. define context and constraints
2. generate and confirm a focused weekly plan
3. execute a small set of next actions during the week
4. reflect and leave feedback

## Canonical MVP Surface

Frontend routes:

- `/mvp`
- `/mvp/onboarding`
- `/mvp/weekly-review`
- `/mvp/today`
- `/mvp/reflection`
- `/mvp/admin` for internal analytics only (internal/local/dev use only in current MVP)

Backend contract:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/verify`
- `/api/auth/logout`
- `/api/auth/profile`
- `/api/mvp/workspace`
- `/api/mvp/onboarding`
- `/api/mvp/weekly-plans/generate`
- `/api/mvp/weekly-plans/:planId/confirm`
- `/api/mvp/action-items/:actionItemId`
- `/api/mvp/daily-checkins`
- `/api/mvp/reflections`
- `/api/mvp/feedback`
- `/api/mvp/workspace` `DELETE`

## Scope In

- invite-gated registration and authenticated access
- onboarding intake
- weekly review and weekly plan generation
- daily execution
- reflection and product feedback
- internal visibility into activation and completion signals

## Scope Out

- positioning LifeOS as a general productivity suite for MVP messaging
- treating dashboard, tasks, habits, calendar, journal, health, finances, projects, university, AI assistant, focus, gamification, or design preview as MVP-defining surfaces
- claiming Electron is the current default product runtime
- sync or cloud-readiness claims
- calling the admin view partner-facing
- partner-production rollout of `/mvp/admin` without role-based authorization

## Current Constraints

- default navigation still centers the broader suite instead of the MVP loop
- `/mvp/admin` is currently accepted for internal/local/dev use with non-role controls (environment, invite, and operator process controls)
- role-based authorization is required before any partner-production `/mvp/admin` rollout
- some MVP copy still overstates readiness
- the repo still contains stale desktop-first release docs and broad-suite PRD artifacts

## How To Use This Document

- If a roadmap, spec, or release note conflicts with this file, update that document or mark it superseded.
- New product requirements should assume this MVP boundary unless the CEO explicitly changes it.
- Engineering docs should point here instead of redefining the MVP in parallel.
