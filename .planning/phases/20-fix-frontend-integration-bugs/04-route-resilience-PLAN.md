---
wave: 3
depends_on: [02-ui-resilience-PLAN.md]
files_modified: [src/features/tasks/components/TasksPage.tsx, src/features/university/components/UniversityPage.tsx, src/app/providers/QueryProvider.tsx]
requirements: [FIX-03]
autonomous: true
---

# Plan: Route Resilience Implementation

Apply Error Boundaries and global network error handling to the application.

## User Review Required

- None

## Proposed Changes

<task id="TASK-01" title="Global Query Error Handler">
<files>
- src/app/providers/QueryProvider.tsx
</files>
<action>
- Update `src/app/providers/QueryProvider.tsx`.
- Configure `QueryCache` and `MutationCache` with global `onError` for unified Toast notifications on 401/Network errors.
</action>
<verify>
<automated>
- npm test -- src/app/providers/__tests__/QueryProvider.test.tsx
</automated>
- Verify exactly one toast is shown for multiple concurrent failures.
</verify>
</task>

<task id="TASK-02" title="Apply ErrorBoundaries to Critical Routes">
<files>
- src/features/tasks/components/TasksPage.tsx
- src/features/university/components/UniversityPage.tsx
</files>
<action>
- Wrap `TasksPage` and `UniversityPage` with the new `ErrorBoundary`.
</action>
<verify>
<automated>
- npx playwright test tests/e2e/resilience.spec.ts
</automated>
- Verify the "Loading" state is shown first, followed by the `FallbackUI` if fetch fails.
</verify>
</task>

## Verification Plan

### Manual Verification
- Manually break the VITE_API_URL and visit `/tasks`.
- Verify the error message and "Retry" button.

## must_haves
- [ ] ErrorBoundaries prevent infinite spinners on Tasks and University pages.
- [ ] Global network errors trigger a unified toast notification.
