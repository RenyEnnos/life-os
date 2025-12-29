# Workflow

## Core Principles
-   **Architecture First:** Understand the dependency graph before coding. Identify blocking features first.
-   **Testing Culture:** "If it's not tested, it's broken." Logic functions need unit tests (`.test.ts`), critical flows need integration tests.
-   **No Mocks:** Implement real functionality. Ask for instructions if mocks seem necessary.
-   **YAGNI:** Implement ONLY what is requested. No future-proofing.
-   **Error Handling:** No `any`. Fail loudly in dev, gracefully in prod.

## Development Process
1.  **Plan:** Create a track in `conductor/tracks/` with a `spec.md` and `plan.md`.
2.  **Verify Context:** Check `.env` and dependencies.
3.  **Implement:**
    -   Create feature folder (`src/features/...`).
    -   Write tests for logic.
    -   Implement components/hooks.
4.  **Verify:** Run tests (`npm test`) and visual checks.
5.  **Commit:** Descriptive messages.

## Git & Versioning
-   **Conventions:** Conventional Commits (feat, fix, chore, refactor).
