# Change: Wire Core UI Flows to Real Data

## Why
The dashboard and primary CTA buttons are largely static: agenda items, weather, markets, and quick actions don’t use real data, and the “Add Task”/checkbox actions don’t persist. Users can’t record tasks/habits/finance/journal entries and see them reflected instantly. A new task-habit symbiosis table exists but isn’t surfaced.

## What Changes
- Connect dashboard tiles to live backend data (tasks/habits/finance/rewards/weather) with loading and empty states.
- Wire dashboard CTAs (Add/complete tasks, habit nudges, finance/journal captures) to real API mutations with immediate refresh.
- Expose symbiosis linking UI (task ↔ habit) using the new table and surface links in vital load/Agora cards.
- Add fast data refresh (SSE-triggered invalidations) so new or updated records appear without manual reload.

## Impact
- Affected specs: new capability `core-interactions` (added).
- Affected code: dashboard page/layout, dashboard data hooks, task/habit/finance/journal quick actions, symbiosis API + UI, react-query + SSE wiring.
