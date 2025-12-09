# Capability: Optimize Performance

## Context
Critical UI components (TasksPage, HabitsPage) suffer from excessive re-renders due to inline handlers and lack of memoization. Authentication state management is complex and manual.

## ADDED Requirements

### Requirement: Rendering efficiency
The system MUST prevent unnecessary re-renders of list items.
#### Scenario: Toggling a task
Given a list of tasks rendered in `TasksPage`
When a user toggles one task
Then only that specific task component re-renders
And other tasks in the list do NOT re-render.

### Requirement: State Management
The system MUST use efficient server-state management for Authentication.
#### Scenario: Session verification
Given the user loads the app
When the `useAuth` hook initializes
Then it uses `useQuery` (TanStack Query) to verify the session
And does not rely on complex `useEffect` logic for hydration/verification.
