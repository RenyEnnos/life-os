---
wave: 1
depends_on: []
files_modified: [src/features/auth/contexts/AuthContext.tsx]
requirements: [FIX-02]
autonomous: true
must_haves:
  truths:
    - Supabase session access_token is synced to localStorage['auth_token'].
  artifacts:
    - src/features/auth/contexts/AuthContext.tsx (Updated)
  key_links:
    - AuthContext.tsx -> localStorage['auth_token']
---

# Plan: Token Synchronization Infrastructure

Implement automatic synchronization between Supabase Auth session and the local HTTP client's storage.

## User Review Required

> [!IMPORTANT]
> This change ensures the local Express backend (port 3001) receives a valid JWT for authenticated requests.

- None

## Proposed Changes

<task id="TASK-01" title="Add setAuthToken to AuthContext">
<files>
- src/features/auth/contexts/AuthContext.tsx
</files>
<action>
- Import `setAuthToken` from `@/shared/api/authToken`.
- Update the `onAuthStateChange` listener to call `setAuthToken(session?.access_token)` on any state change.
- Update `initAuth` to call `setAuthToken(session?.access_token)` after initial session fetch.
</action>
<verify>
<automated>
- npm test -- src/features/auth/contexts/__tests__/AuthContext.test.tsx
</automated>
- Verify `localStorage.getItem('auth_token')` is updated when session changes.
- Verify `apiClient` includes the token in the `Authorization` header after sync.
</verify>
<done>
- localStorage['auth_token'] is updated correctly on auth state changes.
</done>
</task>

## Verification Plan

### Manual Verification
- Log in and check `localStorage` in DevTools.
- Verify Dashboard widgets (calling :3001) no longer return 401.
