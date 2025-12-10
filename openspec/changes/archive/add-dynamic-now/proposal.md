# Change: Add Dynamic Now (Horizon Smart Filtering)

## Why

The Life OS needs **context-aware task filtering** that adapts to the user's current state (time of day, energy level). Instead of showing all tasks, the "Dynamic Now" feature intelligently filters which Actions (tasks) are relevant RIGHT NOW, reducing cognitive load and decision fatigue.

This aligns with the "Biological Operating System" philosophy - the system adapts to human rhythms, not the other way around.

## What Changes

### New Attributes on Actions (Tasks)
- **energy_level**: `'high' | 'low' | 'any'` - Required mental/physical energy
- **time_block**: `'morning' | 'afternoon' | 'evening' | 'any'` - Best time to execute

### New Filtering Logic (100% Client-Side)
```typescript
// Rule: If hour > 18:00, hide high-energy tasks
const filterByDynamicNow = (tasks: Task[], currentHour: number): Task[] => {
  if (currentHour >= 18) {
    return tasks.filter(t => t.energy_level !== 'high');
  }
  if (currentHour < 9) {
    return tasks.filter(t => t.time_block === 'morning' || t.time_block === 'any');
  }
  return tasks;
};
```

### UI Updates
- Toggle switch in Horizon (Dashboard) to enable/disable Dynamic Now
- Visual indicators showing why tasks are hidden ("Hidden: High energy after 6pm")
- Badge showing count of filtered tasks

## Impact

### Affected Code
| File/Directory | Change |
|---|---|
| `src/shared/types.ts` | Add `energy_level` and `time_block` to Task type |
| `src/features/tasks/hooks/useTasks.ts` | Add filtering logic |
| `src/features/dashboard/index.tsx` | Add Dynamic Now toggle |
| `src/shared/stores/` | New `dynamicNowStore.ts` for filter state |

### Database Changes
- Migration to add `energy_level` and `time_block` columns to `tasks` table
- Default values: `energy_level = 'any'`, `time_block = 'any'`

## Design Principles

1. **Deterministic Logic**: No AI/ML - pure time-based filtering with `Array.filter()`
2. **User Override**: Always allow user to disable the filter
3. **Transparency**: Show WHY tasks are hidden
4. **Additive**: Existing tasks default to `any` so nothing breaks
