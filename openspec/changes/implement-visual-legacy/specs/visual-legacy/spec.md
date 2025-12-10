## ADDED Requirements

### Requirement: Visual Legacy Component
The system shall render a visualization of user activity history.

#### Scenario: Rendering the Star Field
Given a user with XP history
When the Visual Legacy component loads
Then it should render a grid of "stars" representing the last 365 days
And days with higher XP should appear brighter/larger
And days with zero XP should be dim or invisible

### Requirement: Interactivity
The visualization shall provide details on demand.

#### Scenario: Hovering a Star
Given the rendered star field
When the user hovers over a specific star (date)
Then a tooltip should appear showing the Date and Total XP earned that day
