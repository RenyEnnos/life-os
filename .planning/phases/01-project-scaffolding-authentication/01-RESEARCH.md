# Phase 1: Project Scaffolding & Authentication - Research

**Researched:** 2026-02-26
**Domain:** Authentication & Initial Scaffolding
**Confidence:** HIGH

## Summary

This phase establishes the foundational security and user experience for Life OS. While the project is brownfield and contains a custom JWT-based Express authentication system, the target architecture mandates a shift to **Supabase Auth** (managed service) to leverage built-in security, Row-Level Security (RLS), and persistent sessions without hand-rolling password management. The existing **Onboarding Flow** (6 steps) is already partially implemented but requires deep integration with the new auth system and backend persistence.

**Primary recommendation:** Refactor the current `api/routes/auth.ts` and `src/features/auth` to use `@supabase/supabase-js` for managed authentication, while keeping the Express backend as a proxy/orchestrator for business logic.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Methods**: Email and Password as the primary authentication method.
- **Persistence**: User session must persist across browser refreshes (Supabase Auth default).
- **Redirection**: 
  - Successful login redirects to the Dashboard.
  - New signup triggers an Onboarding flow (5 steps).
- **UI Framework**: React with Tailwind CSS and Shadcn UI patterns.
- **State Management**: Zustand for local UI state and Auth state.
- **Icons**: Lucide React.

### Claude's Discretion
- **Loading States**: Skeletons for login/signup forms during submission.
- **Error Handling**: Toast notifications for auth errors.
- **Landing Page**: Basic professional landing page structure for unauthenticated users.

### Deferred Ideas (OUT OF SCOPE)
- **OAuth (Google/GitHub)**: Deferred to v2.
- **Dashboard Widgets**: Implementation of specific widgets belongs in Phase 2.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | User can sign up with email and password | Supported by Supabase Auth `signUp` API. Existing `RegisterPage` needs refactoring to use Supabase client. |
| AUTH-02 | User can log in and maintain a persistent session | Supported by Supabase Auth `signInWithPassword`. Session managed via `@supabase/auth-helpers-react` or `supabase.auth.onAuthStateChange`. |
| AUTH-03 | User can log out and clear session data | Supported by Supabase Auth `signOut`. Existing `logoutMutation` in `AuthProvider` needs updating. |
| AUTH-04 | User can reset password via email link | Requires `supabase.auth.resetPasswordForEmail` and a dedicated route/page in the frontend. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **React** | 18.3.1 | Frontend Core | Standard for project stability and ecosystem support. |
| **Supabase JS** | 2.86.0 | Auth & Persistence | Managed auth, RLS, and easy PostgreSQL integration. |
| **Express** | 4.21.2 | Backend Orchestrator| Handles complex business logic, AI, and middleware. |
| **Zustand** | 5.0.3 | State Management | Lightweight, high-performance state for onboarding and UI. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Framer Motion**| 12.23.25 | Animations | Multi-step onboarding transitions and bento-grid entries. |
| **Shadcn UI** | Latest | UI Components | Consistent, accessible design system. |
| **React Query** | 5.90.11 | Server State | caching user data and handling auth mutations. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom JWT | Supabase Auth | **Chosen.** Custom JWT is harder to secure; Supabase Auth provides RLS integration. |
| Redux | Zustand | **Chosen.** Redux is overkill for this scope; Zustand is more idiomatic for modern React. |

**Installation:**
```bash
npm install @supabase/supabase-js @tanstack/react-query zustand lucide-react framer-motion
```

## Architecture Patterns

### Recommended Project Structure (FSD)
```
src/
├── app/             # Global providers, layouts, and routing
├── features/
│   ├── auth/        # Login, Register, AuthContext, Supabase hooks
│   ├── onboarding/  # 5-step flow, OnboardingModal, persistence logic
│   └── dashboard/   # 3-zone layout, Bento grid components
├── shared/
│   ├── api/         # Supabase client instance, HTTP client
│   ├── stores/      # Zustand stores (onboarding, UI)
│   └── ui/          # Reusable Shadcn/custom components
```

### Pattern 1: Hybrid Auth Validation
**What:** Frontend authenticates with Supabase directly. Express backend validates the Supabase JWT for protected routes.
**When to use:** When you need a custom backend but want managed auth.
**Example:**
```typescript
// Backend Middleware (Source: Supabase Docs)
import { createClient } from '@supabase/supabase-js'

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' })
  req.user = user
  next()
}
```

### Anti-Patterns to Avoid
- **Hand-rolling Auth:** Avoid using `bcrypt` and custom JWT tables when Supabase Auth is available.
- **LocalStorage for Auth:** Never store sensitive tokens in LocalStorage; use Supabase's built-in cookie handling or memory + HttpOnly.
- **Syncing Onboarding State manually:** Don't just use LocalStorage for onboarding; persist it in a `profiles` or `onboarding` table in Supabase so it syncs across devices.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password Hashing | `bcrypt` logic | Supabase Auth | Security, salts, and multi-factor readiness. |
| Session Persistence| Refresh logic | Supabase client | Handles token refresh automatically in the background. |
| Multi-step Form State| Complex React state| Zustand `persist` | Handles refresh-proof multi-step flows with minimal boilerplate. |

## Common Pitfalls

### Pitfall 1: Race Conditions in Auth State
**What goes wrong:** The app renders the Dashboard before the Auth state is confirmed, causing a redirect loop or 401s.
**Why it happens:** `useAuth` hook initialization lag.
**How to avoid:** Use a `loading` state in the `AuthProvider` and prevent rendering the `Outlet` until `isLoading` is false.

### Pitfall 2: Onboarding Persistence Desync
**What goes wrong:** User completes step 3, refreshes, and starts from step 1.
**Why it happens:** Only using in-memory state for onboarding.
**How to avoid:** Use Zustand's `persist` middleware combined with an `onSettled` trigger to save progress to the Supabase backend.

## Code Examples

### Supabase Auth Initialization
```typescript
// src/shared/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Multi-step Onboarding Store
```typescript
// src/shared/stores/onboardingStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOnboardingStore = create()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      setStep: (step) => set({ step }),
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      complete: () => set({ hasCompleted: true })
    }),
    { name: 'life-os-onboarding' }
  )
)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom Express Auth | Supabase Auth | Recent | Better security, built-in RLS, less maintenance. |
| Manual Fetching | React Query v5 | 2024 | Simplified cache invalidation and optimistic updates. |

## Open Questions

1. **Password Reset Flow:** Supabase requires a redirect URL for password resets. We need to decide on the `/auth/reset-password` route structure.
2. **Onboarding Data:** Should the onboarding steps create the first Habit/Task/Transaction immediately or just collect preferences? (Current modal does immediate creation).

## Sources

### Primary (HIGH confidence)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth) - Implementation details for Email/Password.
- [Zustand Documentation](https://github.com/pmndrs/zustand) - Persistence middleware patterns.
- [React Router v7 Docs](https://reactrouter.com/en/main) - Protected route patterns.

### Secondary (MEDIUM confidence)
- Existing project code (`src/features/auth`, `api/routes/auth.ts`) - Verified current implementation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Libraries are current and widely used.
- Architecture: HIGH - FSD is a proven pattern for scalable React apps.
- Pitfalls: MEDIUM - Based on common Supabase/React integration issues.

**Research date:** 2026-02-26
**Valid until:** 2026-03-26
