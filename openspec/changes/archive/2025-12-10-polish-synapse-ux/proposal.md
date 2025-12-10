# Proposal: Polish Synapse UX & Dashboard Connectivity

**Change ID**: `polish-synapse-ux`
**Status**: DRAFT

## Goal
Elevate "Life OS" from a standard web app to an "extension of consciousness" by fixing critical flow interruptions and adding intelligent input handling.

## Scope
1.  **Synapse (Command Palette)**:
    -   Replace full-reload navigation with SPA routing.
    -   Add natural language input parsing (Regex) for quick actions.
2.  **Dashboard (Zone 1)**:
    -   Connect visual components to the `Dynamic Now` logic.

## Motivation
-   **Performance**: Full reloads destroy strict state management and feel "webby".
-   **UX**: Users expect a "command line" for life, not just a menu links.
-   **Utility**: The "Now" zone is useless if it doesn't show the actual next task.

## Risks
-   **Regex Complexity**: Overly complex regex might be brittle. We will stick to strict prefixes (`gastei`, `lembrar`) for v1.
-   **Store Availability**: Commands need access to stores outside of React context if not handled carefully, but since we are moving logic *into* `Synapse.tsx` (React component), hooks are available.

## Success Definition
-   Navigating via Synapse does not refresh the browser.
-   Typing "Gastei 50 em Uber" shows a "Registrar Gasto" option.
-   Zone 1 displays the highest priority task based on the current time of day.
