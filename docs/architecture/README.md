---
type: architecture
status: active
last_updated: 2026-04-27
tags: [architecture]
---

# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) documenting key technical decisions made in the LifeOS project.

## Index

| ADR   | Title                        | Status   | Date        |
| ----- | ---------------------------- | -------- | ----------- |
| [ADR-001](./adr-001-electron-first-runtime.md) | Electron-First Runtime       | Accepted | 2026-03-19  |
| [ADR-002](./adr-002-sqlite-local-storage.md)   | SQLite Local Storage         | Accepted | 2026-03-19  |
| [ADR-003](./adr-003-canonical-mvp-boundary.md)  | Canonical MVP Boundary       | Accepted | 2026-03-20  |
| [ADR-004](./adr-004-file-backed-repository.md)  | File-Backed Repository       | Accepted | 2026-03-19  |
| [ADR-005](./adr-005-release-verification-gates.md) | Release Verification Gates | Accepted | 2026-03-21  |
| [ADR-006](./adr-006-documentation-precedence.md) | Documentation Precedence   | Accepted | 2026-03-20  |

## About ADRs

We follow the lightweight ADR format described by Michael Nygard. Each record captures:

- The forces at play when the decision was made
- What was decided
- The consequences of that decision
- Alternatives that were considered

ADRs are **immutable once accepted**. If a decision is reversed, a new ADR is created referencing the old one, rather than editing the original.
