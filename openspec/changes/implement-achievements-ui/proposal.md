# Implement Achievements UI

## Summary
Build the user-facing Achievements system. This includes a service layer to check and unlock achievements, an Achievements Panel/Page to display progress, and toast notifications when new achievements are earned.

## Why
The database tables (`achievements`, `user_achievements`) were created in the gamification migration, but there's no UI or service logic to:
1. Define and seed achievements.
2. Check if a user qualifies for an achievement after XP gains.
3. Display earned and locked achievements.
4. Notify the user when they unlock something new.

## Solution
1.  **Seed Data**: Create a migration to seed initial achievements (e.g., "First Steps" - complete 1 task, "Week Warrior" - 7-day streak).
2.  **Achievement Service**: `achievementService.ts` with `checkAndUnlockAchievements(userId)` that runs after XP awards.
3.  **Achievements Panel**: A component showing all achievements with locked/unlocked states.
4.  **Unlock Notification**: A special toast or modal when an achievement is unlocked, showing the XP reward.

## Risks
- **Performance**: Checking all achievements on every XP award could be slow. Mitigate by caching user counts or checking only relevant types.
- **Seed Data Management**: Initial achievements need careful design to avoid trivial or impossible conditions.
