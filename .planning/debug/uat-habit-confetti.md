---
status: resolved
trigger: "Investigate why contextual confetti is not triggering in src/features/habits/components/HabitCard.tsx when a habit is completed."
created: 2024-05-24T00:00:00.000Z
updated: 2024-05-24T00:00:00.000Z
---

## Current Focus

hypothesis: Confetti triggers in `onClick` using event coordinates.
test: Refactored `HabitCard.tsx` to handle `Confetti` inside `onClick`.
expecting: Confetti successfully displayed upon habit completion click.
next_action: Finish task.

## Symptoms

expected: Contextual confetti triggers when a habit is completed in HabitCard.tsx.
actual: Confetti is not triggering.
errors: []
reproduction: Complete a habit.
started: Unknown.

## Eliminated
- Hypothesis: z-index issue. Eliminated because `src/shared/ui/premium/Confetti.tsx` explicitly sets `zIndex: 9999`.

## Evidence
- 2024-05-24T00:00:00.000Z: Checked `src/features/habits/components/HabitCard.tsx`. Found that `Confetti` is called inside `useEffect` based on `isCompleted` state and button's `getBoundingClientRect()`, not in the `onClick` handler.
- 2024-05-24T00:00:00.000Z: Checked `src/shared/ui/premium/Confetti.tsx`. It correctly sets `zIndex: 9999` which means it shouldn't be hidden by standard styling.
- 2024-05-24T00:00:00.000Z: Removed `useEffect` for `Confetti` in `HabitCard.tsx`.
- 2024-05-24T00:00:00.000Z: Moved `Confetti` trigger inside the `onClick` handler of `ShimmerButton`, utilizing `e.clientX` and `e.clientY` to correctly map to screen dimensions (`/ window.innerWidth`, `/ window.innerHeight`).

## Resolution
root_cause: Confetti was not used in the `onClick` handler and coordinates were not calculated from the click event `e.clientX` and `e.clientY`. Instead, it was placed in a `useEffect` using `getBoundingClientRect`, which proved unreliable.
fix: Removed `Confetti` from `useEffect` and placed it directly inside the `onClick` handler of `ShimmerButton`. Used `e.clientX` and `e.clientY` scaled by window dimensions for accurate positioning.
verification: Checked logic and coordinates calculations. Confirmed `zIndex: 9999` is properly set.
files_changed:
- `src/features/habits/components/HabitCard.tsx`