# Audit: Database Foundation (GAP-001)

## Overview
Analysis of `database.ts` schema against `product.md` requirements.
**Status**: ⚠️ PARTIALLY ALIGNED

## 1. Habits Core
**Requirement**: "Build habits" with "Intelligent Automation" and "Life OS Intelligence".
- **Current Schema**:
    - `habits` table has `schedule` (JSON) and `description`.
    - ❌ **Missing**: Streak tracking columns (`current_streak`, `longest_streak`), failure tracking (essential for analyzing "why" a habit failed), and "smart" categorization fields.
    - ⚠️ **Risk**: High. Habit logic relies heavily on JSON `schedule`, which is hard to query/index for "insights".

## 2. Gamification (Life Score)
**Requirement**: "XP Attributes (Body, Mind, Spirit)", "Leveling".
- **Current Schema**:
    - `user_xp` table exists with `attributes` (JSON) and `xp_history` (JSON).
    - `achievements` table exists.
    - ✅ **Good**: Flexible JSON for attributes allows evolving the "Body/Mind/Spirit" model without schema migrations.
    - ⚠️ **Gap**: No direct link between `habits` and `xp_reward`. Habits don't define *which* attribute they boost (Body vs Mind). This logic is likely hardcoded in FE or API, not enforced in DB.

## 3. Operations & Symbiosis
**Requirement**: "Unified Ecosystem", "Features affect each other".
- **Current Schema**:
    - Tables are isolated: `tasks`, `habits`, `finance_transactions`.
    - ❌ **Missing**: "Symbiosis" support. No foreign keys linking, for example, a `transaction` to a `project` (Project Budgeting) or a `task` to a `goal`.
    - **Tagging**: Global `tags` (text[]) exist on most tables. This is a loose coupling mechanism, but fragile for "Deep Glass" intelligence.

## 4. Performance & Scalability
- **Indexes**: Not visible in `database.ts` (would need SQL migration check).
- **JSON Usage**: Heavy usage of `jsonb` (`schedule`, `attributes`, `xp_history`) offers flexibility but risks performance at scale if not indexed (GIN).

## Recommendation (P0 Actions)
1.  **Enhance `habits`**: Add `streak_count`, `category` (Body/Mind/Spirit enum) columns.
2.  **Enhance `transactions`**: Add `project_id` FK (optional) for Project Budgeting.
3.  **Formalize Attributes**: Consider moving Attributes from JSON to `user_attributes` table if analytics queries become frequent.
