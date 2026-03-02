# Research: 08 - Gamification Engine

## Current State Analysis
- **Model**: `user_xp` and `achievements` tables exist in the database. 
- **Backend**: `rewardsService.ts` and `rewards.ts` (routes) are mostly implemented and support adding XP and fetching scores.
- **Frontend Components**: 
  - `AchievementCard.tsx` exists.
  - `useRewards.ts` hook is functional but types are slightly outdated.
- **Success Criteria (Gap Analysis)**:
  - [ ] XP and Level visible in UI (Missing XP Bar).
  - [ ] Automatic XP on task/habit completion (Logic exists in backend triggers?).
  - [ ] Level-up animations (Missing).
  - [ ] Badge gallery (Missing).

## Technical Strategy
1. **Unified Gamification Types**: Update `LifeScore` and related types in `shared/types.ts` to include XP, Level, and Attributes.
2. **Global XP Bar**: Implement a high-end `UserLevelStatus.tsx` component in the main header/sidebar showing current Level and XP progress.
3. **Triggered XP**:
   - Verify if database triggers already handle XP on task/habit completion.
   - If not, add calls to `rewardsApi.addXp` in the `onSuccess` handlers of Task/Habit mutations.
4. **Level-Up System**: Implement a `useLevelTracker` hook that detects level changes and triggers a `LevelUpAnimation`.
5. **Achievement Gallery**: Create a page/modal to view all available and unlocked achievements using the `getAchievementsCatalog` API.

## Requirements Mapping
- **GAME-01**: XP progress bar visible to the user.
- **GAME-02**: Level-up animations and state changes.
- **GAME-03**: Badge gallery for milestones.

## Proposed Waves
- **Wave 1**: Gamification Types & XP Bar UI.
- **Wave 2**: Automatic XP Integration (Tasks & Habits).
- **Wave 3**: Level-Up Modal & Animations.
- **Wave 4**: Achievement Gallery & Final Polish.
