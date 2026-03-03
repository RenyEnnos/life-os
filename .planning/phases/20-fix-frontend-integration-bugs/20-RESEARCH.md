# Phase 20: Fix Frontend Integration Bugs - Research

**Phase Goal:** Ensure complete application usability by resolving critical blocking bugs identified in testing.

## Technical Analysis

### 1. Supabase Auth Trigger (FIX-01)
- **Problem:** Database error (500) during registration.
- **Root Cause:** Likely a missing or broken `handle_new_user` trigger in the `auth` schema of the Supabase database.
- **Solution:** 
  - Verify and fix the SQL trigger that creates a `profile` when a new user signs up.
  - Implementation should use `security definer` to bypass RLS during user creation.
  - Implement a cleanup mechanism for "broken" users (auth.users exists but profiles doesn't).

### 2. Token Synchronization (FIX-02)
- **Problem:** API calls to `localhost:3001` fail with 401 Unauthorized.
- **Root Cause:** The `apiClient` in `src/shared/api/http.ts` uses `getAuthToken()` from `authToken.ts`, which reads from `localStorage['auth_token']`. However, the Supabase session is not automatically synced to this key.
- **Solution:** 
  - Update `AuthProvider` in `src/features/auth/contexts/AuthContext.tsx`.
  - Listen for `onAuthStateChange` and call `setAuthToken(session?.access_token)` to keep `localStorage` in sync.
  - This bridges the gap between Supabase Auth and the custom Express backend.

### 3. Error Boundaries & Fallbacks (FIX-03)
- **Problem:** Infinite loading spinners on fetch failure.
- **Solution:** 
  - Implement a reusable `ErrorBoundary` component using `react-error-boundary`.
  - Create a custom `FallbackUI` component matching the "Premium SaaS" aesthetic.
  - Wrap high-level feature routes (`/tasks`, `/university`) with these boundaries.
  - Integrate with `React Query`'s `QueryCache` to trigger global toasts for network errors (avoiding UI spam).

## Implementation Strategy

### Wave 1: Core Infrastructure
- Fix token synchronization in `AuthContext`.
- Implement Global Error Boundary and Fallback UI components.
- Setup global Toast listener for API errors in React Query config.

### Wave 2: Database & Registration
- Apply SQL fixes to Supabase (via migrations or direct SQL).
- Implement the "orphaned user" cleanup logic.

### Wave 3: UI Resilience
- Apply `ErrorBoundary` to `/tasks`, `/university`, and other critical routes.
- Verify fallback behavior and "Retry" functionality.

## Verification Architecture

- **Auth:** Attempt registration and verify `profiles` record creation.
- **Token:** Verify `localStorage['auth_token']` matches Supabase `access_token` and backend calls succeed.
- **Resilience:** Mock a 500/401 error on `/tasks` and verify the Error Boundary displays the fallback UI instead of a spinner.
