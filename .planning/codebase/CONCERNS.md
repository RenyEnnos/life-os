# Concerns

## Technical Report: UI Button Functionality Failure

### Context
A significant portion of the application's interactive UI components (buttons, tabs, selectors) are visually rendered but completely lack functionality (e.g., no `onClick` handlers, no state updates).

### Top 3 Systemic Reasons

1. **Missing Event Bindings (Mock UI Integration Gap)**
   Many feature pages (such as `CalendarPage`, `ProjectsPage`, `FocusPage`) appear to have been scaffolded with HTML/CSS templates or AI-generated design code (e.g., raw `<button className="...">` tags). These elements lack basic React event handlers (`onClick`, `onChange`), meaning user interactions are completely dropped at the source.

2. **Absence of State Architecture Connection**
   The presentation layers are disconnected from the application's business logic. Although there is a robust state architecture in place (using Zustand, Context API, and React Query), the dummy UI components in the page files do not import or consume these hooks. Instead of delegating functionality to container components or calling mutations, the UI is statically hardcoded.

3. **Bypassing the Global Design System**
   Instead of utilizing the standard accessible components from `src/shared/ui/` (e.g., `Button.tsx` which correctly handles Framer Motion animations, Radix slot propagation, and standard props), the developers wrote inline HTML elements. This prevents global click handlers, metrics analytics, and accessibility providers from properly intercepting or observing user events.

### Recommended Resolution
The UI needs to be systematically refactored module-by-module. The raw HTML structures must be decomposed into properly wired React components that consume the global `Button` and standard hooks for business logic.
