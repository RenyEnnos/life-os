# Phase 2: Core Infrastructure & Dashboard Layout - Research

**Researched:** 2026-02-26
**Domain:** UI/UX Architecture & Dashboard Framework
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Layout Style**: Bento Grid style layout with 3 clear zones.
  - **Zone 1 (Now)**: Focus on critical tasks and urgent items.
  - **Zone 2 (Today)**: Daily habits and today's tasks.
  - **Zone 3 (Context)**: Finances and AI insights.
- **Responsiveness**: Grid should adapt from 1 column (mobile) to 3 columns (desktop).
- **Component Pattern**: Reusable Widget wrapper with header, content, and footer sections.
- **Empty States**: Illustrative "No data" states for both habits and tasks.
- **Loading States**: Skeletons matching the bento box dimensions.

### Claude's Discretion
- **Animation**: Subtle entry animations for widgets using Framer Motion.
- **Interactions**: Hover effects on bento boxes to indicate interactivity.

### Deferred Ideas (OUT OF SCOPE)
- **Quick Capture implementation**: Deferred to Phase 7.
- **Gamification widgets**: Deferred to Phase 8.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DASH-01 | 3-zone layout: Now, Today, Context | Layout patterns for Bento Grids identified; existing BentoGrid component can be adapted. |
| DASH-02 | Dynamic widgets for health, habits, tasks | Widget framework design drafted to support dynamic loading and empty states. |
</phase_requirements>

## Summary
The research focused on establishing a robust dashboard framework that fulfills the 3-zone PRD requirement while leveraging the existing bento-style infrastructure. The core finding is that while `BentoCard` and `BentoGrid` exist in `src/shared/ui`, they are not yet utilized in a structured "Widget" framework that handles lifecycle states (loading, empty, error) consistently.

**Primary recommendation:** Create a `Widget` abstraction in `src/shared/ui/Widget.tsx` that wraps `BentoCard`. This component should accept standard props for state management and be the primary building block for the dashboard zones.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | ^12.23.25 | Animations | Standard for fluid React animations; already used in BentoCard. |
| tailwind-merge | ^3.0.2 | Class management | Required for safe Tailwind class merging in reusable components. |
| lucide-react | ^0.511.0 | Icons | Modern, consistent icon set used throughout the project. |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── shared/ui/
│   ├── BentoGrid.tsx    # Container with stagger animations
│   ├── BentoCard.tsx    # Visual container with spotlight/hover
│   └── Widget.tsx       # High-level wrapper for dashboard items
└── features/dashboard/
    ├── components/      # Specific dashboard widgets
    └── pages/
        └── IndexPage.tsx # Orchestrates the 3-zone layout
```

### Pattern 1: Zone-Based Grid Mapping
**What:** Define a grid template that maps specific column/row spans to the 3 zones.
- **Now (Urgent):** Usually `col-span-2` on desktop to draw immediate attention.
- **Today (Habits/Tasks):** Standard cards or taller `row-span-2` cards.
- **Context (Insights):** Sidebar-style vertical placement or bottom row.

## Common Pitfalls

### Pitfall 1: Layout Shift during Loading
**What goes wrong:** Widgets of different sizes pop in, causing the grid to reflow violently.
**How to avoid:** Use the `Skeleton` pattern within the `Widget` framework to reserve exact bento-box dimensions before data arrives.

## Code Examples

### Widget Framework Pattern
```typescript
interface WidgetProps {
  title: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export const Widget = ({ title, icon, isLoading, isEmpty, children }: WidgetProps) => {
  return (
    <BentoCard title={title} icon={icon}>
      {isLoading ? <WidgetSkeleton /> : isEmpty ? <EmptyState /> : children}
    </BentoCard>
  );
};
```

---
*Created: 2026-02-26*
