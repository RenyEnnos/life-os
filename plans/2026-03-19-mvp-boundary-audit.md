# LifeOS Product Audit: MVP Boundary, Scope Drift, and Docs Trust

Date: 2026-03-19
Owner: Product Strategist
Status: Decision memo for CEO + Founding Engineer

## Product Decision

LifeOS should be framed and shipped as one narrow product only:

1. Desktop local-first MVP, or
2. Invite-only weekly operating loop MVP

The repo currently tries to market both at once, while still exposing a broader productivity suite. That creates scope drift, weakens docs trust, and makes roadmap decisions non-actionable.

Recommendation: freeze external and internal product framing to one canonical MVP this week. Then hide or demote everything outside that boundary.

## Executive Summary

- The canonical release-readiness docs say the MVP is `desktop local-first`, with no browser path and no broader product framing.
- The live app still exposes a broad browser-style suite: dashboard, habits, calendar, health, finances, projects, journal, university, AI assistant, focus, gamification, and design preview.
- The `/mvp` area separately claims the MVP is a weekly operating loop, not a general productivity suite, but it is shipped as just another route inside the broader product shell.
- Several MVP surfaces are labeled `ready` even though their own checklist and copy says auth gating, analytics, and design-partner demo flow are not done.
- API and planning docs conflict with implementation enough that the docs cannot currently be treated as reliable execution contracts.

## Prioritized Findings

### 1. Critical: There is no single canonical product truth in the repo

Evidence:

- `docs/MVP_DESKTOP_RELEASE_READINESS.md:5-8` says the supported MVP surface is desktop local-first only, with no browser path and no web claim.
- `docs/MVP_DESKTOP_RELEASE_READINESS.md:33-35` freezes release messaging to desktop local-first only.
- `docs/prd/prd_v2.2.md:14-15` defines LifeOS as the "ultimate personal operating system".
- `docs/prd/prd_v2.2.md:29-41` and `docs/prd/prd_v2.2.md:45-94` describe a broad multi-surface suite across habits, finances, university, AI assistant, dashboard, and tasks.
- `src/features/mvp/pages/MvpWorkspacePage.tsx:120-122` says the MVP is a weekly operating loop, not a general productivity suite.

Impact:

- CEO direction, engineering prioritization, and release messaging can all be “correct” while pointing in different directions.
- Teams cannot reliably decide whether a broad feature request is in scope, out of scope, or post-MVP.

Decision:

- Pick one canonical product frame and explicitly archive the others.

Acceptance criteria:

- One document is marked canonical for MVP scope.
- Conflicting PRDs and roadmap docs are either archived or stamped `superseded`.
- Navigation and release copy match the canonical scope.

### 2. Critical: The live route map exposes a broad suite that contradicts the claimed MVP boundary

Evidence:

- `src/config/routes/index.tsx:97-198` exposes `/`, `/habits`, `/tasks`, `/calendar`, `/journal`, `/health`, `/finances`, `/projects`, `/ai-assistant`, `/focus`, `/gamification`, `/settings`, `/design`, `/university`, and `/mvp/*`.
- `src/app/layout/navItems.ts:23-38` makes the broad suite primary navigation, while `MVP` is a secondary nav item.
- `docs/MVP_DESKTOP_RELEASE_READINESS.md:5-8` explicitly rejects browser/web framing as part of the MVP.

Impact:

- A user or stakeholder using the app sees a general productivity platform, not a tightly scoped MVP.
- This makes the MVP boundary unenforceable in practice even if docs say otherwise.

Decision:

- If the canonical MVP is desktop local-first task/habit/dashboard proof, hide the extra suite surfaces from default nav and route entry.
- If the canonical MVP is the weekly operating loop, make `/mvp` the primary product and demote the suite to internal/dev-only.

Acceptance criteria:

- Default navigation shows only in-scope MVP surfaces.
- Out-of-scope routes require an internal flag or are removed from release builds.
- Wildcard and default route behavior land users on the canonical MVP surface.

### 3. High: `/mvp` is presented as “ready” even though its own UI says key prerequisites are unfinished

Evidence:

- `src/features/mvp/data.ts:3-43` marks all five MVP surfaces, including admin analytics, as `ready`.
- `src/features/mvp/data.ts:46-52` says invite-only auth, milestone analytics, and seed flow are still not done.
- `src/features/mvp/pages/MvpWorkspacePage.tsx:35-36` calls the workspace a usable client-side MVP.
- `src/features/mvp/pages/MvpWorkspacePage.tsx:129-132` lists invite-only gating and telemetry mirroring as immediate next work.
- `src/features/mvp/pages/MvpSurfacePage.tsx:25-29`, `37-40`, `49-52`, `61-64`, `73-76` all list unfinished “next build” items for every surface.

Impact:

- Product and engineering teams can misread scaffold completion as MVP readiness.
- Stakeholders can believe the loop is design-partner-ready when key controls are missing.

Decision:

- Change status vocabulary from `ready` to `scaffolded`, `internal`, or `prototype` until gating and telemetry are complete.

Acceptance criteria:

- No MVP surface is labeled `ready` unless gating, persistence, and telemetry criteria are satisfied.
- Workspace copy distinguishes prototype status from shippable status.

### 4. High: Internal/admin analytics are exposed to any authenticated user

Evidence:

- `docs/mvp/route-map.md:29-32` defines `/mvp/admin` as internal analytics.
- `src/config/routes/index.tsx:193-196` exposes `/mvp/admin` as a normal authenticated route.
- `src/features/mvp/pages/MvpSurfacePage.tsx:67-77` says admin should stay internal only and still needs placeholder KPIs replaced.
- `src/features/mvp/pages/MvpSurfacePage.tsx:449-523` renders the admin surface with event stream, feedback, and destructive reset.

Impact:

- Design partners or invited users can access internal telemetry and reset controls.
- Internal-only product learning surfaces are not separated from user-facing MVP.

Decision:

- Gate `/mvp/admin` behind an internal role or build flag immediately.

Acceptance criteria:

- Non-internal users cannot access `/mvp/admin`.
- The admin surface is excluded from public MVP navigation and flow steps.

### 5. High: Docs describe an MVP API contract that does not match the implemented contract

Evidence:

- `docs/mvp/route-map.md:40-42` defines `POST /api/mvp/auth/invite/accept`; implementation instead uses `POST /api/auth/register` with invite code in body at `api/app.ts:109-137`.
- `docs/mvp/route-map.md:46-52` defines separate onboarding draft and complete endpoints; implementation exposes only `PUT /api/mvp/onboarding` at `api/app.ts:232-239`.
- `docs/mvp/route-map.md:56-60` defines `GET /api/mvp/weekly-reviews/current` and `POST /api/mvp/weekly-reviews`; implementation has neither, and instead uses `GET /api/mvp/workspace` and `POST /api/mvp/weekly-plans/generate` at `api/app.ts:224-245`.
- `docs/mvp/route-map.md:89-90` defines `GET /api/mvp/admin/overview`; implementation has no admin overview endpoint.

Impact:

- Engineers cannot treat `docs/mvp/route-map.md` as source of truth.
- Future frontend/backend work risks building to stale endpoints.

Decision:

- Either align implementation to the documented contract or rewrite the doc to match shipped reality. Do not keep both.

Acceptance criteria:

- The route map matches implemented endpoints exactly.
- Each documented route exists or is explicitly tagged `proposed`.

### 6. Medium: Invite-only positioning is inconsistent across UI, backend, and MVP copy

Evidence:

- `src/features/auth/components/RegisterPage.tsx:216-229` positions signup as closed beta for invited partners.
- `api/app.ts:109-137` enforces invite-code-based registration.
- `src/features/mvp/pages/MvpWorkspacePage.tsx:129-132` still lists invite-only gating as future work.
- `src/features/mvp/data.ts:50-52` says invite-only auth flow and design-partner seed flow are not done.

Impact:

- One part of the product says invite-only beta already exists; another says invite-only MVP gating is still incomplete.
- Teams cannot tell whether access control is “implemented enough” or still a blocker.

Decision:

- Clarify the exact gap: account registration may be invite-based, but MVP-surface authorization and partner cohort gating are not yet complete.

Acceptance criteria:

- Docs distinguish auth invite flow from MVP-surface access gating.
- MVP readiness docs state the remaining gating gap in one sentence with owner and next step.

### 7. Medium: Old roadmap and PRD artifacts still point the team toward broader post-MVP work

Evidence:

- `docs/roadmap-and-sprints.md:3-5` claims broad sprints 1-5 are completed.
- `docs/roadmap-and-sprints.md:49-156` still treats habits, tasks, journal, finances, health, projects, SWOT, gamification, Groq AI, and logs as active planned scope.
- `docs/prd/prd_v2.2.md:45-94` centers the product around a broad suite and AI-assisted weekly review.

Impact:

- New contributors can follow stale artifacts instead of the current MVP framing.
- Scope creep becomes structurally encouraged by the docs.

Decision:

- Archive or supersede broad-scope planning docs that no longer match the current MVP decision.

Acceptance criteria:

- Every stale planning doc is either archived or clearly labeled as historical context.
- The top-level docs index points to the current canonical MVP artifact first.

## Surfaces That Should Likely Be Removed or Demoted From The MVP Path

Remove from default MVP navigation immediately:

- `/ai-assistant`
- `/focus`
- `/gamification`
- `/design`
- `/projects`
- `/university`
- `/calendar`
- `/journal`
- `/health`
- `/finances`

Reason:

- These surfaces reinforce the “general productivity suite” framing and dilute the MVP story.

Conditional:

- `/dashboard`, `/tasks`, `/habits`

Reason:

- Keep only if the canonical MVP is the audited desktop local-first task/habit/dashboard product.
- Demote if the canonical MVP is the weekly operating loop in `/mvp`.

Keep, but gate:

- `/mvp/admin`

Reason:

- Internal-only by its own definition.

## Recommended Sequencing

### Now

1. Choose canonical MVP frame: `desktop local-first suite` or `weekly operating loop`.
2. Freeze messaging and docs to that frame.
3. Hide or gate routes that violate the chosen frame.

### Next

1. Rewrite `docs/mvp/route-map.md` to match real implementation.
2. Re-label `/mvp` statuses from `ready` to honest maturity states.
3. Archive or supersede stale roadmap and PRD artifacts.

### After That

1. Break remaining work into implementation tickets for gating, docs cleanup, and navigation cleanup.
2. Re-run MVP readiness review against the chosen frame only.

## Proposed Issue Breakdown

1. Canonical MVP framing and docs freeze
2. Navigation and route gating cleanup
3. `/mvp/admin` internal-only access control
4. MVP status language and readiness truthfulness pass
5. MVP API contract doc alignment

