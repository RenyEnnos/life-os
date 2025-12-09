# Tasks: Technical Audit Fixes

## Refactor: Code Quality & Types
- [x] Install `supabase` CLI if missing and add `types:generate` script to `package.json`.
- [x] Run type generation to create `src/shared/types/database.ts`. (Mocked due to auth)
- [x] Refactor `src/shared/types.ts` to extend generated database types.
- [x] Enable `@typescript-eslint/no-explicit-any` in `eslint.config.js`.
    - [x] Test files
- [x] Systematically replace `any` with specific types

## Security: Validation & Hardening
- [x] Create `src/shared/schemas` directory and move/create Zod schemas for Auth, Task, and Finance.
- [x] Add Zod validation middleware to `api/server.ts` or route handlers.
- [x] Implement validation for `PUT /transactions/:id` endpoint.
- [x] Implement input sanitization for CSV import endpoint.
- [x] Create migration script or fix `001_create_tables.sql` to remove incorrect `GRANT ALL TO anon`.
- [x] Configure `cors` with restrictive options for production.
- [x] Add `helmet` middleware to Express app.

## Performance: React optimizations
- [x] Refactor `TasksPage` to use `useMemo` for `groupedTasks` and `useCallback` for handlers.
- [x] Refactor `HabitsPage` to use `useCallback` for toggle handlers.
- [x] Wrap `PremiumTaskCard` and `HabitCard` in `React.memo`.
- [x] Update `useAuth` to use `useQuery` for session verification instead of custom useEffect.
- [x] Uncomment `RewardsPage` lazy loading in `src/config/routes/index.tsx`.

## Reliability: Testing & Monitoring
- [x] Install `@sentry/react` and `@sentry/node`.
- [x] Initialize Sentry in `src/main.tsx` and `api/server.ts`.
- [x] Create unit test for `AuthContext` (or new hook).
- [x] Create unit test for `useHabits`.
- [x] Add `prebuild` script to run type checks and linting.
- [x] Update CI workflow to run build and audit.
