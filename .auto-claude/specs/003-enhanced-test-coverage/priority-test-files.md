# Priority Test Files List
**For subtask-7-3: Add targeted tests for files still below 70% coverage**

## Quick Wins (50-69% coverage - need small push to reach 70%)

These files already have good coverage and need minimal additional tests:

1. **src/features/rewards/index.tsx** - 66.24% → 70%
   - Missing: ~4% more coverage
   - Action: Add tests for uncovered branches in rewards display logic

2. **src/features/gamification/index.tsx** - 66.24% → 70%
   - Missing: ~4% more coverage
   - Action: Add tests for gamification dashboard integration

## High Priority (Critical Business Logic - 30-69%)

These files contain important business logic and should be prioritized:

3. **auth.api.ts** - 39.13% → 70%
   - Missing: 31% more coverage
   - Critical: Authentication API used throughout app
   - Action: Add tests for register, password reset, email verification flows

4. **AuthProvider.tsx** - 71.69% ✅ ALREADY ABOVE TARGET
   - Can skip, already meets requirements

5. **src/features/gamification/components/VisualLegacy.tsx** - 0% → 70%
   - Missing: 70% more coverage
   - Important: Major gamification component for XP display
   - Action: Create VisualLegacy.test.tsx

## Critical User Flows (0% coverage - High Impact)

These are components that users interact with directly:

6. **Dashboard Widgets** (all 0% coverage)
   - TaskWidget.tsx - Add component tests
   - HabitWidget.tsx - Add component tests
   - JournalWidget.tsx - Add component tests
   - FinanceWidget.tsx - Add component tests

7. **Habit Tracking Components** (all 0% coverage)
   - HabitCard.tsx - Core habit display component
   - CreateHabitForm.tsx - Habit creation form
   - HabitItem.tsx - Individual habit item
   - HabitsPage.tsx - Main habits page
   - streak.ts - Habit streak calculation logic

8. **Journal Components** (0% coverage)
   - JournalEditor.tsx - Main journal editor (critical!)
   - JournalSidebar.tsx - Journal navigation
   - MemoryCard.tsx - Memory display
   - useJournal.ts - Journal data hook

9. **Focus Feature** (all 0% coverage)
   - FocusOverlay.tsx - Focus mode overlay
   - TimerLogic.tsx - Pomodoro timer logic
   - FocusPage.tsx - Focus page
   - useFocusStore.ts - Focus state management

## Shared Utilities (0% coverage - High Usage)

10. **State Management Stores** (Zustand)
    - useDynamicNowStore.ts - Dynamic now filtering state
    - themeStore.ts - Theme state
    - uiStore.ts - UI state
    - synapseStore.ts - AI assistant state

11. **UI Components** (widely used across app)
    - Input.tsx - Form input component
    - Modal.tsx - Modal component (one instance has 0%)
    - Tabs.tsx - Tab navigation (one instance has 0%)
    - Toggle.tsx - Toggle switch component
    - toastContext.ts + useToast.ts - Toast notification system

12. **Utilities**
    - commands.ts - Keyboard shortcuts (200 lines, 0% coverage)
    - common.ts - Common utility functions

## Secondary Priority (Nice to Have)

13. **Finances Feature Components** (all 0%)
    - TransactionForm.tsx - Transaction creation
    - FinanceCharts.tsx - Finance visualization
    - SummaryCards.tsx - Finance summary

14. **Health Feature Components** (all 0%)
    - MetricCard.tsx - Health metric display
    - MetricModal.tsx - Metric entry modal
    - useHealth.ts - Health data hook

15. **Projects Feature** (all 0%)
    - ProjectModal.tsx - Project creation/editing
    - useProjects.ts - Projects data hook
    - ProjectsPage.tsx - Projects page

## Recommended Test Order (Maximum Impact)

**Batch 1: Quick Wins (1-2 hours)**
- src/features/rewards/index.tsx (add 4% coverage)
- src/features/gamification/index.tsx (add 4% coverage)

**Batch 2: Critical Business Logic (4-6 hours)**
- auth.api.ts (add 31% coverage)
- VisualLegacy.tsx (add 70% coverage)
- streak.ts (habit streak logic)

**Batch 3: High-Impact User Flows (8-12 hours)**
- JournalEditor.tsx
- HabitCard.tsx + CreateHabitForm.tsx
- TaskWidget.tsx + HabitWidget.tsx
- FocusOverlay.tsx + TimerLogic.tsx

**Batch 4: Shared Utilities (6-8 hours)**
- useJournal.ts + useHabits.ts
- useDynamicNowStore.ts + themeStore.ts
- Input.tsx + Modal.tsx + toastContext.ts

**Batch 5: Remaining Gaps (as time permits)**
- Finance components
- Health components
- Projects components
- Other UI components

## Exclusion Recommendations

Consider **excluding from coverage requirements**:
- All `*.stories.tsx` files (Storybook documentation)
- `src/shared/types/database.ts` (578 lines of type definitions)
- Barrel export `index.ts` files that only re-export
- Configuration files (tokens.ts, motion.ts)

Update `vitest.config.ts`:
```typescript
coverage: {
  exclude: [
    ...defaults,
    'src/**/*.stories.tsx',
    'src/**/*.stories.ts',
    'src/shared/types/database.ts',
    'src/design/**/*',
    'src/stories/**/*',
  ]
}
```

## Estimated Coverage Improvement

If we complete **Batches 1-3**:
- Add tests to ~15 critical files
- Estimated coverage increase: +15-20%
- Projected final coverage: **34-38%** (still below 70% target)

To reach **70% overall coverage**, we likely need to:
1. Exclude non-critical files from coverage calculations (vitest.config.ts update)
2. Complete Batches 1-4 (add ~25-30% more coverage)
3. Accept that some UI components may remain below 70%

**Realistic target after subtask-7-3:**
- With exclusions: **45-55% coverage**
- Without exclusions: **35-40% coverage**

**Note:** The original 70% target may need adjustment or additional testing phases beyond this spec.
