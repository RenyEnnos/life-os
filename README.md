# Life OS (Desktop-First Architecture)

Life OS is a comprehensive personal productivity and management application originally built as a Web App, now completely refactored into a **Zero-Latency Offline-First Desktop Application** using Electron.

## Visionary Architecture 🚀

We decided to move away from a traditional HTTP REST backend (`/api`) pattern. The new architecture focuses on a **Local-First**, native Desktop experience:

1. **Electron Main Process:** Acts as our "Backend".
2. **Local SQLite (`better-sqlite3`):** All data is saved instantaneously to a local disk database, eliminating loading spinners and fetch latency.
3. **IPC Communication:** The React frontend communicates directly with the local database via Electron IPC (`window.api`).
4. **Background Sync Engine:** A worker runs silently in the background of the Main Process pushing Deltas to Supabase (our Cloud layer) and listening for real-time changes using WebSockets.
5. **Offline Support:** You have full functionality even without internet access. Data is queued and pushed to Supabase when connectivity is restored.

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
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the Desktop app:**
    ```bash
    npm run dev &
    ```

## Development

- `src/features/*`: Contains React features fetching data via `window.api`.
- `electron/main.ts`: Main process entry.
- `electron/db/database.ts`: SQLite schema and setup.
- `electron/sync/engine.ts`: Supabase background sync.
- `electron/ipc/*`: IPC handlers for the frontend.

## License
MIT
