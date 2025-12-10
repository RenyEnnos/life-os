# Proposal: Consolidate Design System & Expand Habits Page

## Goal
Finalize the migration to the "Deep Dark" Design System (Phase 2) by cleaning up technical debt and refactoring the Habits page to use the new Bento Grid layout.

## Context
We are in the process of standardizing the UI with the "Deep Dark" design system. Phase 1 established the core tokens and basic components. Phase 2 focuses on removing legacy layouts (`animejs`, old grid components) and applying the new Bento Grid pattern to the Habits feature to improve visual consistency and user experience.

## Changes
1.  **Technical Housekeeping**: Remove unused `src/shared/ui/premium/BentoGrid.tsx` (if present) and uninstall `animejs`. Verify CSS tokens.
2.  **Habits Page Refactor**: Rewrite `src/features/habits/index.tsx` to use `<BentoGrid>` and `<BentoCard>` with a specific dashboard layout (Consistency Score, Focus Habit, Streak).

## Impact
- **Architecture**: Cleaner dependency graph (removed `animejs`), unified UI components.
- **UX**: More engaging and consistent Habits dashboard with staggered animations and clear hierarchy.
