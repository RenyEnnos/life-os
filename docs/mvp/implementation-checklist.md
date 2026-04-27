# LifeOS MVP Implementation Checklist

Source of truth: `/home/pedro/.paperclip/instances/default/workspaces/aba66bcd-2a37-4871-9854-1b8106f3fe2a/plans/2026-03-19-lifeos-architecture-delivery-plan.md`

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
- [ ] Add Prisma CLI and client packages to the workspace
- [ ] Add Prisma migration scripts to `package.json`
- [ ] Generate first migration against the managed Postgres target
- [ ] Decide whether the existing Vite app remains the delivery vehicle or whether MVP moves to a dedicated Next.js app

### Auth and environments

- [ ] Confirm the invitation/auth provider for design partners
- [ ] Define required environment variables for auth, analytics, error logging, and AI
- [ ] Add `.env.example` covering MVP services only
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

### Data and local development

- [ ] Seed one demo user with goals, commitments, review history, and a weekly plan
- [ ] Add local setup instructions for database bootstrapping
- [ ] Add a fixture path for AI-free plan generation during local development

## Phase 1 Onboarding To First Plan

### Onboarding flow

- [x] Scaffold onboarding MVP surface
- [ ] Capture role and life season
- [ ] Capture top goals
- [ ] Capture recurring commitments and constraints
- [ ] Capture current planning pain and success criteria
- [ ] Persist onboarding draft state

### Weekly review and plan generation

- [x] Scaffold weekly review MVP surface
- [ ] Summarize open commitments, unfinished work, and constraints
- [ ] Generate 3 to 5 weekly priorities from structured input
- [ ] Require explicit user confirmation before plan lock
- [ ] Persist weekly plan, priorities, and action items
- [ ] Record generation inputs and outputs for later review

### Exit criteria

- [ ] Invited user reaches a first weekly plan with no manual admin intervention

## Phase 2 Daily Execution Loop

- [x] Scaffold today MVP surface
- [ ] Show only active weekly priorities and next actions
- [ ] Support complete, defer, and note actions
- [ ] Add simple carry-forward rules for unfinished action items
- [ ] Persist daily check-in answers and notes
- [ ] Show week progress on the today surface

## Phase 3 Reflection And Feedback

- [x] Scaffold reflection MVP surface
- [ ] Add end-of-day reflection prompt
- [ ] Add end-of-week reflection prompt
- [ ] Add in-product feedback capture
- [ ] Feed reflection and feedback into the internal review surface

## Phase 4 Tightening

- [x] Scaffold internal admin analytics surface
- [ ] Remove dead-end copy and interaction friction across the loop
- [ ] Verify mobile behavior for the full weekly loop
- [ ] Add smoke coverage for onboarding, planning, daily execution, and reflection
- [ ] Validate activation and retention metrics against live usage

## Open Decisions

- Primary delivery stack:
  Current workspace is Vite + React Router, while the architecture plan recommends Next.js App Router. The MVP route shell added in this task preserves momentum inside the existing codebase, but product leadership should decide whether to keep iterating in-place or migrate before deeper backend work starts.
- Database ownership:
  The repository already contains Supabase SQL migrations. The Prisma schema added here defines the MVP model cleanly, but the team still needs to choose whether Prisma becomes the primary migration interface or stays as an application model layered on top of Supabase-managed Postgres.
