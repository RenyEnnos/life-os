> Superseded on 2026-03-20 by `docs/mvp/canonical-mvp.md`.
>
> The backlog assumptions in this file are tied to the previous desktop-first MVP framing.

# Post-MVP Backlog

This document captures work for after the shipped desktop local-first MVP.

It is not part of the current release scope. It must not be treated as a launch blocker for the audited desktop local-first MVP.

## Release Boundary

- Current shipped scope: verified Electron desktop runtime, local SQLite storage, IPC-backed flows, and the audited desktop local-first MVP path.
- Not current blockers: the tracks below stay outside release notes, launch checklist gating, and MVP go/no-go messaging.
- Use this file only as the follow-up backlog for the next phase.

## Post-MVP Tracks

### Sync and Cloud Readiness

- Validate desktop sync against a real Supabase-backed environment.
- Prove config, session handling, conflict behavior, and recovery paths.
- Define the evidence needed before any sync or cloud-backed claim is added to product messaging.

### Browser and Web Surface

- Decide whether a browser or web surface should exist beyond the desktop runtime.
- Rework runtime assumptions, coverage, and release messaging if a web path is pursued.
- Do not treat browser-oriented coverage as MVP desktop evidence.

### Production Auth Hardening

- Prove Supabase auth in a production-like desktop setup, not only smoke mode.
- Harden session restore, login UX, environment setup, and failure handling for real deployments.
- Keep production-auth claims out of the current MVP until that proof exists.

## Scope Reminder

Sync, Browser, and Auth hardening remain later-phase backlog tracks. They are explicitly separated from the shipped desktop local-first MVP and do not reopen the current release decision.
