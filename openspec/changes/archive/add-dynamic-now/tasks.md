# Dynamic Now - Implementation Tasks

> **Status**: ✅ Core Implementation Complete  
> **Priority**: #2 (After Synapse Bar)

---

## 1. Database Schema
- [ ] 1.1 Create migration to add `energy_level` column to `tasks` table (default: 'any')
- [ ] 1.2 Create migration to add `time_block` column to `tasks` table (default: 'any')
- [ ] 1.3 Regenerate TypeScript types from Supabase (or update manually)

> **Note**: Schema migration deferred - types added to TypeScript interface for immediate use

## 2. Type Updates
- [x] 2.1 Update `Task` interface in `src/shared/types.ts` with new fields
- [x] 2.2 Add types for `EnergyLevel` and `TimeBlock` enums
- [ ] 2.3 Update task creation/edit forms to include new fields

## 3. Filtering Logic
- [x] 3.1 Create `src/shared/lib/dynamicNow/filters.ts` with filtering functions
- [x] 3.2 Implement time-based filtering (morning/afternoon/evening detection)
- [x] 3.3 Implement energy-level filtering (hide high-energy after 18:00)
- [x] 3.4 Create hook `useDynamicNow.ts` for reusable filtering → *Implemented as `applyDynamicNowFilter` function*

## 4. State Management
- [x] 4.1 Create `src/shared/stores/dynamicNowStore.ts` (Zustand)
- [x] 4.2 Store: `isEnabled: boolean`, `currentTimeBlock: TimeBlock`
- [x] 4.3 Actions: `toggle()`, `setTimeBlock()`
- [x] 4.4 Persist preference in localStorage

## 5. Dashboard (Horizon) Integration
- [x] 5.1 Add toggle switch to enable/disable Dynamic Now
- [ ] 5.2 Apply filter to task list when enabled
- [x] 5.3 Show count of hidden tasks (e.g., "3 high-energy tasks hidden")
- [x] 5.4 Style toggle with Glass & Void aesthetic

## 6. Task Form Updates
- [ ] 6.1 Add energy level selector to task creation form
- [ ] 6.2 Add time block selector to task creation form
- [ ] 6.3 Add energy level to task edit modal

## 7. Verification
- [x] 7.1 Test filter hides high-energy tasks after 18:00
- [x] 7.2 Test filter shows all tasks when disabled
- [x] 7.3 Test persistence of preference across sessions
- [x] 7.4 Run `npm run check` and `npm run build`

---

## Summary

**Core Features Implemented:**
- `EnergyLevel` and `TimeBlock` types added to Task
- Zustand store with localStorage persistence
- Filtering logic for time-based and energy-based rules
- Toggle UI component with Glass & Void styling
- Dashboard integration with time-aware greeting

**Remaining Work (Phase 2):**
- Database migration for schema changes
- Task creation/edit forms with new fields
- Wire actual task list filtering in Dashboard
