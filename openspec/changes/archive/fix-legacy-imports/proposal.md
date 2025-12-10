# Proposal: Fix Legacy Imports

## Problem
The application crashes with `[plugin:vite:import-analysis] Failed to resolve import "animejs"` because `animejs` was uninstalled but is still referenced in several files:
- `src/shared/hooks/useStaggerAnimation.ts`
- `src/shared/ui/premium/NumberTicker.tsx`
- `src/features/university/components/CourseCard.tsx` (unused import)
- `src/features/finances/components/FinanceCharts.tsx` (likely unused or refactorable)

## Goal
Completely remove the dependency on `animejs` by refactoring legacy consumers to use `framer-motion` (which is already the primary animation library) or native React hooks.

## Capabilities
### Remove AnimeJS
- **Refactor Hooks**: Update `useStaggerAnimation` to use `framer-motion`'s `animate` and `stagger`.
- **Refactor Components**: Update `NumberTicker` to use `framer-motion` for value tweening.
- **Cleanup**: Remove unused imports in `CourseCard` and `FinanceCharts`.

## Expected Effects
- **Restored Build**: The application will compile without missing dependency errors.
- **Unified Animation Stack**: All animations will rely on `framer-motion`, reducing bundle size and complexity.
