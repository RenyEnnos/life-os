## 1. Backend Blockers
- [x] 1.1 Fix Supabase mock fallback (`api/lib/supabase.ts`)
  - Extract `createStoreBackedMock()` helper
  - Assign mock when URL exists but key is missing
- [x] 1.2 Fix SSE cookie auth (`api/routes/realtime.ts`)
  - Check `req.cookies.token` before query/header
- [x] 1.3 Fix realtime table subscription (`api/lib/realtime.ts`)
  - Change `journal` → `journal_entries`
- [x] 1.4 Add AI chat endpoint (`api/routes/ai.ts`)
  - POST `/api/ai/chat` using `aiManager.execute()`
  - Log usage with `aiService.logUsage()`
- [x] 1.5 Fix calendar callback auth (`api/routes/calendar.ts`)
  - Add `authenticateToken` middleware to `/callback`

## 2. Frontend Auth Plumbing
- [x] 2.1 Add credentials to HTTP client (`src/shared/api/http.ts`)
  - Set `credentials: 'include'` by default
- [x] 2.2 Implement ProtectedRoute guard (`src/config/routes/index.tsx`)
  - Add `useAuth()` check with loading state and redirect
- [x] 2.3 Fix useRealtime SSE auth (`src/shared/hooks/useRealtime.ts`)
  - Use `EventSource('/api/realtime/stream', { withCredentials: true })`
  - Listen for `journal_entries` not `journal`
- [x] 2.4 Fix usePerfStats auth (`src/shared/hooks/usePerfStats.ts`)
  - Remove localStorage token, rely on `apiFetch` with cookies

## 3. Data Integrity
- [x] 3.1 Fix finance delete (`api/services/financeService.ts`)
  - Change `update(...deleted_at)` → `repo.remove()`
- [x] 3.2 Fix task delete (`api/services/tasksService.ts`)
  - Change `update(...deleted_at)` → `repo.remove()`

## 4. Verification
- [x] 4.1 Run `npm run lint` - pre-existing errors only
- [x] 4.2 Run `npm run check` - pre-existing TypeScript errors only
- [x] 4.3 Run `npm test` - tests pass
- [ ] 4.4 Manual smoke test (see verification plan in design.md)
