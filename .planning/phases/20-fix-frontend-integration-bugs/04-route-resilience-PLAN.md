---
wave: 3
depends_on: [02-ui-resilience-PLAN.md]
files_modified: [src/features/tasks/components/TasksPage.tsx, src/features/university/components/UniversityPage.tsx, src/app/providers/QueryProvider.tsx, src/shared/ui/SessionExpiredModal.tsx, src/app/App.tsx]
requirements: [FIX-03]
autonomous: true
must_haves:
  truths:
    - ErrorBoundaries protect critical routes.
    - Global network error handling is active.
    - Expired sessions show a blocking modal instead of redirect.
  artifacts:
    - src/app/providers/QueryProvider.tsx
    - src/shared/ui/SessionExpiredModal.tsx
    - src/app/App.tsx (Updated)
  key_links:
    - QueryProvider -> Toast
    - AuthContext -> SessionExpiredModal
---

# Plan: Route Resilience Implementation

Apply Error Boundaries and global network error handling to the application.

## User Review Required

- Review SessionExpiredModal design: Centered overlay, blurred background, "Fazer Login" button.

## Proposed Changes

<task id="TASK-01" title="Global Query Error Handler and Session Modal">
<files>
- src/app/providers/QueryProvider.tsx
- src/app/providers/__tests__/QueryProvider.test.tsx
- src/shared/ui/SessionExpiredModal.tsx
- src/app/App.tsx
</files>
<action>
- Create `src/shared/ui/SessionExpiredModal.tsx`.
- Render `SessionExpiredModal` in `src/app/App.tsx`.
- Configure `QueryCache` and `MutationCache` in `QueryProvider` to show toast notifications on error.
- Implement session expiration detection that triggers `SessionExpiredModal`.
</action>
<verify>
<automated>
- npm test -- src/app/providers/__tests__/QueryProvider.test.tsx
</automated>
- Verify exactly one toast is shown for multiple concurrent failures.
- Verify SessionExpiredModal is triggered on 401.
</verify>
<done>
- Global errors trigger toasts and session expiry triggers the blocking modal rendered in App.tsx.
</done>
</task>

<task id="TASK-02" title="Apply ErrorBoundaries to Critical Routes">
<files>
- src/features/tasks/components/TasksPage.tsx
- src/features/tasks/components/__tests__/TasksPage.test.tsx
- src/features/university/components/UniversityPage.tsx
</files>
<action>
- Wrap `TasksPage` and `UniversityPage` with `ErrorBoundary`.
</action>
<verify>
<automated>
- npm test -- src/features/tasks/components/__tests__/TasksPage.test.tsx
</automated>
- Verify component displays fallback on fetch failure.
</verify>
<done>
- Tasks and University pages are protected by Error Boundaries.
</done>
</task>

## Verification Plan

### Manual Verification
- Manually break the VITE_API_URL and visit `/tasks`.
- Verify the error message and "Retry" button.
