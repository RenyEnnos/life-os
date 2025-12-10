# Gamification System Design

## Architecture

### Database Schema (Supabase)

We will introduce three new tables to the public schema:

1.  **`user_xp`**: Stores the aggregate state of a user's progress.
    *   `user_id` (UUID, PK, FK -> auth.users)
    *   `total_xp` (Integer): Sum of all XP ever earned.
    *   `level` (Integer): Current calculated level.
    *   `attributes` (JSONB): Breakdown of XP by category `{'body': 0, 'mind': 0, 'spirit': 0, 'output': 0}`.
    *   `xp_history` (JSONB): Audit log of recent XP events for debugging/anti-cheat validation.

2.  **`achievements`**: Static definition of available medals/badges.
    *   `id` (UUID, PK)
    *   `slug` (Text, Unique): e.g., `early_bird`, `task_master_1`.
    *   `name` (Text)
    *   `description` (Text)
    *   `xp_reward` (Integer)
    *   `condition_type` (Text): e.g., `streak`, `count`, `one_off`.
    *   `condition_value` (Integer): Threshold to unlock.
    *   `icon` (Text): Lucide icon name or asset URL.

3.  **`user_achievements`**: Relational link for unlocks.
    *   `user_id` (UUID, PK, FK)
    *   `achievement_id` (UUID, PK, FK)
    *   `unlocked_at` (Timestamp)

### Leveling Algorithm

We will use a standard RPG progression curve, likely a square root function to make early levels fast and later levels requiring more effort.

```typescript
// Level n requires roughly n^2 * 100 XP
// Level = floor(sqrt(total_xp / 100))
// Example:
// 100 XP -> Level 1
// 400 XP -> Level 2
// 900 XP -> Level 3
```

### Service Layer (`src/features/gamification/api`)

A central `awardXP` function will be the entry point for all gamification events.

```typescript
awardXP(userId, amount, category, source)
```

**Responsibilities:**
1.  Validate input (ensure positive amount).
2.  **Anti-Cheat**: Check `xp_history` to prevent spamming (e.g., limit Journal XP to once per day).
3.  Update `user_xp` table atomically.
4.  Recalculate Level.
5.  If Leveled Up -> Trigger "Level Up" event/notification.
6.  Return the result (new totals, level up status).

### Frontend Integration

The frontend will optimistically update UI where possible, but rely on Supabase Realtime or invalidation for the definitive state.

**Hooks:**
- `useTasks` -> Wrapper around completion to call `awardXP`.
- `useHabits` -> Wrapper around check-in to call `awardXP`.
- `useJournal` -> Wrapper around creation to call `awardXP`.

**UI Components:**
- `LevelBadge`: A circular progress indicator using SVG.
- `XPToast`: A custom toast wrapper around `sonner` or `react-hot-toast` that supports XP specific styling.

## Trade-offs
- **Backend vs Frontend Calculation**: We chose Backend (via Service/Edge Function or direct DB call wrapped in API) for `awardXP` to prevent trivial client-side console cheating, although providing a client-side wrapper `awardXP` that calls Supabase directly is acceptable for MVP if RLS is tight. *Correction*: For this proposal, we are implementing logic in a TypeScript Service Layer which likely runs client-side (calling Supabase) for the MVP, but validating user ID. True anti-cheat requires Database Functions (PL/pgSQL), but we will implement the logic in the TS service first for velocity, with RLS ensuring users can only edit their own XP.
