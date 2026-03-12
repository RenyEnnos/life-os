# Life OS (Desktop-First Architecture)

Life OS is a comprehensive personal productivity and management application originally built as a web app, now refactored into a local-first desktop application using Electron.

## Visionary Architecture 🚀

We moved away from a traditional HTTP REST backend (`/api`) pattern. The current architecture focuses on a local-first desktop experience:

1. **Electron Main Process:** Acts as our "Backend".
2. **Local SQLite (`better-sqlite3`):** App data is written to a local disk database for low-latency desktop usage.
3. **IPC Communication:** The React frontend communicates directly with the local database via Electron IPC (`window.api`).
4. **Optional Sync Layer:** Sync code exists in `electron/sync/engine.ts`, but it depends on desktop Supabase session/configuration and should not be treated as guaranteed MVP behavior out of the box.
5. **MVP Runtime Expectation:** Treat the default MVP as a local-first desktop app unless cloud sync is explicitly configured and validated for your environment.

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd life-os
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # Native dependencies like better-sqlite3 will build for your platform
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory if you need Supabase-backed auth or want to validate desktop sync:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    For the current MVP, local desktop usage is the default expectation. Sync is only available when the desktop Supabase flow is configured correctly.

4.  **Run the Desktop app:**
    ```bash
    npm run dev
    ```

## Development

- `src/features/*`: Contains React features fetching data via `window.api`.
- `electron/main.ts`: Main process entry.
- `electron/db/database.ts`: SQLite schema and setup.
- `electron/sync/engine.ts`: Supabase background sync.
- `electron/ipc/*`: IPC handlers for the frontend.

## License
MIT
