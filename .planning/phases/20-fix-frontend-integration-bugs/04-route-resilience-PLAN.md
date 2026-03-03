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

### Application Shell

#### [TASK-01] Global Query Error Handler
- Update `src/app/providers/QueryProvider.tsx`.
- Configure `QueryCache` and `MutationCache` with global `onError` to trigger Toast notifications for 401/Network errors.
- Ensure the toast is unified/debounced to avoid multiple popups for a single failure event.

### Feature Routes

#### [TASK-02] Apply ErrorBoundaries to Critical Routes
- Wrap `TasksPage` and `UniversityPage` with the new `ErrorBoundary`.
- Verify the "Loading" state is shown first, followed by the `FallbackUI` if the fetch fails.

## Verification Plan

### Automated Tests
- Mock fetch failure for `useTasks` hook and verify `TasksPage` shows `FallbackUI`.
- Mock network error and verify exactly one toast is shown for multiple concurrent failures.

### Manual Verification
- Manually break the VITE_API_URL and visit `/tasks`.
- Verify the error message and "Retry" button.
