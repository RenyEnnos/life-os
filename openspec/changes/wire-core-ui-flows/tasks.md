## 1. Discovery & Alignment
- [x] 1.1 Map dashboard sections (agenda, weather, finance, vitals, Agora) to existing API/hook data sources and identify missing fields.
- [x] 1.2 List CTA/button entry points that are static (Add Task, task checkbox, health/finance captures, symbiosis actions) and confirm backend endpoints per flow.

## 2. Backend Support
- [x] 2.1 Ensure symbiosis routes (list/create/delete) cover current user, use task_habit_links, and emit realtime events where applicable.
- [x] 2.2 Add/extend summary endpoints needed for dashboard (tasks due today, finance summary, habit consistency/logs, rewards score) with auth.
- [x] 2.3 Add API tests for new/updated endpoints (symbiosis, dashboard summaries).

## 3. Frontend Wiring
- [x] 3.1 Replace static dashboard tiles with `useDashboardData` outputs and proper skeleton/empty states.
- [x] 3.2 Wire Add/complete task flows from dashboard to API mutations with optimistic UI and query invalidation.
- [x] 3.3 Wire habit nudge/log actions (consistency widget) to backend logging and refresh the dashboard metrics.
- [x] 3.4 Surface symbiosis link create/remove UI and render linked items + vital load state from API data.

## 4. Realtime & Refresh
- [x] 4.1 Hook SSE events (tasks, habit_logs, finance, symbiosis) to invalidate dashboard queries automatically.
- [x] 4.2 Add optimistic updates/loading guards so dashboards never show stale placeholders after actions.

## 5. Verification
- [x] 5.1 API tests: symbiosis CRUD and dashboard summary endpoints.
- [ ] 5.2 Manual smoke: login, create task/habit/finance/journal from dashboard; see it appear; mark task complete; create symbiosis link; reload to confirm persistence.
