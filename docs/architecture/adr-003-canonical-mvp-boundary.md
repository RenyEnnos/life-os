---
type: decision
status: active
last_updated: 2026-04-27
tags: [architecture, decision-record]
---

# ADR-003: Canonical MVP Boundary

## Status

Accepted

## Date

2026-03-20

## Context

The LifeOS repository contained conflicting product definitions:

- Desktop release docs framed the MVP as a "desktop local-first productivity suite."
- The PRD (`prd_v2.2.md`) described a broad multi-surface platform (habits, finances, university, AI assistant, etc.).
- The `/mvp` route defined a narrow "weekly operating loop."
- Navigation exposed all feature modules equally, making the product boundary invisible to users.

This created scope drift, weakened documentation trust, and made roadmap decisions non-actionable. The MVP boundary audit (`plans/2026-03-19-mvp-boundary-audit.md`) identified this as the highest-priority issue.

## Decision

The canonical MVP is the **invite-only weekly operating loop** implemented in `src/features/mvp/`. This is the single product frame for all MVP-related decisions.

The canonical source of truth is `docs/mvp/canonical-mvp.md`. When documents conflict, the precedence order is:

1. `docs/mvp/canonical-mvp.md`
2. `docs/mvp/route-map.md`
3. `api/app.ts` and `src/config/routes/index.tsx`
4. Historical docs marked as superseded

## Consequences

### Positive

- Clear scope: engineers and product stakeholders can make fast decisions about what is in/out of scope.
- Documentation trust: one canonical document eliminates conflicting product definitions.
- Focused development: the team can ship a tight, well-scoped loop before expanding.
- Release claims are anchored to a specific, verifiable surface.

### Negative

- Broader-suite features (tasks, habits, calendar, journal, health, finances, projects, etc.) remain in the codebase but are not part of the MVP framing. This creates code that is not actively maintained or shipped.
- Contributors may be confused by the gap between what the code contains and what the MVP claims.

### Risks

- If the canonical MVP doc is not kept in sync with the implementation, the documentation trust problem recurs.
- The broader-suite code may rot if not exercised by tests or active development.

## Alternatives Considered

1. **Desktop local-first suite as MVP:** Would have framed tasks, habits, and dashboard as the MVP. Rejected because the weekly operating loop was the more focused, testable product story.

2. **No canonical frame:** Would have allowed multiple product definitions to coexist. Rejected because this was the root cause of scope drift and documentation conflicts.

3. **Archive broader suite entirely:** Would have removed all non-MVP code. Rejected because the broader suite represents future product potential and may be reactivated.

## References

- `plans/2026-03-19-mvp-boundary-audit.md` — the audit that identified the problem
- `plans/2026-03-20-canonical-mvp-doc-rewrite.md` — the rewrite that implemented this decision
- `docs/mvp/canonical-mvp.md` — the canonical MVP source of truth
- `docs/architecture-overview.md` — architecture framing
