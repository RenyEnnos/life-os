# Spec: Cinematic Navigation

## ADDED Requirements

### Requirement: Cinematic Transition
Navigation actions MUST trigger a "Deep Flow" visual transition based on optical physics (blur + scale).

#### Scenario: User navigates between pages
- **Given** the user is on any page (e.g., Dashboard).
- **When** they navigate to a different route (e.g., Tasks).
- **Then** the current page should exit with `opacity: 0`, `scale: 0.98`, and `filter: blur(4px)`.
- **And** the new page should enter from `opacity: 0`, `scale: 0.98`, `filter: blur(4px)` to `opacity: 1`, `scale: 1`, `filter: blur(0px)`.

### Requirement: Scroll Reset
The viewport scroll position MUST reset to the top (0,0) immediately upon route change.

#### Scenario: Navigating from a scrolled state
- **Given** the user has scrolled down on the current page.
- **When** the route changes.
- **Then** the window scroll position must be set to `0, 0`.

### Requirement: Background Stability
Background elements (Particles, Overlays) MUST NOT re-render or flash during page transitions.

#### Scenario: Rapid navigation
- **Given** the particle background is active (`<Particles />`).
- **When** the user switches routes.
- **Then** the background should remain static and not restart its animation loop.
