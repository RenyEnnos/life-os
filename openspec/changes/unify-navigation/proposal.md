# Unify Navigation and Standardize Icons

## Problem
The current application suffers from fragmented navigation implementation. 
- **Duplicated Logic**: The sidebar is manually re-implemented in `DashboardPage`, `TasksPage`, and potentially others (`/habits`, `/finances`), instead of being reused from `AppLayout`.
- **Inconsistent UI**: `DashboardPage` uses Google Material Symbols (filled), while `Sidebar.tsx` and `TasksPage` use Lucide React icons (outlined).
- **Maintenance Nightmare**: Changes to navigation items require updates in multiple files (`navItems.ts` is imported, but the rendering and styling are duplicated).
- **Layout Hacks**: `AppLayout` uses an `isCustomShell` check to strictly hide the global sidebar for main routes, forcing them to implement their own.

## Solution
We will unify the navigation system by:
1.  **Centralizing Navigation**: Enabling the `NavigationSystem` (and `Sidebar`) in `AppLayout` for ALL authenticated routes (removing `isCustomShell` restriction or managing it better).
2.  **Removing Duplication**: Deleting the `<aside>` blocks from `DashboardPage`, `TasksPage`, and other feature pages.
3.  **Standardizing Icons**: Enforcing the use of `lucide-react` icons (via `navItems.ts`) across the entire unified sidebar. ensuring "perfect" proportions and sizing (20px/24px consistent).
4.  **Refining Sidebar UI**: Updating `Sidebar.tsx` to match the "Deep Glass" aesthetic (blur, borders, hover states) found in the feature-specific implementations, ensuring the "perfect" look the user requested.

## Impact
- **Visual Consistency**: Exact same sidebar everywhere.
- **Code Quality**: Reduced ~300 lines of duplicated JSX/CSS.
- **Scalability**: Add a nav item in `navItems.ts` once, and it appears everywhere.
