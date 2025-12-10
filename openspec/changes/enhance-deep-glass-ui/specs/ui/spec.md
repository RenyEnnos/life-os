# Spec: Deep Glass UI Refinements

## MODIFIED Requirements

### Requirement: Cinematic Transition (Refinement)
Navigation transitions MUST be purely optical (focus-based), without directional movement.

#### Scenario: User navigates between pages
- **Given** the user triggers a route change.
- **When** the transition occurs.
- **Then** the page should transform scale (`0.98` <-> `1`) and blur (`4px` <-> `0px`).
- **And** there should be NO vertical (`y`) or horizontal (`x`) translation.

### Requirement: Deep Input Styling
Input fields MUST appear visually recessed ("sunken") into the surface.

#### Scenario: Input state
- **Given** an input field is rendered.
- **When** it is in default state.
- **Then** it should have a dark transparent background (`bg-black/20`) and an inner shadow.
- **And** it should have a subtle border (`border-white/5`).

#### Scenario: Input focus
- **Given** an input field.
- **When** the user focuses the field.
- **Then** a colored glow (blue/purple gradient) should appear around it.
