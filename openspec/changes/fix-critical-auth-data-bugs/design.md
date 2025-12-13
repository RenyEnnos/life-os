## Context
The application uses HttpOnly cookies for JWT auth but multiple frontend and backend components bypass this pattern. Backend realtime also subscribes to wrong table names. AI chat endpoint was never implemented despite frontend calling it.

## Goals
- Restore authentication flow so login/logout work with HttpOnly cookies
- Fix SSE realtime to authenticate via cookies and subscribe to correct tables
- Make deletions actually delete records (or filter soft-deleted properly)
- Add missing AI chat endpoint

## Non-Goals
- Implementing full soft-delete with proper filtering (choosing hard delete for simplicity)
- Adding retry/backoff logic to HTTP client (future enhancement)
- Streaming AI responses (future enhancement)

## Decisions

### Decision 1: Hard delete over soft delete
- **What**: Change `financeService.remove()` and `tasksService.remove()` to use `repo.remove()` 
- **Why**: Current soft-delete sets `deleted_at` but list operations don't filter it, causing "deleted" items to persist. Hard delete is simpler and matches user expectations.
- **Alternatives**: Implement proper soft-delete with filtering. Rejected: more changes, unclear business need.

### Decision 2: SSE auth via cookies first
- **What**: Check `req.cookies.token` before query/header in realtime route
- **Why**: Frontend will use `withCredentials: true` for EventSource; HttpOnly cookie is the standard auth mechanism.
- **Alternatives**: Keep query param only. Rejected: exposes token in URL logs.

### Decision 3: Extract mock creation helper in supabase.ts
- **What**: Create `createStoreBackedMock()` helper and reuse for both "no URL" and "URL but no key" cases
- **Why**: Reduces duplication and ensures consistent behavior. Currently the "no key" case logs a warning but doesn't actually assign the mock.
- **Alternatives**: Inline the mock again. Rejected: DRY violation.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Hard deletes are irreversible | Users expect delete to delete; add soft-delete later with proper UI if needed |
| Cookie auth for SSE requires CORS setup | Same-origin via Vite proxy handles this |
| ProtectedRoute redirect may flash content | Added loading state with Loader component |

## Migration Plan
1. Apply all changes atomically (no migrations needed)
2. If issues arise, rollback individual file changes
3. No database schema changes required

## Open Questions
- Should we add tests for EventSource cookie auth? (Complex to mock)
