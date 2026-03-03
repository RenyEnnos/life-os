---
wave: 1
depends_on: []
files_modified: [src/shared/ui/ErrorBoundary.tsx, src/shared/ui/FallbackUI.tsx, src/app/App.tsx]
requirements: [FIX-03]
autonomous: true
---

# Plan: UI Resilience Components

Implement reusable Error Boundary and Fallback UI components to handle API failures gracefully.

## User Review Required

- Review the "FallbackUI" design: Centered card with "Tentar Novamente" button and technical error display.

## Proposed Changes

### UI Components

#### [TASK-01] Create FallbackUI Component
- Create `src/shared/ui/FallbackUI.tsx` following the "Premium SaaS" aesthetic.
- Include a "Retry" button and display the passed `error.message`.

#### [TASK-02] Create Global ErrorBoundary
- Create `src/shared/ui/ErrorBoundary.tsx` using `react-error-boundary`.
- Pass `FallbackUI` as the fallback component.
- Integrate a global Toast trigger when an error is caught.

## Verification Plan

### Automated Tests
- Render `ErrorBoundary` around a component that throws.
- Verify `FallbackUI` is displayed with correct error message.

### Manual Verification
- Manually throw an error in a test component.
- Verify "Retry" button re-renders the component.
