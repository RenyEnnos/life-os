---
type: decision
status: active
last_updated: 2026-04-27
tags: [architecture, decision-record]
---

# ADR-006: Documentation Precedence

## Status

Accepted

## Date

2026-03-20

## Context

The LifeOS repository accumulated documentation from multiple phases of development: early PRDs, desktop release readiness docs, MVP specs, route maps, and architecture overviews. These documents frequently contradicted each other:

- `MVP_DESKTOP_RELEASE_READINESS.md` said the MVP was desktop-only.
- `prd_v2.2.md` described a broad productivity platform.
- `docs/mvp/route-map.md` documented endpoints that did not exist in the implementation.
- `docs/architecture-overview.md` described a React + Express product, while the codebase also contained Electron.

There was no defined order for resolving conflicts between documents.

## Decision

A clear documentation precedence hierarchy is established:

1. **`docs/mvp/canonical-mvp.md`** — The authoritative source for MVP scope, product framing, and what is in/out of scope.
2. **`docs/mvp/route-map.md`** — The authoritative source for the implemented API contract and frontend routes.
3. **`api/app.ts` and `src/config/routes/index.tsx`** — The source code is the ground truth for what is actually implemented.
4. **Historical docs** — Any document that conflicts with the above is marked as superseded and treated as historical context only.

### Rules

- When a new document conflicts with a higher-precedence document, update the lower-precedence document or mark it superseded.
- Do not maintain parallel definitions of the MVP in multiple documents.
- New product requirements assume the canonical MVP boundary unless explicitly changed by the CEO.
- Engineering docs should reference the canonical MVP doc rather than redefining scope.

## Consequences

### Positive

- Eliminates contradictory documentation by defining a clear resolution order.
- New contributors can find the authoritative source quickly.
- Prevents scope drift by anchoring all decisions to one canonical document.
- Historical context is preserved but clearly labeled as non-authoritative.

### Negative

- Requires discipline to maintain: new documents must be checked against the precedence hierarchy.
- Some historical documents may become confusing if their superseded status is not obvious.

### Risks

- If the canonical MVP doc is not updated when scope changes, the precedence hierarchy itself becomes a source of confusion.
- Contributors may not read the precedence rules and assume all docs are equally authoritative.

## Alternatives Considered

1. **No precedence rules:** Would have allowed each document to be self-authoritative. Rejected because this was the root cause of documentation conflicts.

2. **Single-document approach:** Would have consolidated everything into one document. Rejected because different concerns (scope, API contract, architecture) need separate documents.

3. **Code-only truth:** Would have treated the source code as the only source of truth. Rejected because product decisions and architectural context need documented rationale.

## References

- `docs/mvp/canonical-mvp.md` — the canonical MVP source of truth
- `docs/mvp/route-map.md` — the route map
- `docs/architecture-overview.md` — architecture framing
- `plans/2026-03-20-canonical-mvp-doc-rewrite.md` — the rewrite that established this hierarchy
