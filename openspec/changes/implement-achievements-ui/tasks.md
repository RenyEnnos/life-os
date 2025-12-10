# Tasks

- [x] Seed Initial Achievements <!-- id: 0 -->
    - [x] Create migration `supabase/migrations/XXX_seed_achievements.sql`.
    - [x] Insert 4-6 starter achievements.

- [x] Achievement Service <!-- id: 1 -->
    - [x] Create `src/features/gamification/api/achievementService.ts`.
    - [x] Implement `getAchievements()` to fetch all achievements.
    - [x] Implement `getUserAchievements(userId)` to fetch user's unlocked achievements.
    - [x] Implement `checkAndUnlockAchievements(userId)` with condition evaluation.

- [x] UI Components <!-- id: 2 -->
    - [x] Create `src/features/gamification/components/AchievementCard.tsx`.
    - [x] Create `src/features/gamification/components/AchievementsPanel.tsx`.
    - [x] Style with MagicCard/glassmorphism for locked/unlocked states.

- [x] Unlock Notification <!-- id: 3 -->
    - [x] Create `src/features/gamification/components/AchievementUnlockToast.tsx`.
    - [x] Integrate into `xpService.awardXP` flow.

- [x] Integration <!-- id: 4 -->
    - [x] Add link to Achievements in Sidebar or Dashboard.
    - [x] Test full flow: complete task → XP → achievement check → unlock toast.

- [x] Verification <!-- id: 5 -->
    - [x] Complete a task that triggers "First Steps".
    - [x] Verify toast appears and achievement shows as unlocked.

