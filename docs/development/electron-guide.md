---
type: guide
status: active
last_updated: 2026-04-27
tags: [development, guide]
---

# Electron Guide

## Architecture Overview

LifeOS runs as an Electron desktop application with three process layers:

```
┌─────────────────────────────────────────┐
│           Main Process                   │
│  electron/main.ts                        │
│  ├── IPC Handlers (electron/ipc/)        │
│  ├── Database (electron/db/)             │
│  ├── Sync Engine (electron/sync/)        │
│  └── Window Management                   │
├─────────────────────────────────────────┤
│           Preload Script                 │
│  electron/preload.ts                     │
│  └── contextBridge.exposeInMainWorld     │
├─────────────────────────────────────────┤
│           Renderer Process               │
│  React + Vite + TypeScript               │
│  └── window.api.* (IPC bridge)           │
└─────────────────────────────────────────┘
```

## Main Process

The main process (`electron/main.ts`) is the Node.js backend. It:

- Creates and manages the BrowserWindow
- Registers IPC handlers
- Initializes the SQLite database
- Manages the sync engine
- Handles system notifications

### Window Creation

```typescript
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
  },
});
```

### Key Settings

- `contextIsolation: true` -- Renderer cannot access Node.js APIs
- `nodeIntegration: false` -- No Node.js in renderer
- `sandbox: true` -- Renderer runs in sandboxed environment

## Preload Script

The preload script (`electron/preload.ts`) bridges the renderer and main process using `contextBridge`:

```typescript
import { contextBridge, ipcRenderer } from 'electron';

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
});
```

### API Surface

| Namespace | Methods |
|-----------|---------|
| `electron` | `notify`, `scheduleNotification`, `cancelNotification`, `getAppInfo` |
| `api.auth` | `check`, `login`, `register`, `logout`, `resetPassword`, `updatePassword`, `getProfile` |
| `api.tasks` | `getAll`, `create`, `update`, `delete` |
| `api.mvp` | `getWorkspace`, `saveOnboarding`, `generateWeeklyPlan`, `confirmPlan`, `updateActionStatus`, `saveDailyCheckIn`, `addReflection`, `submitFeedback`, `resetWorkspace` |
| `api.invokeResource` | Generic resource handler for future features |
| `api.legacy` | `request` (HTTP fallback for legacy endpoints) |

## IPC Handlers

Handlers are registered in `electron/ipc/` and delegate to repositories:

```typescript
// electron/ipc/tasks.ts
import { ipcMain } from 'electron';
import { getDb } from '../db/database';

ipcMain.handle('tasks:getAll', async (event) => {
  const db = getDb();
  const tasks = db.prepare('SELECT * FROM tasks WHERE is_deleted = 0').all();
  return tasks;
});

ipcMain.handle('tasks:create', async (event, task) => {
  const db = getDb();
  const id = `task_${Date.now()}`;
  db.prepare(`
    INSERT INTO tasks (id, user_id, title, status, priority)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, task.userId, task.title, task.status || 'todo', task.priority || 'medium');
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
});
```

### IPC Channel Naming

Convention: `resource:action`

- `tasks:getAll`
- `tasks:create`
- `tasks:update`
- `tasks:delete`
- `mvp:getWorkspace`
- `mvp:saveOnboarding`
- `auth:check`
- `auth:login`

## BaseRepository

The `BaseRepository` in `electron/db/` provides common database operations:

```typescript
class BaseRepository {
  protected db: Database.Database;

  constructor() {
    this.db = getDb();
  }

  protected findAll(table: string, userId: string) {
    return this.db.prepare(
      `SELECT * FROM ${table} WHERE user_id = ? AND is_deleted = 0`
    ).all(userId);
  }

  protected findById(table: string, id: string) {
    return this.db.prepare(
      `SELECT * FROM ${table} WHERE id = ? AND is_deleted = 0`
    ).get(id);
  }

  protected softDelete(table: string, id: string) {
    this.db.prepare(
      `UPDATE ${table} SET is_deleted = 1, version = version + 1, updated_at = datetime('now') WHERE id = ?`
    ).run(id);
  }
}
```

### Schema Management

Tables are created and migrated inline via `PRAGMA table_info` checks:

```typescript
const ensureColumn = (tableName: string, columnSql: string, columnName: string) => {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (!columns.some(col => col.name === columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
  }
};
```

## Sync Engine

The sync engine (`electron/sync/`) provides optional cloud synchronization:

### How It Works

1. Local mutations are recorded in the `sync_queue` table.
2. When online, the sync engine processes the queue.
3. Conflicts are resolved using last-write-wins with version tracking.
4. Remote changes are pulled and applied locally.

### Enabling Sync

Set the environment variables:

```bash
VITE_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhb...[ANON_KEY]"
```

### Tables with Sync Support

- `tasks`
- `habits`
- `journal_entries`
- `university_courses`
- `university_assignments`
- `transactions`
- `health_metrics`
- `medication_reminders`

## Context Isolation

Context isolation is a critical security boundary:

- The renderer process runs in a sandboxed environment.
- No direct access to Node.js APIs, file system, or native modules.
- All communication goes through the preload script's IPC bridge.
- `window.electron` and `window.api` are the only bridges to native functionality.

This prevents:

- XSS attacks from accessing the file system
- Malicious scripts from executing native code
- Unauthorized access to system resources

## Packaging

### Development

```bash
npm run electron:dev    # Starts Electron with Vite dev server
```

### Production Build

```bash
npm run electron:build  # Packages Electron for distribution
```

Output is in the `release/` directory.

### Build Configuration

Electron Builder configuration is in `electron-builder.yml`:

- **Target platforms:** Windows (NSIS), macOS (DMG), Linux (AppImage)
- **App ID:** `com.lifeos.app`
- **Compression:** LZMA

### CI/CD

The CI pipeline runs:

1. `npm ci`
2. `typecheck`
3. `lint`
4. `test`
5. `build`
6. `electron:build`
7. Playwright smoke tests

## Debugging

### Main Process

- Open DevTools in the Electron window: `Ctrl+Shift+I` (or `Cmd+Option+I` on macOS)
- Console logs from the main process appear in the terminal
- Set `VERBOSE=true` for detailed logging

### Renderer Process

- Standard browser DevTools (F12)
- React DevTools extension works in Electron

### IPC Debugging

Add logging to IPC handlers:

```typescript
ipcMain.handle('tasks:getAll', async (event) => {
  console.log('IPC: tasks:getAll called');
  // ... handler logic
});
```
