---
type: guide
status: active
last_updated: 2026-04-27
tags: [claude-code, ai-agent, overview]
---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> For detailed code patterns, naming conventions, anti-patterns, and code examples, see [AGENTS.md](./AGENTS.md).

## Project Overview

LifeOS is an **Electron-first** desktop application with offline-first architecture. All data is stored locally in SQLite via `better-sqlite3`, with optional Supabase cloud sync. Web and Android/Capacitor versions exist in the codebase as future perspectives but are not the primary runtime.

The canonical MVP framing lives in `docs/mvp/canonical-mvp.md` — if another document disagrees, treat it as stale.

## Essential Commands

```bash
npm run electron:dev     # Start Electron desktop app (primary)
npm run dev              # Start web app (Vite on :5173 + Express on :3001) — future perspective
npm run electron:build   # Package Electron app for distribution
npm run build            # Production web build (runs typecheck + lint via prebuild)

npm run typecheck        # tsc --noEmit
npm run lint             # eslint .
npm run test             # vitest run (all unit/integration tests)
npm run test:watch       # vitest in watch mode
npm run test:integration # only .int.test.tsx files in features
npm run test:e2e         # Playwright release smoke tests (authoritative)
npm run test:e2e:advisory # Playwright multi-browser (advisory only)

npm run storybook        # Storybook dev on port 6006
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate:dev # Run Prisma migrations
```

**Run a single test:**
```bash
npx vitest run path/to/test.test.ts
npx vitest run --pattern "tasks"
```

## Architecture

**Primary runtime: Electron Desktop** — React frontend in Renderer process, Express-free data layer via IPC to Main process with SQLite (`better-sqlite3`).

- **Electron (primary):** `vite-plugin-electron`, communication via IPC (`window.api`), not HTTP. Data stored locally in SQLite.
- **Web (future):** Vite dev server proxies `/api` to Express on port 3001
- **Capacitor/Android (future):** `android:dev` / `android:build` scripts

```
src/
  app/              # App shell: App.tsx, layout (Sidebar, NavigationSystem, MobileBottomNav)
  config/routes/    # Route definitions, access control
  features/         # 21 feature modules (mvp, tasks, habits, dashboard, etc.)
  shared/
    ui/             # Shared UI components (Button, Card, BentoCard, Modal, etc.)
    lib/            # Utilities (cn.ts is the canonical class-merge utility)
    stores/         # Zustand stores (auth, theme, onboarding, etc.)
    api/            # API client (fetchJSON, ipcClient)
    hooks/          # Shared React hooks
    schemas/        # Zod validation schemas
    types/          # TypeScript type definitions
api/                # Express server (app.ts, server.ts, repositories)
electron/           # Electron main/preload, SQLite via better-sqlite3, IPC handlers
```

**Feature module pattern:**
```
src/features/[name]/
  api/              # API call functions (feature.api.ts)
  components/       # Feature-specific components
  hooks/            # React Query hooks (useFeature.ts)
  __tests__/        # Feature tests
  types.ts          # Feature-specific types
  index.tsx         # Feature page/entry point
```

## Key Patterns (Quick Reference)

| Pattern | Implementation |
|---------|---------------|
| Class merging | `cn()` from `@/shared/lib/cn` (clsx + tailwind-merge) |
| Component variants | `class-variance-authority` (cva) — see `Button.tsx` |
| State | Zustand stores in `src/shared/stores/` with `persist` middleware + IndexedDB |
| Data fetching | TanStack React Query with persistence; custom hooks per feature |
| API client | `fetchJSON` from `@/shared/api/http` with auth token injection |
| Electron detection | `isDesktopApp()` / `isElectronRuntime()` from `@/shared/lib/platform` |
| Routing | `HashRouter` (primary, Electron), `BrowserRouter` (web fallback); lazy-loaded pages |
| Styling | Tailwind with semantic tokens (`bg-background`, `text-foreground`), dark mode via `class` strategy |

## Design System

Design follows a "Digital Cockpit" aesthetic — OLED black, glassmorphism, high contrast. Full spec in `DESIGN.md`. Key tokens:

- Background: `#050505` (OLED Black)
- Surface: `rgba(24, 24, 27, 0.4)` with `backdrop-blur-xl`
- Primary: `#308ce8` (Electric Blue)
- Border: `rgba(255, 255, 255, 0.05)`
- Font: Inter with `font-feature-settings: "cv11", "cv05", "ss01"`

## CI Quality Gate

Runs on push/PR to `main`: `npm ci` → `typecheck` → `lint` → `test` → `build` → `electron:build` → Playwright smoke. Requires `LIFEOS_SESSION_SECRET` and `JWT_SECRET` env vars. Lockfile must be `package-lock.json`.
