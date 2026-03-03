---
wave: 2
depends_on: [01-token-sync-PLAN.md]
files_modified: [supabase/migrations/20260303_fix_auth_trigger.sql, src/features/auth/hooks/useUserCleanup.ts]
requirements: [FIX-01]
autonomous: true
---

# Plan: Fix Auth Trigger and User Cleanup

Repair the Supabase registration flow by fixing the `handle_new_user` trigger and adding a cleanup for broken records.

## User Review Required

> [!CAUTION]
> This modifies Database triggers. Existing registration tests will be used for validation.

- None

## Proposed Changes

### Supabase Infrastructure

#### [TASK-01] Create/Update handle_new_user Trigger
- Write SQL migration in `supabase/migrations/20260303_fix_auth_trigger.sql`.
- Implement `handle_new_user()` function using `security definer`.
- Ensure it inserts into `public.profiles` correctly on `auth.users` insertion.

### Auth Logic

#### [TASK-02] Implement User Orphan Cleanup
- Create `useUserCleanup.ts` in `src/features/auth/hooks/`.
- Logic to detect a logged-in user with no `profile` record.
- Automatically sign out and potentially call an RPC to delete the 'broken' auth user if the trigger fails.

## Verification Plan

### Automated Tests
- Run registration flow and check `profiles` table for new records.
- Simulate trigger failure and verify cleanup logic triggers.

### Manual Verification
- Attempt a clean registration via UI and verify success.
- Check user record in Supabase Dashboard.
