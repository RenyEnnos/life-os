---
type: reference
status: active
last_updated: 2026-04-27
tags: [mvp, product]
---

# LifeOS MVP Implementation Checklist

Source of truth: `docs/mvp/canonical-mvp.md`

## Status Summary

| Phase | Progress | Notes |
|-------|----------|-------|
| Product Boundary | 100% | All items complete |
| Phase 0 — Foundation | 60% | Repo/auth done, observability and data gaps remain |
| Phase 1 — Onboarding to First Plan | 40% | Surfaces scaffolded, core logic partially implemented |
| Phase 2 — Daily Execution | 25% | Surface scaffolded, action logic pending |
| Phase 3 — Reflection & Feedback | 25% | Surfaces scaffolded, prompts and capture pending |
| Phase 4 — Tightening | 20% | Surfaces scaffolded, polish and coverage pending |

## Product Boundary

- [x] Lock MVP around a single weekly operating loop
- [x] Keep surfaces limited to onboarding, weekly review, daily execution, reflection, and internal analytics
- [x] Keep scope inside one application boundary
- [x] Remove or hide non-MVP navigation and surfaces before design-partner rollout

## Phase 0 Foundation

### Repo and architecture

- [x] Create MVP route shell inside the primary workspace
- [x] Define initial route map for user flows and backend contracts
- [x] Define initial relational schema for the MVP domain
- [x] Add Prisma CLI and client packages to the workspace
- [x] Add Prisma migration scripts to `package.json`
- [x] Generate first migration against the managed Postgres target
- [ ] Decide whether the existing Vite app remains the delivery vehicle or whether MVP moves to a dedicated Next.js app

### Auth and environments

- [x] Confirm the invitation/auth provider for design partners (file-backed invites via `LIFEOS_INVITES` env var)
- [ ] Define required environment variables for auth, analytics, error logging, and AI
- [x] Add `.env.example` covering MVP services only
- [x] Add a protected invite-only gate for onboarding

### Observability

- [ ] Track `onboarding_started`
- [ ] Track `onboarding_completed`
- [ ] Track `weekly_review_started`
- [ ] Track `weekly_review_completed`
- [ ] Track `weekly_plan_generated`
- [ ] Track `daily_checkin_completed`
- [ ] Track `reflection_completed`
- [ ] Track `user_feedback_submitted`
- [ ] Add one internal activation dashboard view
- [ ] Confirm Sentry release tagging and environment naming

> **Note:** Telemetry event schemas are defined in `docs/mvp/telemetry-event-map.md` but not yet implemented in code.

### Data and local development

- [ ] Seed one demo user with goals, commitments, review history, and a weekly plan
- [ ] Add local setup instructions for database bootstrapping
- [ ] Add a fixture path for AI-free plan generation during local development

> **Note:** `scripts/seed_test_user.ts` exists for test user seeding but is not a full demo dataset.

## Phase 1 Onboarding To First Plan

### Onboarding flow

- [x] Scaffold onboarding MVP surface
- [x] Capture role and life season (via onboardingStore goals/focus areas)
- [x] Capture top goals (via onboardingStore)
- [x] Capture recurring commitments and constraints (via onboardingStore)
- [ ] Capture current planning pain and success criteria
- [x] Persist onboarding draft state (via Zustand store with persistence)

### Weekly review and plan generation

- [x] Scaffold weekly review MVP surface
- [ ] Summarize open commitments, unfinished work, and constraints
- [x] Generate 3 to 5 weekly priorities from structured input (via `shared/mvp/plan.ts`)
- [x] Require explicit user confirmation before plan lock (confirmPlan endpoint)
- [x] Persist weekly plan, priorities, and action items (Prisma + file-backed)
- [ ] Record generation inputs and outputs for later review

### Exit criteria

- [ ] Invited user reaches a first weekly plan with no manual admin intervention

## Phase 2 Daily Execution Loop

- [x] Scaffold today MVP surface
- [x] Show only active weekly priorities and next actions
- [ ] Support complete, defer, and note actions
- [ ] Add simple carry-forward rules for unfinished action items
- [x] Persist daily check-in answers and notes (dailyCheckins endpoint)
- [ ] Show week progress on the today surface

## Phase 3 Reflection And Feedback

- [x] Scaffold reflection MVP surface
- [ ] Add end-of-day reflection prompt
- [ ] Add end-of-week reflection prompt
- [x] Add in-product feedback capture (feedback endpoint)
- [ ] Feed reflection and feedback into the internal review surface

## Phase 4 Tightening

- [x] Scaffold internal admin analytics surface
- [ ] Remove dead-end copy and interaction friction across the loop
- [ ] Verify mobile behavior for the full weekly loop
- [ ] Add smoke coverage for onboarding, planning, daily execution, and reflection
- [ ] Validate activation and retention metrics against live usage

## Open Decisions

1. **Primary delivery stack:** Current workspace is Vite + React Router, while the architecture plan recommends Next.js App Router. The MVP route shell preserves momentum inside the existing codebase, but product leadership should decide whether to keep iterating in-place or migrate before deeper backend work starts.

2. **Database ownership:** The repository already contains Supabase SQL migrations. The Prisma schema defines the MVP model cleanly, but the team still needs to choose whether Prisma becomes the primary migration interface or stays as an application model layered on top of Supabase-managed Postgres.

3. **Telemetry implementation:** Event schemas are defined in `docs/mvp/telemetry-event-map.md` but no events are tracked in code. Decision needed on whether to implement gtag/Sentry now or defer.
