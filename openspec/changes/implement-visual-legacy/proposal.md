# Proposal: Visual Legacy (Heatmap)

## Overview
Implement a "Visual Legacy" system: an artistic, interactive heatmap resembling a constellation. Each productive day is represented as a star that shines brighter based on activity (XP gained).

## Why
Currently, users gain XP and Levels involving numbers (`Levels 1-5`, `50 XP`), but lack a visual, artistic representation of their consistency and effort over time. Standard GitHub-style heatmaps are functional but lack the "Deep Dark / Premium" aesthetic of Life OS.

## Solution
Create a `VisualLegacy` component using HTML Canvas:
- **Constellation Metaphor**: days are stars.
- **Intensity**: Brightness/Size determined by XP/Activity count.
- **Interactivity**: Hovering over a star shows details (Date, XP, Focus).
- **Aesthetic**: Dark background (`#050505`), glowing stars (framer-motion or native canvas glow).

## Scope
- New Component: `src/features/gamification/components/VisualLegacy.tsx`
- Service: Fetch aggregation of XP history by date.
- UI: Integration into Dashboard or Profile page.

## Impact
- Increases emotional connection to progress.
- Enhances "Premium" feel.
- Provides "at-a-glance" consistency check.
