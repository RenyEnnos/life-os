# Phase 3: Habit Tracking System - Context

**Gathered:** 2026-02-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Enable users to build and monitor daily habits with visual feedback. This includes full habit management (CRUD), a consistency heatmap, streak tracking, and support for both binary and quantified habits.

</domain>

<decisions>
## Implementation Decisions

### Habit Types
- **Binary**: Simple check-off habits (e.g., "Meditation").
- **Quantified**: Goal-based habits with units (e.g., "Read 20 pages", "Run 5 km").

### Visualization
- **Heatmap**: GitHub-style activity map showing the last 30-90 days of consistency.
- **Streaks**: Real-time calculation of current and longest streaks.
- **Analytics**: Percentage-based completion rates per habit.

### Data Model
- **Table: habits**: Stores habit definitions (title, goal, unit, frequency).
- **Table: habit_logs**: Stores individual completions with timestamps and optional values for quantified habits.

### Claude's Discretion
- **Colors**: Allow users to choose colors for their habits to distinguish them in the UI.
- **Icons**: Integration with Lucide React for habit icons.

</decisions>

<specifics>
## Specific Ideas
- The `HabitWidget` created in Phase 2 should be the primary entry point for daily logging.
- Optimistic UI updates are critical for the "fast" feel of the system.

</specifics>

<deferred>
## Deferred Ideas
- **AI Habit Insights**: Deferred to Phase 7.
- **Social Habit Sharing**: Deferred to v2.

</deferred>

---

*Phase: 03-habit-tracking-system*
*Context gathered: 2026-02-26*
