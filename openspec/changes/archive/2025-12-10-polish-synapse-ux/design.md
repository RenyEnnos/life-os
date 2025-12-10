# Design: Synapse UX Polish

## Context
The "Mestre Polidor" identified three critical issues preventing the app from feeling "native" and "intelligent":
1.  **SPA Violation**: Commands trigger full page reloads.
2.  **Dumb Synapse**: No natural language processing for quick inputs.
3.  **Static Dashboard**: Zone1 does not reflect the "Dynamic Now" logic.

## Architecture

### 1. SPA Navigation
**Problem**: `commands.ts` uses `window.location.href`.
**Solution**:
-   Inject `navigate` function (from `react-router-dom`) into the command factory.
-   Refactor `SYNAPSE_COMMANDS` to be a function `getStaticCommands(navigate: NavigateFunction)`.

### 2. Synapse "Brain" (Pattern Matching)
**Problem**: Synapse only filters static list.
**Solution**:
-   Implement a `dynamicCommand` memoized calculation in `Synapse.tsx`.
-   Use Regex to parse inputs like `Gastei {amount} em {category}` or `Lembrar {task}`.
-   If regex matches, inject a high-priority "ghost" command at the top of the list.
-   Action handler parses the regex capture groups and calls the appropriate store action.

### 3. Dynamic Zone1
**Problem**: `Zone1_Now.tsx` renders hardcoded text.
**Solution**:
-   Import `useTaskStore` (or `useTasks`).
-   Import `applyDynamicNowFilter` from `src/shared/lib/dynamicNow/filters.ts`.
-   Select the first visible task from the filtered result as the "Now" task.
-   If no tasks context is available (e.g. empty), show a fallback or "Free Time" state.

## Data Flow
**Synapse**: User Input -> Regex Matcher -> Dynamic Command Object -> Click -> Store Action.
**Zone1**: Tasks Store -> `filterTasksByDynamicNow(time)` -> Sorted List -> Top Item -> UI.
