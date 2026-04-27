---
type: guide
status: active
last_updated: 2026-04-27
tags: [development, guide]
---

# LifeOS Developer Guide

This directory contains comprehensive documentation for developers working on the LifeOS codebase.

## Guides

| Guide | Description |
|-------|-------------|
| [Getting Started](./getting-started.md) | Prerequisites, quick start, and first contribution |
| [Architecture Deep Dive](./architecture-deep-dive.md) | Dual data layer, IPC, sync engine, state management |
| [Feature Module Guide](./feature-module-guide.md) | Module structure, creating new modules, patterns |
| [Testing Guide](./testing-guide.md) | Unit, integration, e2e, and storybook testing |
| [Electron Guide](./electron-guide.md) | Main/preload/renderer, IPC, packaging |
| [Common Tasks](./common-tasks.md) | Decision trees for common development tasks |

## Quick Reference

### Essential Commands

```bash
npm run electron:dev     # Start Electron desktop app (primary)
npm run dev              # Start web app (Vite + Express)
npm run build            # Production build
npm run typecheck        # TypeScript check
npm run lint             # ESLint check
npm run test             # All tests
npm run test:e2e         # Electron smoke tests
```

### Project Structure

```
src/
  app/              # App shell, layout, navigation
  config/routes/    # Route definitions
  features/         # Feature modules (21 modules)
  shared/           # Shared UI, lib, stores, api, hooks, schemas, types
api/                # Express API server
electron/           # Electron main/preload, SQLite, IPC
```

### Key Conventions

- **Class merging:** Always use `cn()` from `@/shared/lib/cn`
- **Component variants:** Use `class-variance-authority` (cva)
- **State:** Zustand stores with `persist` middleware
- **Data fetching:** TanStack React Query
- **Routing:** HashRouter (Electron primary), BrowserRouter (web fallback)
- **Styling:** Tailwind with semantic tokens, dark mode via `class` strategy
