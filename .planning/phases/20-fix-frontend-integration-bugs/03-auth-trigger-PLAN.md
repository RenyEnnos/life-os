---
wave: 2
depends_on: [01-token-sync-PLAN.md]
files_modified: [supabase/migrations/20260303_fix_auth_trigger.sql, src/features/auth/hooks/useUserCleanup.ts]
requirements: [FIX-01]
autonomous: true
must_haves:
  truths:
    - Supabase auth.users triggers successfully create public.profiles.
    - Broken users (without profiles) are automatically handled/cleaned up and records deleted.
  artifacts:
    - supabase/migrations/20260303_fix_auth_trigger.sql
    - src/features/auth/hooks/useUserCleanup.ts
  key_links:
    - auth.users -> public.profiles
---

# Plan: Fix Auth Trigger and User Cleanup

Repair the Supabase registration flow by fixing the `handle_new_user` trigger and adding a cleanup for broken records.

## User Review Required

> [!CAUTION]
> This modifies Database triggers. Existing registration tests will be used for validation.

- None

## Proposed Changes

<task id="TASK-01" title="Create handle_new_user Trigger">
<files>
- supabase/migrations/20260303_fix_auth_trigger.sql
- supabase/tests/auth_trigger.test.sql
</files>
<action>
- Create migration script for `handle_new_user()` function using `security definer`.
- Ensure it inserts into `public.profiles` on `auth.users` insertion.
</action>
<verify>
<automated>
- supabase db test -- supabase/tests/auth_trigger.test.sql
</automated>
- Verify a profile is created when a user record is inserted manually.
</verify>
<done>
- Database trigger creates a valid profile entry for every new auth user.
</done>
</task>

<task id="TASK-02" title="Implement User Orphan Cleanup and Recovery">
<files>
- src/features/auth/hooks/useUserCleanup.ts
- src/features/auth/hooks/__tests__/useUserCleanup.test.ts
</files>
<action>
- Implement logic to detect user with no profile.
- Attempt silent profile creation/recovery.
- If recovery fails, call a cleanup RPC to delete the auth record and sign out.
</action>
<verify>
<automated>
- npm test -- src/features/auth/hooks/__tests__/useUserCleanup.test.ts
</automated>
- Verify silent recovery is attempted first.
- Verify user deletion RPC is called if recovery fails.
</verify>
<done>
- Frontend prevents access and cleans up session/auth-record if profile is missing and irrecoverable.
</done>
</task>

## Verification Plan

### Manual Verification
- Attempt a clean registration via UI and verify success.
- Check user record in Supabase Dashboard.
