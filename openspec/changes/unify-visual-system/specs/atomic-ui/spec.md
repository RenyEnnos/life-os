# Capability: Atomic UI (Deep Glass)

## MODIFIED Requirements

#### User Story: As a user, I expect buttons and inputs to feel premium and tactile.

#### Scenario: Button Interaction
- **Given** a Primary Button
- **When** I hover over it
- **Then** it should subtly scale (`scale-105`) and increase brightness, without shifting layout.
- **And** it should have a subtle inner shadow (`shadow-inner`) to imply depth.

#### Scenario: Input Focus State
- **Given** a Deep Glass Input field
- **When** I focus on it
- **Then** it should glow subtly with the primary color and the background should darken slightly (`bg-black/40`) to increase contrast for typing.

#### Scenario: Fluid Widths
- **Given** an Input or Button on a mobile device (320px)
- **When** rendered
- **Then** it should not overflow the viewport (max-width `100%` or flexible flex item).
