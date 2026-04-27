---
type: decision
status: active
last_updated: 2026-04-27
tags: [architecture, decision-record]
---

# ADR-005: Release Verification Gates

## Status

Accepted

## Date

2026-03-21

## Context

The project had multiple test lanes (unit, integration, Playwright browser, Playwright Electron) but no clear definition of which lanes constituted release evidence. This led to:

- Quarantined browser Playwright tests being mistaken for release coverage.
- Confusion about whether `npm run test:e2e` ran browser tests or Electron smoke tests.
- No regression protection for the release gate wiring itself.

The release verification audit (`docs/release-verification-ladder.md`) identified these issues and defined a clear lane structure.

## Decision

Release verification is organized into four lanes with strict evidence rules:

### Lane Definitions

| Lane | Command | Purpose | Release Evidence |
|------|---------|---------|-----------------|
| Electron Smoke | `npm run test:e2e` | Authoritative release gate | Yes |
| Unit/Integration | `npm run test` | Regression protection | Yes |
| Type Check | `npm run typecheck` | Static verification | Yes |
| Lint | `npm run lint` | Static verification | Yes |
| Browser Advisory | `npm run test:e2e:advisory` | Triage and future rewrite | **No** |

### Release Ladder

The following commands must pass in order before any release claim:

1. `npm run test:e2e` (Electron smoke)
2. `npm run test` (unit + integration)
3. `npm run typecheck`
4. `npm run lint`

### Regression Protection

A regression test (`src/shared/lib/__tests__/releaseGate.test.ts`) protects the gate wiring:
- Fails if `npm run test:e2e` is pointed at the browser config.
- Fails if smoke tests leak into the advisory lane.

## Consequences

### Positive

- Clear, unambiguous release criteria: every release claim can be traced to specific passing lanes.
- Regression protection prevents accidental gate degradation.
- Advisory browser tests are explicitly quarantined and cannot be cited as release evidence.
- Team members can confidently determine whether a build is release-ready.

### Negative

- Advisory browser tests receive less attention and may rot further.
- Adding new release gates requires updating the regression test.

### Risks

- If the regression test is removed or bypassed, the gate wiring could silently degrade.
- Advisory tests may accumulate technical debt if not periodically reviewed.

## Alternatives Considered

1. **Merge smoke and browser tests into one lane:** Would have simplified the test matrix but would have reintroduced the quarantine problem. Rejected because browser tests are not reliable release evidence.

2. **No regression protection for gates:** Would have been simpler but risked silent gate degradation. Rejected because the team had already experienced gate wiring drift.

3. **Automated release pipeline:** Would have enforced the ladder automatically. Considered for future implementation but not required for the current team size.

## References

- `docs/release-verification-ladder.md` — the full release verification specification
- `src/shared/lib/__tests__/releaseGate.test.ts` — regression test for gate wiring
- `playwright.release.config.ts` — Electron smoke test configuration
- `CLAUDE.md` — essential commands
