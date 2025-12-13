# Capability: Visual Core (Design Tokens)

## ADDED Requirements

#### User Story: As a developer, I want a single source of truth for design tokens so that the app is visually consistent.

#### Scenario: Using semantic colors
- **Given** I am styling a new component
- **When** I use `bg-surface` or `text-primary`
- **Then** it should render the correct HSL value consistent with the "Deep Glass" theme defined in `tokens.ts`.

#### Scenario: Dark Mode Depth
- **Given** the app is in dark mode
- **When** I view the main background
- **Then** it should be a deep rich gray (e.g., `#0b0c10`) and not pure black, to allow for shadow depth.

## MODIFIED Requirements

#### Scenario: Legacy Tokens Refactor
- **Given** the existing `tokens.ts` file
- **When** it is refactored
- **Then** it should no longer export hardcoded hex values for generic usage, but rather define the semantic palette that drives the CSS variables.
