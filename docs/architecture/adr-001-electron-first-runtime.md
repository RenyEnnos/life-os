---
type: decision
status: active
last_updated: 2026-04-27
tags: [architecture, decision-record]
---

# ADR-001: Electron-First Runtime

## Status

Accepted

## Date

2026-03-19

## Context

LifeOS was originally framed as a general productivity suite with web, desktop, and mobile targets. As development progressed, the team needed to decide which runtime would be the primary target for the MVP.

Key forces:

- The broader-suite desktop release docs (`MVP_DESKTOP_RELEASE_READINESS.md`) declared desktop local-first as the MVP story.
- The canonical MVP framing (`docs/mvp/canonical-mvp.md`) chose the invite-only weekly operating loop, which defaults to `npm run dev` (Vite web server).
- The Electron codebase exists with IPC handlers, preload scripts, and SQLite integration already built.
- The team is small and cannot maintain feature parity across web and Electron simultaneously.

## Decision

The Electron desktop application is the **primary runtime**. The React web app (Vite) serves as a development environment and future web target, but all production release claims are tied to the Electron desktop build.

The weekly operating loop MVP is implemented and shipped as an Electron desktop application.

## Consequences

### Positive

- Single release target reduces QA and packaging complexity.
- Native SQLite access via `better-sqlite3` in the main process gives reliable offline-first storage.
- Electron context isolation provides a security boundary between renderer and main process.
- No need to maintain a separate backend server for local-first usage.

### Negative

- Web-based features (browser deployment) are deprioritized and may drift out of sync.
- Contributors must install and run Electron locally, which increases the onboarding barrier.
- Playwright browser tests are quarantined and cannot serve as release evidence.

### Risks

- If the team later decides to ship a web version, significant rework may be needed to decouple from Electron IPC.
- Developer experience is tied to Electron tooling, which is heavier than a plain Vite dev server.

## Alternatives Considered

1. **Web-first with optional Electron wrapper:** Would have prioritized the browser runtime and wrapped it in Electron later. Rejected because the team needed offline-first SQLite storage and native desktop integration for the MVP.

2. **Mobile-first with Capacitor:** The repo contains Capacitor/Android code as a future perspective. Rejected for the MVP because the desktop workflow better matches the weekly operating loop use case.

3. **Split runtime (web + Electron equally):** Would have maintained feature parity across both. Rejected due to team capacity constraints.

## References

- `docs/mvp/canonical-mvp.md` — canonical MVP scope
- `docs/MVP_DESKTOP_RELEASE_READINESS.md` — desktop release framing
- `CLAUDE.md` — project overview and architecture
- `electron/preload.ts` — context isolation implementation
