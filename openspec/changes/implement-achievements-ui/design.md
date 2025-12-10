# Design: Achievements System

## Architecture

### Data Flow
1.  **Trigger**: `awardXP()` completes successfully.
2.  **Check**: `achievementService.checkAndUnlockAchievements(userId)` is called.
3.  **Evaluate**: For each unearned achievement, check if the user meets the `condition`.
4.  **Unlock**: If condition met, insert into `user_achievements` and award bonus XP.
5.  **Notify**: Return newly unlocked achievements to the caller for UI notification.

### Achievement Condition Types
| Type      | Logic                                       | Example                     |
|-----------|---------------------------------------------|-----------------------------|
| `count`   | User has completed X total of a thing       | Complete 10 tasks           |
| `streak`  | User has an active streak of X days         | 7-day habit streak          |
| `one_off` | User performed a specific action once       | First journal entry         |
| `level`   | User reached a specific level               | Reach Level 10              |

### Seed Achievements (Initial Set)
```typescript
const SEED_ACHIEVEMENTS = [
    { slug: 'first-steps', name: 'First Steps', description: 'Complete your first task.', condition_type: 'count', condition_value: 1, xp_reward: 50, icon: 'Footprints' },
    { slug: 'week-warrior', name: 'Week Warrior', description: 'Log in for 7 consecutive days.', condition_type: 'streak', condition_value: 7, xp_reward: 200, icon: 'Calendar' },
    { slug: 'scholar-initiate', name: 'Scholar Initiate', description: 'Reach Level 5.', condition_type: 'level', condition_value: 5, xp_reward: 100, icon: 'GraduationCap' },
    { slug: 'centurion', name: 'Centurion', description: 'Complete 100 tasks.', condition_type: 'count', condition_value: 100, xp_reward: 500, icon: 'Crown' },
];
```

### UI Components
- **AchievementCard**: Displays a single achievement (icon, name, description, XP reward, locked/unlocked state).
- **AchievementsPanel**: Lists all achievements, filterable by earned/locked.
- **UnlockToast**: A special styled toast for achievement unlocks.
