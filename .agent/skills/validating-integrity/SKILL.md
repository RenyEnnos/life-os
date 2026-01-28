---
name: validating-integrity
description: Scans the codebase for residual mocks, temporary stubs, and incomplete implementations. Use when the user asks to "validate state", "check for mocks", or "prepare for release".
---

# Validating Integrity

This skill ensures that the LifeOS system is in a valid state by detecting residual mocks, temporary code, and skipped tests that should be active.

## When to use this skill
- When the user asks to "check for mocks" or "validate system state".
- Before marking a feature as "Done".
- When preparing for a "production" run or deployment.

## Workflow
1.  **Scan for Mocks**: Search for usage of mocking libraries or patterns in production code (outside `__tests__` or `*.spec.ts` mostly, but also check integration tests for "permanent" mocks).
2.  **Check for TODOs**: Identify `TODO`, `FIXME`, or `HACK` comments in critical paths.
3.  **Report Findings**: List all issues found and suggest next steps (e.g., "Implement real API call for X").

## Instructions

### 1. Run the Mock Scanner
Execute the provided script to scan the codebase.

```bash
python .agent/skills/validating-integrity/scripts/check_mocks.py .
```

### 2. Analyze Results
- **Critical**: Mocks in `src/` (production code). These MUST be removed.
- **Warning**: Mocks in `tests/e2e` (should be minimized for true E2E).
- **Info**: `TODO` comments.

### 3. Report to User
If mocks are found:
> "⚠️ **Integrity Check Failed**
> Found X mocks in production code:
> - `src/features/auth/api.ts`: `mockResolvedValue`
>
> **Next Steps:**
> 1. Replace mock in `src/features/auth/api.ts` with real `fetch` call.
> 2. Verify backend endpoint `/auth/login` exists."

## Resources
- [check_mocks.py](scripts/check_mocks.py)
