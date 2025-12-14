# Spec: Interaction Physics

## MODIFIED Requirements

#### Requirement: Fluid Modal Entry
Modals must enter the screen with a spring-based animation (scale 0.95 -> 1) rather than appearing instantly.
- **Scenario:** User clicks "New Task"; the modal expands smoothly from the center.

#### Requirement: Bento Card Hover
Bento cards must scale up (1.01x) and brighten (bg-white/0.02) on hover.
- **Scenario:** User moves mouse over grid items; the cards feel like physical buttons that lift up.

#### Requirement: Mobile Safe Areas
Layouts must respect device safe areas (notch, home indicator) using environmental variables.
- **Scenario:** User opens app on iPhone; the dock/navigation is not covered by the home bar.
