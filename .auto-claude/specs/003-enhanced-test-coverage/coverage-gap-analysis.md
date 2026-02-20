# Coverage Gap Analysis Report
**Generated:** 2026-02-20
**Subtask:** subtask-7-2
**Target:** 70% code coverage

## Executive Summary

**Current Overall Coverage:**
- Statements: **18.67%** (Target: 70%)
- Branches: 56.37%
- Functions: 35.65%
- Lines: 18.67%

**Status:** ❌ **BELOW TARGET** - Coverage is at 18.67%, which is 51.33 percentage points below the 70% target.

**Files Analysis:**
- Total files with coverage data: ~280+
- Files below 70% coverage: **274 files**
- Files at or above 70%: ~20+ files

## Critical Findings

### Files with ZERO Coverage (0%)

The following files have **no test coverage at all** and represent the highest priority gaps:

#### Core Application Files (0% coverage)
- `App.tsx` - Main application entry point
- `AppLayout.tsx` - Application layout wrapper
- `main.tsx` - Vite entry point
- `navItems.ts` - Navigation configuration

#### Feature Areas with Zero Coverage

**Dashboard Components:**
- `AgoraSection.tsx`
- `FinanceCard.tsx`
- `StatusCard.tsx`
- `Zone1_Now.tsx`
- `Zone3_Context.tsx`
- `TaskWidget.tsx`, `HabitWidget.tsx`, `JournalWidget.tsx`, `FinanceWidget.tsx`

**Calendar Feature:**
- `CalendarView.tsx`
- `MinimalCalendar.tsx`

**Finances Feature:**
- All components in `src/features/finances/components/` (4 files)
- All hooks in `src/features/finances/hooks/` (4 files)

**Focus Feature:**
- `FocusOverlay.tsx`
- `TimerLogic.tsx`
- `FocusPage.tsx`
- `useFocusStore.ts` (entire focus state management)

**Habits Feature:**
- `HabitCard.tsx`
- `HabitDialog.tsx`
- `CreateHabitForm.tsx`
- `HabitItem.tsx`
- `HabitDoctor.tsx`
- `FrequencyChart.tsx`
- `StreakGraph.tsx`
- `HabitsPage.tsx`
- `streak.ts` (habit streak logic)

**Health Feature:**
- `MetricCard.tsx`
- `MetricModal.tsx`
- `ValidationModal.tsx`
- `useHealth.ts` hook
- `HealthPage.tsx`

**Journal Feature:**
- `JournalEditor.tsx`
- `JournalSidebar.tsx`
- `MemoryCard.tsx`
- All components in `src/features/journal/components/resonance/`
- `useJournal.ts` hook
- `useJournalInsights.ts` hook

**Projects Feature:**
- `ProjectModal.tsx`
- `SwotAnalysis.tsx`
- `useProjects.ts` hook
- `ProjectsPage.tsx`

**Rewards Feature:**
- `AchievementCard.tsx` (rewards version, different from gamification)
- All other rewards components

**Shared UI Components:**
- `ActivityCard.tsx`
- `Badge.tsx`
- `BentoCard.tsx`
- `BorderBeam.tsx`
- `Button.tsx` (one instance)
- `DynamicNowToggle.tsx`
- `EmptyState.tsx`
- `Empty.tsx`
- `ErrorBoundary.tsx`
- `FloatingDock.tsx`
- `GlassToast.tsx`
- `Input.tsx`
- `Loader.tsx`
- `Modal.tsx` (one instance)
- `ProgressBar.tsx`
- `ReactionModal.tsx`
- `ScrollArea.tsx`
- `SectionTitle.tsx`
- `Separator.tsx`
- `Tabs.tsx` (one instance)
- `Toggle.tsx`
- `Tooltip.tsx`
- `toastContext.ts`
- `useToast.ts`

**Premium UI Components:**
- `AnimatedGradientText.tsx`
- `AnimatedToggle.tsx`
- `Confetti.tsx` (partial: 28.57%)
- `Dock.tsx`
- `MagicCard.tsx` (partial: 3.63%)
- `Meteors.tsx`
- `NumberTicker.tsx`
- `Particles.tsx`
- `ShimmerButton.tsx`
- `ShineBorder.tsx` (partial: 5.88%)
- `ThemeToggler.tsx`

**Shared Utilities:**
- `commands.ts` (keyboard shortcuts)
- `common.ts`
- `database.ts` (578 lines of type definitions)
- All types in `src/shared/types/`

**Stores (State Management):**
- `useDynamicNowStore.ts`
- `useRecordingStore.ts`
- `synapseStore.ts`
- `themeStore.ts`
- `uiStore.ts`

### Files with Very Low Coverage (1-29%)

**Auth:**
- `auth.api.ts` (39.13%) - Authentication API

**Finances:**
- `src/features/finances/index.tsx` (6.45%)

**Rewards:**
- `src/features/rewards/components/AchievementCard.tsx` (18.36%)

**Premium UI:**
- `Confetti.tsx` (28.57%)
- `MagicCard.tsx` (3.63%)
- `ShineBorder.tsx` (5.88%)

### Files with Low Coverage (30-49%)

**Auth Components:**
- `LoginPage.tsx` (42.48%)
- Note: `RegisterPage.tsx` has 0% coverage

**Journal:**
- `src/features/journal/components/JournalEntryList.tsx` (86.95% - actually good!)
- Overall journal components: 18.1%

### Files with Medium Coverage (50-69%) - CLOSE TO TARGET

**Auth:**
- `AuthProvider.tsx` (71.69%) - ✅ Just above 70%!

**Gamification:**
- `src/features/gamification/index.tsx` (66.24%)

**Rewards:**
- `src/features/rewards/index.tsx` (66.24%)

**Shared UI:**
- `Tabs.tsx` (one instance: 82.05%)

## Files Successfully at or Above 70% Target ✅

### Gamification Feature (Well Tested!)
- `archetypes.ts` (100%) ✅
- `achievementService.ts` (77.77%)
- `xpService.ts` (99%)
- `AchievementCard.tsx` (100%) ✅
- `AchievementsPanel.tsx` (98.83%) ✅
- `ArchetypeCard.tsx` (99.04%) ✅
- `XPBar.tsx` (100%) ✅
- `useUserXP.ts` (100%) ✅
- `VisualLegacy.tsx` (0%) - needs work

### Other Well-Covered Files

**Calendar:**
- `CalendarPage.tsx` (100%) ✅
- `src/features/calendar/index.tsx` (100%) ✅

**Dashboard:**
- `IndexPage.tsx` (100%) ✅
- `src/features/dashboard/index.tsx` (100%) ✅

**Finances:**
- `FinancesPage.tsx` (100%) ✅
- `src/features/finances/api/finances.api.ts` (100%) ✅
- `src/features/finances/index.tsx` (100%) ✅

**Habits:**
- `habits.api.ts` (90%) ✅
- `useHabits.ts` (85.71%) ✅

**Health:**
- `health.api.ts` (94.11%) ✅

**Journal:**
- `journal.api.ts` (100%) ✅
- `JournalPage.tsx` (100%) ✅
- `src/features/journal/index.tsx` (100%) ✅

**Onboarding:**
- `OnboardingModal.tsx` (99.45%) ✅

**Profile:**
- `src/features/profile/index.tsx` (93.2%) ✅

**Rewards:**
- `rewards.api.ts` (100%) ✅
- `useRewards.ts` (90%) ✅

**Settings:**
- `src/features/settings/index.tsx` (100%) ✅

**Shared API:**
- `http.ts` (99.02%) ✅
- `authToken.ts` (100%) ✅

**Shared Lib:**
- `cn.ts` (100%) ✅
- `normalize.ts` (100%) ✅
- `noiseGenerator.ts` (100%) ✅
- `filters.ts` (92%) ✅
- `syncQueue.ts` (100%) ✅

**Shared UI:**
- `Card.tsx` (100%) ✅
- `HeroImage.tsx` (100%) ✅
- `Modal.tsx` (one instance: 100%) ✅
- `PageTitle.tsx` (100%) ✅
- `ProgressBar.tsx` (100%) ✅
- `Tag.tsx` (100%) ✅
- `ThemeToggle.tsx` (100%) ✅
- `Tabs.tsx` (one instance: 82.05%) ✅
- `AnimatedButton.tsx` (72.97%) ✅

## Recommendations

### Priority 1: Quick Wins (Files Already Close to 70%)

These files need minimal additional tests to reach 70%:
1. `AuthProvider.tsx` (71.69%) - Already above target ✅
2. `src/features/rewards/index.tsx` (66.24%) - Add 4% more
3. `src/features/gamification/index.tsx` (66.24%) - Add 4% more
4. `src/features/gamification/components/VisualLegacy.tsx` (0%) - Major component
5. `auth.api.ts` (39.13%) - Add 31% more (critical authentication logic)

### Priority 2: Critical User Flows

Add tests for these critical features to ensure main user journeys work:
1. **Dashboard widgets** - All 4 widgets have 0% coverage
2. **Habit tracking** - All habit components have 0% coverage
3. **Task management** - TaskWidget and related components
4. **Focus/Pomodoro** - Entire focus feature has 0% coverage
5. **Journal editor** - `JournalEditor.tsx` (0%) is critical for journaling

### Priority 3: Shared Utilities

These utility functions are used across the app and need coverage:
1. **State stores** - All Zustand stores have 0% coverage
2. **Toast system** - `toastContext.ts` and `useToast.ts` (0%)
3. **Common types** - While type definitions don't always need tests, runtime utilities do
4. **Keyboard shortcuts** - `commands.ts` (0%, 200 lines)

### Priority 4: UI Component Library

Basic UI components that need coverage:
1. **Form elements** - `Input.tsx`, `Toggle.tsx`, `Tabs.tsx`
2. **Feedback components** - `Toast`, `Modal`, `ErrorBoundary`
3. **Layout components** - `Card`, `Separator`, `ScrollArea`

### Files to Consider Excluding

The following files can potentially be excluded from coverage requirements:
- **Storybook files** (`*.stories.tsx`) - Documentation only
- **Type definition files** (`.d.ts`, large `database.ts` with 578 lines of types)
- **Barrel exports** (`index.ts` with just re-exports)
- **Configuration files** (`tokens.ts`, `motion.ts`)

## Implementation Strategy for subtask-7-3

Based on this analysis, **subtask-7-3** should focus on:

1. **Add tests to reach 70% target** for Priority 1 files (quick wins)
2. **Target critical business logic** in high-usage features (habits, tasks, dashboard)
3. **Focus on integration and E2E gaps** - Some coverage may come from Playwright tests
4. **Update vitest.config.ts** to exclude non-critical files:
   ```typescript
   coverage: {
     exclude: [
       'src/**/*.stories.tsx',
       'src/**/*.stories.ts',
       'src/shared/types/database.ts',
       // ... other non-critical files
     ]
   }
   ```

## Estimated Effort to Reach 70%

To move from **18.67% to 70%** coverage:

**Best Case Scenario** (excluding non-critical files):
- Exclude ~50 files of types/stories/config (~15% of total)
- Focus on 200 core files
- Add tests to top 50 lowest-coverage files
- **Estimated effort: 3-5 days of focused testing**

**Realistic Scenario**:
- Add targeted tests to Priority 1 and 2 files (~100 files)
- Focus on high-value components and hooks
- Accept that some UI components may stay below 70%
- **Estimated effort: 1-2 weeks**

**Current Progress:**
- ✅ Phase 1 (Shared Utilities): Complete - 100% coverage on tested files
- ✅ Phase 2 (Gamification API): Complete - 79-99% coverage
- ✅ Phase 3 (Gamification Hooks): Complete - 100% coverage
- ✅ Phase 4 (Gamification Components): Complete - 60-100% coverage
- ✅ Phase 5 (User Features): Complete - Settings/Profile/Onboarding tested
- ✅ Phase 6 (Integration Tests): Complete - Dashboard/Auth/Gamification flows tested
- 🔄 **Phase 7 (Coverage Verification): IN PROGRESS**
- ⏳ Phase 8 (CI/CD Integration): Pending

## Next Steps

**Immediate Actions for subtask-7-3:**
1. Update vitest.config.ts to exclude non-critical files from coverage calculations
2. Add targeted tests to Priority 1 files (quick wins to reach 70%)
3. Focus on files with 50-69% coverage (closest to target)
4. Add tests for critical business logic files (API services, hooks)
5. Re-run coverage report and verify 70% target is met

**Files needing immediate attention:**
- `VisualLegacy.tsx` (0% → 70%) - Large gamification component
- `auth.api.ts` (39% → 70%) - Authentication logic
- `src/features/rewards/index.tsx` (66% → 70%) - Small gap
- `src/features/gamification/index.tsx` (66% → 70%) - Small gap
