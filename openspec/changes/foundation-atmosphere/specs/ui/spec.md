# Requirement: Atmospheric Visual Foundation

The application must render a "Deep Surface" environment with specific lighting and typographic characteristics.

#### Scenario: Global Background and Lighting
Given the user opens any page
Then the background color should be `#030303`
And a top-down radial light vignette should be visible at `50% 0%`
And the vignette should not block mouse interactions

#### Scenario: Typography Settings
Given text is displayed on the screen
Then the font family should be "Inter"
And the `font-feature-settings` should include "cv11", "cv05", and "ss01"
And the text should use `antialiased` smoothing

#### Scenario: Color Palette
Given a developer uses `bg-surface`
Then the computed color should be `#0A0A0B`
Given a developer uses `border`
Then the computed color should be `rgba(255, 255, 255, 0.08)`
