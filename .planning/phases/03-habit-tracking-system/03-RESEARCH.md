# Phase 3: Habit Tracking System - Research

**Researched:** 2026-02-26
**Domain:** Habits, Gamification, Data Visualization
**Confidence:** HIGH

## <user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Binary Habits**: Simple check-off habits.
- **Quantified Habits**: Goal-based habits with units (e.g., "Read 20 pages").
- **Heatmap**: GitHub-style activity map for 30-90 days.
- **Streaks**: Real-time calculation of current and longest streaks.
- **Data Model**: `habits` and `habit_logs` tables in Supabase.

### Claude's Discretion
- **Colors**: User-selectable colors for habits.
- **Icons**: Lucide React integration.

### Deferred Ideas (OUT OF SCOPE)
- AI Habit Insights (Phase 7).
- Social Habit Sharing (v2).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HABIT-01 | Create, edit, delete habits | `habitsApi.ts` and `createHabitSchema` (Zod) are already in place. |
| HABIT-02 | Mark complete with Optimistic UI | `useHabits` hook uses React Query; `HabitWidget` needs implementation of `onMutate`. |
| HABIT-03 | Habit heatmap consistency | `HabitContributionGraph` exists and uses `date-fns` to group by weeks. |
| HABIT-04 | Streaks and analytics | `streak.ts` provides logic; `habits` table stores `streak_current/longest`. |
| HABIT-05 | Quantified habits | Schema supports `numeric` type and `value` logs; UI needs numeric inputs. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Supabase | Latest | Backend/DB/Auth | Project standard for persistence and RLS. |
| TanStack Query | v5 | State/Optimistic Updates | Essential for the "fast" feel required by specs. |
| date-fns | Latest | Date manipulation | Used for heatmap week/day calculations. |

## Architecture Patterns

### Recommended Project Structure
- `src/features/habits/`
  - `api/`: Supabase wrappers.
  - `components/`: `HabitCard`, `HabitHeatmap`, `LogHabitDialog`.
  - `logic/`: `streak.ts` for calculation.
  - `hooks/`: `useHabits`, `useHabitLogs`.

### Pattern: Optimistic Logging
When a user clicks a habit, update the local cache immediately:
1. Cancel outgoing fetches.
2. Snapshot previous state.
3. Optimistically set `completed: true` or increment `value`.
4. Roll back if the Supabase request fails.

## Common Pitfalls

### Pitfall 1: Timezone Shift
**What goes wrong:** A log saved at 11:59 PM might show up on the wrong day for the server or other users.
**How to avoid:** Use `YYYY-MM-DD` strings for the `logged_date` column instead of full ISO timestamps where possible for "daily" logic.

### Pitfall 2: Streak Calculation Edge Cases
**What goes wrong:** If today isn't finished, the streak shouldn't be "broken" yet.
**How to avoid:** The logic in `streak.ts` must check if `last_log_date` is Today OR Yesterday. If it's Yesterday, the streak is still active but hasn't incremented for today.

## Code Examples

### Streak Logic (Simplified from src/features/habits/logic/streak.ts)
```typescript
export const calculateStreak = (logs: HabitLog[], habitId: string): number => {
    const dates = [...new Set(logs.filter(l => l.habit_id === habitId).map(l => l.date))].sort().reverse();
    // Logic to count consecutive days...
}
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Quick run command | `npm test src/features/habits` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command |
|--------|----------|-----------|-------------------|
| HABIT-01 | CRUD operations | Integration | `vitest habits.api.test.ts` |
| HABIT-04 | Streak increments | Unit | `vitest streak.test.ts` |

---
*Created: 2026-02-26*
