---
wave: 1
depends_on: []
files_modified: [src/shared/ui/ErrorBoundary.tsx, src/shared/ui/FallbackUI.tsx]
requirements: [FIX-03]
autonomous: true
must_haves:
  truths:
    - Reusable ErrorBoundary and FallbackUI components exist.
  artifacts:
    - src/shared/ui/ErrorBoundary.tsx
    - src/shared/ui/FallbackUI.tsx
  key_links:
    - ErrorBoundary -> FallbackUI
---

# Plan: UI Resilience Components

Implement reusable Error Boundary and Fallback UI components to handle API failures gracefully.

## User Review Required

- Review the "FallbackUI" design: Centered card with "Tentar Novamente" button and technical error display.

## Proposed Changes

<task id="TASK-01" title="Create FallbackUI Component">
<files>
- src/shared/ui/FallbackUI.tsx
</files>
<action>
- Create `src/shared/ui/FallbackUI.tsx` following the "Premium SaaS" aesthetic.
- Include a "Retry" button and display the passed `error.message`.
</action>
<verify>
<automated>
- npm test -- src/shared/ui/__tests__/FallbackUI.test.tsx
</automated>
- Verify component renders with correct error message and retry button.
</verify>
<done>
- FallbackUI displays error message and has an operational retry button.
</done>
</task>

<task id="TASK-02" title="Create Global ErrorBoundary">
<files>
- src/shared/ui/ErrorBoundary.tsx
</files>
<action>
- Create `src/shared/ui/ErrorBoundary.tsx` using `react-error-boundary`.
- Pass `FallbackUI` as the fallback component.
</action>
<verify>
<automated>
- npm test -- src/shared/ui/__tests__/ErrorBoundary.test.tsx
</automated>
- Verify boundary catches errors and displays fallback UI.
</verify>
<done>
- ErrorBoundary component successfully catches rendering errors and shows fallback.
</done>
</task>

## Verification Plan

### Manual Verification
- Manually throw an error in a test component wrapped in the boundary.
- Verify "Retry" button re-renders the component.
