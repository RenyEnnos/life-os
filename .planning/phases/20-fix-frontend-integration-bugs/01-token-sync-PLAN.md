---
wave: 1
depends_on: []
files_modified: [src/features/auth/contexts/AuthContext.tsx, src/shared/api/authToken.ts]
requirements: [FIX-02]
autonomous: true
---

# Plan: Token Synchronization Infrastructure

Implement automatic synchronization between Supabase Auth session and the local HTTP client's storage.

## User Review Required

> [!IMPORTANT]
> This change ensures the local Express backend (port 3001) receives a valid JWT for authenticated requests.

- None

## Proposed Changes

### Auth Infrastructure

#### [TASK-01] Add setAuthToken to AuthContext
- Import `setAuthToken` from `@/shared/api/authToken` in `src/features/auth/contexts/AuthContext.tsx`.
- Update the `onAuthStateChange` listener to call `setAuthToken(session?.access_token)` on any state change.
- Update `initAuth` to call `setAuthToken(session?.access_token)` after initial session fetch.

## Verification Plan

### Automated Tests
- Mock Supabase session change and verify `localStorage.getItem('auth_token')` is updated.
- Verify `apiClient` includes the token in the `Authorization` header after sync.

### Manual Verification
- Log in and check `localStorage` in DevTools.
- Verify Dashboard widgets (calling :3001) no longer return 401.
