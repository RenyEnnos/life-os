# Feature Landscape: Life OS

**Domain:** Personal Operating System
**Researched:** 2025-03-24

## Table Stakes (Expectations)

These features are essential for any "Life OS" to be viable.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Habit Tracker** | Core metric for "quantified self". | Medium | Requires heatmap, streaks, and periodic resets. |
| **Task Kanban** | Standard productivity tool. | Medium | Drag-and-drop, due dates, priority levels. |
| **Finance Tracking** | Management of expenses/income. | High | Needs multi-currency support and categorization. |
| **Simple Journal** | Reflection and mood tracking. | Low | Daily text entries with date-based navigation. |
| **University/Study** | Critical for the "student" persona. | Medium | Course lists, GPA calculator, exam schedules. |

## Differentiators (Value Proposition)

Features that make Life OS stand out from standard apps.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI Quick Capture** | Voice/Text to structured data. | High | "Remind me to..." -> Task created automatically. |
| **What-If Simulator** | Grade prediction for University. | Medium | "If I get an A in this exam, what is my final GPA?" |
| **AI Financial Advisor** | Auto-categorization & insights. | High | Detects spending patterns and suggests savings. |
| **Gamification Engine** | XP/Levels across all domains. | Medium | Habits/Tasks feed into a unified "Player Level". |
| **Contextual Dashboard** | Dynamic zones (Now/Today/Context).| Medium | Widgets change based on time/location/focus. |

## Anti-Features (Avoid)

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Social Feed** | Distraction, high cost, low value. | Focus on personal focus and privacy. |
| **Real-time Chat** | Complex infra, outside project scope. | Integration with system notifications only. |
| **Video Storage** | High storage/bandwidth costs. | Link to external YouTube/Drive files. |

## Feature Dependencies

```
Auth → User Profile
User Profile → All Features (Tasks, Habits, etc.)
Habits/Tasks/Finances → Gamification (XP/Rewards)
Journal + Tasks + Habits → AI Insights (Contextual awareness)
```

## MVP Recommendation

1. **Zone-based Dashboard**: Central hub.
2. **Habit Tracker (Optimistic)**: For immediate user engagement.
3. **AI Quick Capture**: The primary "wow" factor for productivity.
4. **Basic Finance Tracking**: To cover the "management" aspect.

**Defer:** What-If Simulator and Advanced Financial Insights to Phase 2.

## Sources

- [Competitor Analysis: Notion, TickTick, Habitica]
- [Productivity Frameworks: GTD (Getting Things Done), Atomic Habits]
