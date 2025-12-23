## Context
The audit surfaced security and reliability gaps (silent Supabase mock fallback, unprotected diagnostics, permissive CORS, CSV export injection risk, unvalidated profile updates, and a server secret fallback to VITE_ envs). The design hardens these areas without changing product UX.

## Goals / Non-Goals
- Goals: fail fast on missing secrets, remove mock fallback usage, restrict diagnostics, sanitize CSV exports, validate profile updates, and keep dev ergonomics intact.
- Non-Goals: redesign auth flows, add new features, or refactor all remaining `any` usages in one pass.

## Decisions
- Decision: remove Supabase mock fallback entirely; require real Supabase configuration in all environments (tests must set env).
- Decision: remove `VITE_JWT_SECRET` fallback; require `JWT_SECRET` on the server outside tests.
- Decision: enforce production CORS allowlists only; keep localhost/private origins limited to non-production.
- Decision: gate `/api/dev/*` and `/api/db/*` behind auth in non-production and disable in production unless explicitly enabled.
- Decision: sanitize CSV export cells by prefixing formula-leading values (`=`, `+`, `-`, `@`).

## Risks / Trade-offs
- Stricter startup checks can break local dev if env vars are missing; mitigated by clear logs and explicit environment configuration.
- Disabling diagnostics in production reduces ad-hoc visibility; mitigated by a feature flag or admin-only access.

## Migration Plan
- Add env flags and update docs.
- Deploy with flags configured in dev/preview and verify endpoints/tests.
- Roll back by toggling flags and reverting CORS changes if needed.

## Open Questions
- Should diagnostic routes be removed entirely in production or gated behind admin auth?
