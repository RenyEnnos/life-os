# Tasks

1.  **Database Migration**
    - [ ] Create `supabase/migrations/[timestamp]_add_gamification.sql`
    - [ ] Add `user_xp` table definitions (including JSONB columns).
    - [ ] Add `achievements` and `user_achievements` tables.
    - [ ] Apply migration locally and generate types (`npm run types:generate`).

2.  **Service Layer Implementation**
    - [ ] Create `src/features/gamification/api/types.ts` (if distinct from shared).
    - [ ] Create `src/features/gamification/api/xpService.ts`.
    - [ ] Implement `calculateLevel(totalXp)` utility.
    - [ ] Implement `awardXP` function with "check and update" logic.
    - [ ] Implement `checkAchievements` placeholder logic.

3.  **Hooks Integration**
    - [ ] Modify `src/features/tasks/hooks/useTasks.ts` -> Add `awardXP` call on task completion.
    - [ ] Modify `src/features/habits/hooks/useHabits.ts` -> Add `awardXP` call on habit completion.
    - [ ] Modify `src/features/journal/hooks/useJournal.ts` -> Add `awardXP` call on entry creation.

4.  **UI Components**
    - [ ] Create `src/shared/ui/gamification/LevelBadge.tsx`.
    - [ ] Implement circular progress bar logic.
    - [ ] Add `LevelBadge` to `Sidebar` or `Header`.
    - [ ] Implement `XPToast` notification style.

5.  **Seed Data**
    - [ ] Create a seed script or SQL to insert initial `achievements` (e.g., 'First Task', 'Early Bird').
