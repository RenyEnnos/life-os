---
type: guide
status: active
last_updated: 2026-04-27
tags: [ai-agent, navigation]
---

# AI Context Map

Navigation hub for AI coding agents working on LifeOS. Read this file first to orient yourself, then follow the links based on your task.

## Quick Orientation

| Task | Read This |
|------|-----------|
| Understand the project | [CLAUDE.md](./CLAUDE.md) |
| Write correct code | [AGENTS.md](./AGENTS.md) |
| Match the design system | [DESIGN.md](./DESIGN.md) |
| Understand MVP scope | [docs/mvp/canonical-mvp.md](./docs/mvp/canonical-mvp.md) |
| API endpoints & contracts | [docs/api/README.md](./docs/api/README.md) |
| Architecture decisions | [docs/architecture/README.md](./docs/architecture/README.md) |
| Create a new feature | [docs/development/feature-module-guide.md](./docs/development/feature-module-guide.md) |
| Write tests | [docs/development/testing-guide.md](./docs/development/testing-guide.md) |
| Common tasks & recipes | [docs/development/common-tasks.md](./docs/development/common-tasks.md) |
| Electron-specific work | [docs/development/electron-guide.md](./docs/development/electron-guide.md) |
| Glossary of terms | [GLOSSARY.md](./GLOSSARY.md) |

## Context Window Budget

When working with limited context, read files in this priority order:

1. **CLAUDE.md** (~90 lines) — Always read first. Project overview, commands, architecture.
2. **AGENTS.md** (~200 lines) — Read before writing code. Patterns, conventions, anti-patterns.
3. **Task-specific doc** — Read the one relevant file from the table above.
4. **Source code** — Only read implementation files after understanding the patterns.

Avoid reading all docs at once. Prioritize based on your current task.

## Document Hierarchy

When documents conflict, follow this precedence order:

1. `docs/mvp/canonical-mvp.md` — Canonical MVP source of truth
2. `docs/mvp/route-map.md` — API contract
3. Source code — Implementation is authoritative
4. `CLAUDE.md` / `AGENTS.md` — Coding guidelines
5. Historical docs in `docs/archive/` — Superseded, do not use for current decisions

## File Map

```
LifeOS/
├── CLAUDE.md              → Project overview + commands
├── AGENTS.md              → Code patterns + conventions
├── DESIGN.md              → Design system (Digital Cockpit)
├── AI_CONTEXT_MAP.md      → This file
├── GLOSSARY.md            → Term definitions
├── docs/
│   ├── api/               → API endpoint documentation
│   ├── architecture/      → Architecture Decision Records
│   ├── development/       → Developer guides
│   └── mvp/               → Canonical MVP docs
```
