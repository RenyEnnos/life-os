# Capability: Modernize UI

## Context
The UI lacks cohesion due to split implementation of core components and mixed animation libraries.

## MODIFIED Requirements

### Requirement: Design Tokens
The system MUST use the "Deep Dark" color palette variable system.
#### Scenario: Dark Mode Background
Given the user is on any page
Then the background color must be `#050505` (Deep Dark)
And surfaces must use `#0f0f0f` with subtle 1px borders.

### Requirement: Bento Components
The system MUST use a unified `BentoCard` component for grid layouts.
#### Scenario: Dashboard Grid
Given the Dashboard is loaded
Then the grid items must animate in using a staggered fade-in (Framer Motion)
And hovering a card must reveal a "Spotlight" radial gradient effect.
#### Scenario: Component Duplication
Given the refactor is complete
Then `src/shared/ui/premium/BentoGrid.tsx` MUST NOT exist
And `src/shared/ui/BentoGrid.tsx` MUST NOT exist (replaced by `BentoCard.tsx` export).
