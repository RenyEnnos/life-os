---
type: guide
status: active
last_updated: 2026-04-27
tags: [development, guide]
---

# Architecture Deep Dive

## Overview

LifeOS is an Electron-first desktop application with an offline-first architecture. All data is stored locally in SQLite, with optional Supabase cloud sync.

```
┌─────────────────────────────────────────────┐
│              Renderer Process               │
│  React + Vite + TypeScript                  │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Features │  │  Shared  │  │    App     │ │
│  │ (21 mod) │  │ UI/Lib/  │  │  Shell/    │ │
│  │          │  │ Stores   │  │  Routes    │ │
│  └────┬─────┘  └────┬─────┘  └────────────┘ │
│       │              │                       │
│       └──────┬───────┘                       │
│              │ window.api (IPC)              │
├──────────────┼──────────────────────────────┤
│              │ Preload Script                │
│              │ contextBridge.exposeInMainWorld│
├──────────────┼──────────────────────────────┤
│              │ Main Process                  │
│  ┌───────────┴──────────────────────────┐   │
│  │ IPC Handlers (electron/ipc/)         │   │
│  ├──────────────────────────────────────┤   │
│  │ BaseRepository (electron/db/)        │   │
│  ├──────────────────────────────────────┤   │
│  │ SQLite (better-sqlite3)              │   │
│  │ lifeos.db in userData                │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │ Sync Engine (electron/sync/)         │   │
│  │ Optional Supabase sync               │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Dual Data Layer

LifeOS operates with two distinct data layers:

### 1. Electron IPC (Primary)

The primary data layer communicates via Electron IPC. The renderer process calls `window.api.*` methods, which are defined in the preload script and handled by IPC handlers in the main process.

```
Renderer: window.api.tasks.getAll()
    → Preload: ipcRenderer.invoke('tasks:getAll')
    → Main: IPC handler → BaseRepository → SQLite
```

### 2. Express API (Development/Web)

For web development and the API server, an Express server (`api/app.ts`) provides REST endpoints. This uses file-backed or Prisma-backed repositories.

```
Client: fetch('/api/mvp/workspace')
    → Express: auth middleware → MvpRepository → file/Prisma
```

## IPC Pattern

### Preload Script (`electron/preload.ts`)

The preload script uses `contextBridge.exposeInMainWorld` to expose a typed API surface:

```typescript
contextBridge.exposeInMainWorld('api', {
  auth: {
    check: () => ipcRenderer.invoke('auth:check'),
    login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
    // ...
  },
  tasks: {
    getAll: () => ipcRenderer.invoke('tasks:getAll'),
    create: (task) => ipcRenderer.invoke('tasks:create', task),
    // ...
  },
  mvp: {
    getWorkspace: () => ipcRenderer.invoke('mvp:getWorkspace'),
    // ...
  },
  invokeResource: (resource, action, ...args) =>
    ipcRenderer.invoke('resource:invoke', resource, action, ...args),
})
```

### IPC Handlers (`electron/ipc/`)

Handlers register with `ipcMain.handle()` and delegate to repository methods:

```typescript
ipcMain.handle('tasks:getAll', async (event) => {
  const userId = getCurrentUserId(event);
  return repository.getAll(userId);
});
```

### Key Principles

- **Context isolation:** Renderer cannot access Node.js APIs directly.
- **Narrow API surface:** Only explicitly exposed methods are available.
- **Typed contracts:** Preload types match IPC handler expectations.

## Sync Engine

The sync engine (`electron/sync/`) provides optional cloud synchronization with Supabase:

- **Offline-first:** All operations work against local SQLite.
- **Sync queue:** Mutations are queued in `sync_queue` table when offline.
- **Conflict resolution:** Last-write-wins with version tracking.
- **Opt-in:** Only active when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured.

## Feature Module Pattern

Each feature follows a consistent structure:

```
src/features/[name]/
  api/              # API call functions
  components/       # Feature-specific components
  hooks/            # React Query hooks
  __tests__/        # Feature tests
  types.ts          # Feature-specific types
  index.tsx         # Feature page/entry point
```

See [Feature Module Guide](./feature-module-guide.md) for details.

## State Management

### Zustand Stores (`src/shared/stores/`)

Global state is managed via Zustand with `persist` middleware:

- `auth` store: user session and authentication state
- `theme` store: dark/light mode preference
- `onboarding` store: onboarding flow state

### TanStack React Query

Server state is managed via React Query:

- Custom hooks per feature (e.g., `useTasks`, `useHabits`)
- Query invalidation on mutations
- Persistent cache for offline support

### Local Form State

Form state uses React `useState` or `useForm` (react-hook-form where applicable).

## Routing

- **HashRouter** (primary for Electron): `/#/mvp`, `/#/tasks`, etc.
- **BrowserRouter** (web fallback): `/mvp`, `/tasks`, etc.
- Routes are lazy-loaded via `React.lazy()`.
- Route definitions in `src/config/routes/index.tsx`.

## Design System

The "Digital Cockpit" aesthetic:

- **Background:** `#050505` (OLED Black)
- **Surface:** `rgba(24, 24, 27, 0.4)` with `backdrop-blur-xl`
- **Primary:** `#308ce8` (Electric Blue)
- **Border:** `rgba(255, 255, 255, 0.05)`
- **Font:** Inter with `font-feature-settings: "cv11", "cv05", "ss01"`

See `DESIGN.md` for the full design specification.
