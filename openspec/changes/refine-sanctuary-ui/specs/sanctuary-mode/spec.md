# Spec: Sanctuary Mode UI

## ADDED Requirements

### Visual Immersion
#### Scenario: Activating Sanctuary Mode
When the user activates Sanctuary Mode:
*   The `SanctuaryOverlay` MUST cover the entire viewport, including the sidebar, header, and dock.
*   The background MUST be `#050505` (near black) with a subtle radial vignette.
*   The transition MUST be a slow fade (approx 0.8s) with `easeInOut` easing, avoiding any flashing or jarring cuts.

### Typography & Layout
#### Scenario: Viewing Active Task
When inside Sanctuary Mode:
*   The `activeTaskTitle` MUST be displayed in the center of the screen.
*   The font MUST be a Serif typeface (e.g., `font-serif` or `Times New Roman` fallback) to distinguish it from the app's UI.
*   The text size MUST be large (`text-4xl` or larger).

### Controls & Interaction
#### Scenario: Adjusting Ambiance
When using the controls:
*   Controls MUST be positioned at the bottom center.
*   Controls MUST be semi-transparent (`opacity-50` or less) by default and become fully opaque (`opacity-100`) on hover.
*   User MUST be able to toggle sound, scroll/select noise types, and exit via the UI.

#### Scenario: Exiting
When the user presses `Esc` or clicks the exit button:
*   Sanctuary Mode MUST deactivate.
*   The overlay MUST fade out slowly (matching the entrance duration).
