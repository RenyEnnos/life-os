# Domain Pitfalls: Life OS

**Domain:** Personal Operating System
**Researched:** 2025-03-24

## Critical Pitfalls

### Pitfall 1: Sync Conflicts (Last-Write-Wins)
**What goes wrong:** User updates a habit on their phone offline, then updates the same habit on their PC. When both sync, one version is lost.
**Why it happens:** Standard REST APIs don't handle concurrent state updates well without a CRDT or Versioning.
**Consequences:** Data loss, user frustration.
**Prevention:** Use a `version` or `updated_at` column in Supabase and implement a client-side conflict resolution strategy (e.g., merge journals, but pick the newest for habit status).

### Pitfall 2: AI Latency and Blocking
**What goes wrong:** User waits 5 seconds for a "Quick Capture" result before they can do anything else.
**Why it happens:** LLM inference is slow (2s+).
**Consequences:** High friction, user abandons the feature.
**Prevention:** Show a "Capture Success" message immediately, process the AI in the background, and update the UI asynchronously when results are ready.

### Pitfall 3: Feature Bloat (The "Kitchen Sink" Problem)
**What goes wrong:** Adding Finances, University, Journal, etc. makes the app slow and cluttered.
**Why it happens:** Trying to do everything without a unified design language or clear boundaries.
**Consequences:** High maintenance, poor UX.
**Prevention:** Strict **Feature-Sliced Design (FSD)** and a unified **Widget-based Dashboard** to hide irrelevant complexity.

## Moderate Pitfalls

### Pitfall 4: Optimistic Update Desync
**What goes wrong:** UI shows "Habit Done" (optimistic), but the server returns an error (403/500). The UI flickers as it rolls back.
**Why it happens:** Network errors or validation failures.
**Prevention:** Use React Query's `onSettled` to force a refetch and ensure the server is the source of truth, but only after providing immediate feedback.

### Pitfall 5: Poor Offline State Support
**What goes wrong:** User opens the app on a plane, but the app shows a blank screen because it couldn't fetch the dashboard.
**Why it happens:** Lack of local cache persistence (IndexedDB).
**Prevention:** Implement `persistQueryClient` and PWA service workers for offline asset serving.

## Minor Pitfalls

### Pitfall 6: Heavy Asset Bundling
**What goes wrong:** App takes 10s to load on first visit due to large icons, charts, and AI libraries.
**Why it happens:** Not using dynamic imports or tree-shaking effectively.
**Prevention:** Code-split each feature module (e.g., load the Finances module only when the user navigates to it).

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Habits** | Heatmap calculation performance | Pre-calculate heatmap data in the DB or use a fast local client utility. |
| **Finances**| Floating point errors | Use cents (integers) or a library like `Dinero.js` for currency. |
| **University**| Complex GPA logic | Keep the logic on the client for "What-If" scenarios to avoid unnecessary API calls. |
| **AI Integration**| API Key leakage / Costs | Proxy all AI calls through the Express backend; implement strict usage quotas per user. |

## Sources

- [Post-mortem: Why Most Habit Trackers Fail (Community Forums)]
- [Supabase Performance Best Practices]
- [React Query Pitfalls (TanStack Blog)]
