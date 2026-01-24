# Audit: Symbiosis & Connectivity (GAP-003)

## Overview
Analysis of Feature Interconnectivity ("Symbiosis") and "Unified Ecosystem" promise.
**Status**: 🔴 MISSING ACTIVE LOGIC

## 1. Symbiosis Service
**Requirement**: "Features affect each other" (e.g., Habits impact Vital Load).
- **Current State**:
    - `symbiosisService` provides CRUD for `SymbiosisLink`.
    - `useDashboardData.ts` sums up `impact_vital` for display.
- ❌ **Gap (Passive vs Active)**: The system *records* connections but doesn't *act* on them.
    - Example: If I define a link "Gym -> Increases Energy", completing the Gym habit *does not* actually increase any system variable that makes tasks easier or changes the UI state. It's just a static label.

## 2. Cross-Feature Integrations
- **Habits -> Rewards**: ✅ Exists. `habitsService` calls `rewardsService` (XP/Achievements).
- **Tasks -> Projects**: ✅ Exists. FK relationship.
- **Tasks -> Habits**: ❌ No link. Can't say "This task helps this habit".
- **Finance -> Projects**: ❌ No link. Can't track project budgets.

## 3. "Deep Glass" Aesthetic vs Logic
- The UI presents a unified "Life OS", but the backend treats them as separate silos (`tasks`, `habits`, `finance`) with very thin wire connections.

## Recommendation (P1 Actions)
1.  **Active Symbiosis Engine**: Create a backend listener/trigger system.
    - *Input*: Habit Completed (Gym).
    - *Logic*: Lookup Symbiosis Links -> Apply Effects (e.g., `user_state.energy += 5`).
2.  **Unified Graph**: Consider a `GraphService` that allows linking any entity to any entity (Project to Transaction, Task to Journal Entry) to truly "connect everything".
