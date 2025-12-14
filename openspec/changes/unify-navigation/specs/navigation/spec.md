## ADDED Requirements

#### Scenario: Global Navigation Visibility
- **Given** the user is authenticated
- **When** the user visits ANY main application route (Dashboard, Tasks, Calendar, Finances, etc.)
- **Then** the global Sidebar MUST be visible on Desktop
- **And** the global Dock/Bottom Nav MUST be visible on Mobile
- **And** the feature page itself MUST NOT render a duplicate sidebar.


#### Scenario: Visual Consistency
- **Given** the Sidebar is rendered
- **Then** it MUST have a width of `w-24` (96px)
- **And** it MUST use the "Deep Glass" background (`bg-zinc-900/20`, `backdrop-blur-xl`)
- **And** active items MUST have a Primary Color glow and border.

#### Scenario: Icon Usage
- **Given** the navigation menu
- **Then** ALL icons MUST be rendered using `lucide-react` components
- **And** ALL icons MUST be sized consistently (e.g., `h-5 w-5`)
- **And** the icon MUST be imported directly from `lucide-react`
- **And** Material Symbols (`material-symbols-outlined`) MUST NOT be used in the main navigation.

