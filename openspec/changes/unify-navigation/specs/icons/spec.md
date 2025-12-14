## ADDED Requirements

#### Scenario: Icon Set Availability
- **Given** the `navItems.ts` configuration
- **Then** every navigation item MUST include a valid `lucide-react` icon
- **And** the icon MUST be imported directly (e.g., `import { Home } from 'lucide-react'`) NOT via string lookup.

#### Scenario: Icon Visual Weight
- **Given** an icon is rendered in the sidebar
- **Then** it MUST have a consistent stroke width (default 2px)
- **And** it MUST NOT use "filled" variants unless specifically designed for the active state (though outlined is preferred for the Glass aesthetic).

#### Scenario: No Mixed Sets
- **Given** any component in the application
- **Then** it SHOULD prefer `lucide-react` over `material-symbols-outlined` for consistency
- **But** for the Sidebar specifically, `material-symbols-outlined` is STRICTLY FORBIDDEN.
