# Design: Technical Audit Fixes

## Problem
The current codebase relies on loose typing (`any`) in 17+ locations, has manual type definitions that drift from the database schema, contains a critical security conflict in RLS policies (Grant vs Revoke), lacks input validation for CSV imports, and suffers from performance issues due to missing memoization.

## Proposed Solution

### 1. Unified Type System
- **Database Types**: Generate TypeScript definitions directly from Supabase schema using `supabase gen types`.
- **Entity Extension**: Extend generated types for client-side computed properties (e.g., `streak` in Habits).
- **Strict Mode**: Enable stricter linting rules to forbid `any`.

### 2. Security Layer
- **Validation**: Implement a centralized Zod schema repository shared between frontend and backend.
- **Middleware**: Add validation middleware to Express routes.
- **RLS Fix**: Correct migration order to ensure `public` schema access is restricted before allowing authenticated access.

### 3. State & Performance
- **Auth State**: Move from a complex `useEffect` in `AuthContext` to `TanStack Query` for robust server state management and caching.
- **Memoization**: Apply `useCallback` and `useMemo` to critical list renderers (`TasksPage`, `HabitsPage`) to prevent unnecessary re-renders.

### 4. Observability & Testing
- **Error Tracking**: Integrate Sentry for frontend and backend error reporting.
- **Testing**: Establish patterns for testing hooks and contexts (Jest/Vitest) to cover the critical path (Auth, Habits).

## Trade-offs
- **Refactoring Effort**: Migrating Auth state to React Query is a significant refactor but reduces code complexity in the long run.
- **Strictness**: Removing `any` may require immediate fixes in multiple files, potentially slowing down feature work temporarily.
