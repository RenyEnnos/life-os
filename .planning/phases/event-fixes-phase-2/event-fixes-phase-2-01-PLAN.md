---
phase: event-fixes-phase-2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/features/calendar/pages/CalendarPage.tsx
autonomous: true
requirements:
  - CAL-01
must_haves:
  truths:
    - User can switch between Day, Week, and Month views using Design System Tabs
    - User can trigger the New Event action via a Design System Button
    - User can navigate to previous and next months using interactive buttons
    - User can click on event cards to interact with them
  artifacts:
    - path: src/features/calendar/pages/CalendarPage.tsx
      provides: Main calendar interface with integrated Design System components
      contains: Tabs, Button
  key_links:
    - from: src/features/calendar/pages/CalendarPage.tsx
      to: src/shared/ui/Tabs.tsx
      via: View selection mechanism
      pattern: <Tabs
    - from: src/features/calendar/pages/CalendarPage.tsx
      to: src/shared/ui/Button.tsx
      via: Action and navigation buttons
      pattern: <Button
---

<objective>
Refactor Calendar module UI to connect visual buttons to business logic, replacing raw HTML elements with Design System components (`Button`, `Tabs`, etc) and adding appropriate event handlers.

Purpose: Eliminate raw unmanaged HTML elements and establish proper state/event connections for the calendar interface, making it interactive and consistent with the application's design system.
Output: Refactored `CalendarPage.tsx` utilizing shared UI components and state handlers.
</objective>

<execution_context>
@/home/pedro/.gemini/get-shit-done/workflows/execute-plan.md
@/home/pedro/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

@src/features/calendar/pages/CalendarPage.tsx

<interfaces>
From src/shared/ui/Tabs.tsx:
```typescript
type Tab = { id: string; label: string; icon?: React.ReactNode }
export default function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = 'pill',
  fullWidth = false,
  className
}: Props)
```

From src/shared/ui/Button.tsx:
```typescript
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
// variants: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link'
// sizes: 'default' | 'md' | 'sm' | 'lg' | 'icon'
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Refactor View Selection and Action Buttons</name>
  <files>src/features/calendar/pages/CalendarPage.tsx</files>
  <action>
    Import `Tabs` and `Button` from `src/shared/ui/`.
    1. Replace the raw HTML segmented buttons ("Day", "Week", "Month") with the `Tabs` component. Set `variant="segmented"`.
    2. Add state hooks for the view selection: `const [view, setView] = useState('week')` and pass it to the `Tabs` component via `value` and `onChange`.
    3. Replace the raw `<button>` for "New Event" with the Design System `<Button>` (using `variant="primary"`).
    4. Add a placeholder state or handler `const handleAddEvent = () => console.log('New Event clicked')` and attach it to the Button's `onClick`.
  </action>
  <verify>
    <automated>npx tsc --noEmit</automated>
  </verify>
  <done>View selector correctly uses Design System Tabs and New Event uses Design System Button, both with state/handlers attached.</done>
</task>

<task type="auto">
  <name>Task 2: Refactor Navigation and Event Interactivity</name>
  <files>src/features/calendar/pages/CalendarPage.tsx</files>
  <action>
    1. In the right sidebar CalendarPicker mini, replace the raw `chevron_left` and `chevron_right` `<button>` elements with `<Button variant="ghost" size="icon">`.
    2. Add placeholder state for date navigation (e.g., `const [currentDate, setCurrentDate] = useState(new Date())`) and attach simple `prevMonth`/`nextMonth` handlers to the navigation buttons.
    3. Make the hardcoded event cards (e.g., "Deep Work", "Team Sync") interactive. Add an `onClick` handler to them (e.g., `const handleEventClick = (eventId) => console.log('Event', eventId)`). Update their classes to include cursor-pointer or wrap them in `<button>` semantics for accessibility if appropriate.
  </action>
  <verify>
    <automated>npx tsc --noEmit</automated>
  </verify>
  <done>Navigation buttons are Design System Buttons connected to state, and event cards are interactive with onClick handlers.</done>
</task>

</tasks>

<verification>
- `Tabs` component is fully functional for switching views (state updates correctly).
- `Button` components are used for actions (New Event) and navigation (Chevrons).
- No raw `<button>` tags remain for these specified areas.
- Event cards have interactivity (`onClick`).
- TypeScript compilation passes with no errors.
</verification>

<success_criteria>
- The UI retains its layout and styling.
- Interactive elements are properly connected to React state or event handler functions.
- The codebase leverages Design System components rather than raw HTML/Tailwind for interactive elements.
</success_criteria>

<output>
After completion, create `.planning/phases/event-fixes-phase-2/event-fixes-phase-2-01-SUMMARY.md`
</output>