# Change: Fix Critical Auth, Realtime & Data Integrity Bugs

## Why
The codebase has 10 high-impact bugs blocking authentication, realtime streaming, AI chat, and proper data deletion. The audit identified blocker-level issues that break login flows, SSE connections, and silently fail delete operations.

## What Changes

### Backend Blockers
- **BLOCKER** `api/lib/supabase.ts` - Fix Supabase mock fallback when URL exists but key is missing (currently left `undefined`)
- `api/routes/realtime.ts` - Accept JWT from HttpOnly cookie (not just query/header)
- `api/lib/realtime.ts` - Fix table subscription from `journal` → `journal_entries`
- `api/routes/ai.ts` - Add missing `POST /api/ai/chat` endpoint (frontend calls it but it doesn't exist)
- `api/routes/calendar.ts` - Add `authenticateToken` middleware to `/callback` route

### Frontend Auth Plumbing
- `src/shared/api/http.ts` - Add `credentials: 'include'` to ensure cookies are sent
- `src/config/routes/index.tsx` - Implement actual ProtectedRoute guard (currently a no-op)
- `src/shared/hooks/useRealtime.ts` - Use `withCredentials` for EventSource (not localStorage token)
- `src/shared/hooks/usePerfStats.ts` - Remove legacy localStorage token dependency

### Data Integrity
- `api/services/financeService.ts` - Change `remove()` from soft-delete to `repo.remove()` (hard delete)
- `api/services/tasksService.ts` - Change `remove()` from soft-delete to `repo.remove()` (hard delete)

> [!WARNING]
> **Breaking change**: Finance and task deletions will now hard-delete records instead of soft-delete. This matches user expectations when they click "delete".

## Impact
- **Affected specs**: None yet defined (creating new specs for these capabilities)
- **Affected code**: 
  - Backend: `api/lib/supabase.ts`, `api/routes/realtime.ts`, `api/lib/realtime.ts`, `api/routes/ai.ts`, `api/routes/calendar.ts`, `api/services/financeService.ts`, `api/services/tasksService.ts`
  - Frontend: `src/shared/api/http.ts`, `src/config/routes/index.tsx`, `src/shared/hooks/useRealtime.ts`, `src/shared/hooks/usePerfStats.ts`
