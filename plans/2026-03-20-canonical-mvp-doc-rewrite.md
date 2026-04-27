# LifeOS Canonical MVP Doc Rewrite

Date: 2026-03-20
Owner: Product Strategist
Status: completed

## Product decision

LifeOS should be documented against one canonical MVP only: the invite-only weekly operating loop implemented in the current React + Express workspace.

## Why

- `npm run dev` and `npm run build` default to the web workspace, not Electron.
- The implemented backend contract in `api/app.ts` supports invite auth plus the weekly-loop `/api/mvp/*` slice.
- The route shell and integration tests in `src/features/mvp/` and `api/__tests__/mvp.test.ts` align to the weekly-loop story.
- Desktop-first docs were contradicting the shipped default runtime and causing roadmap drift.

## Documentation changes

- Added canonical source of truth: `docs/mvp/canonical-mvp.md`
- Rewrote top-level framing in `README.md`
- Rewrote `docs/architecture-overview.md` to match the actual runtime and ownership boundaries
- Rewrote `docs/mvp/route-map.md` to reflect the implemented route and API contract
- Marked stale desktop-first artifacts as superseded and pointed them to the canonical MVP doc

## Remaining product gaps

- Default nav still centers the broader suite instead of the MVP loop
- `/mvp/admin` is still exposed as a standard authenticated route rather than an internal-only surface
- MVP workspace copy still overstates readiness in some places
- Legacy product docs and PRD artifacts still need a broader archive pass
