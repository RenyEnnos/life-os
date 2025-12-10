# Spec: Habits Page Expansion

## MODIFIED Requirements

### Requirement: Habits Page Bento Layout
The Habits page (`src/features/habits/index.tsx`) MUST use the `<BentoGrid>` component as its main container.
#### Scenario: Rendering the habits page
GIVEN the user is on the /habits route
THEN the page should render a `BentoGrid` container

### Requirement: Habits Dashboard Widgets
The Habits page MUST display a "Consistency Score" card and a "Streak" card using `<BentoCard>`.
#### Scenario: Viewing dashboard metrics
GIVEN the user has logged habits
THEN they see a Consistency Score card
AND they see a Streak card

### Requirement: Habits List as Bento Cards
All active habits MUST be rendered as `<BentoCard>` items within the grid.
#### Scenario: Listing habits
GIVEN a list of active habits
THEN each habit is rendered as a `BentoCard`
AND the grid animation is staggered
