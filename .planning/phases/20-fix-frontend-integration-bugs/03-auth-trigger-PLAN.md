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

<task id="TASK-01" title="Create handle_new_user Trigger">
<files>
- supabase/migrations/20260303_fix_auth_trigger.sql
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
</task>

<task id="TASK-02" title="Implement User Orphan Cleanup">
<files>
- src/features/auth/hooks/useUserCleanup.ts
</files>
<action>
- Logic to detect a logged-in user with no `profile` record and clean up/sign out.
</action>
<verify>
<automated>
- npm test -- src/features/auth/hooks/__tests__/useUserCleanup.test.ts
</automated>
- Verify hook signs out if profile is missing.
</verify>
</task>

## Verification Plan

### Manual Verification
- Attempt a clean registration via UI and verify success.
- Check user record in Supabase Dashboard.

## must_haves
- [ ] Profiles table record created automatically on signup.
- [ ] Users without profiles are handled safely (no lockout).
