# Implement Archetype System

## Summary
Create a visual identity system ("Archetypes") that reflects the user's dominant XP attribute. The archetype provides thematic feedback (icon, color, name, description) and integrates into the `LevelBadge` for a more personalized gamification experience.

## Why
The current gamification shows raw numbers (Level, XP). Archetypes add a narrative layer:
- **The Maker** (Output dominant): Builders, creators.
- **The Scholar** (Mind dominant): Learners, thinkers.
- **The Titan** (Body dominant): Athletes, health-focused.
- **The Monk** (Spirit dominant): Reflective, mindful.
- **The Aspirant** (Tie/Zero): Balanced or new user.

This transforms the experience from "Level 5, 1200 XP" to "Level 5 Scholar" with a distinct visual style.

## Solution
1.  **Pure Logic (`archetypes.ts`)**: A function `getArchetype(attributes)` that returns the archetype object based on the highest attribute value.
2.  **Visual Component (`ArchetypeCard.tsx`)**: A card displaying the archetype icon, name, and dominant attribute bar.
3.  **LevelBadge Enhancement**: The existing `LevelBadge` already uses dominant color. This proposal formalizes the logic and adds the archetype name as a tooltip or sub-label.

## Risks
- **Color Accessibility**: Ensure chosen colors have sufficient contrast.
- **Tie-breaking**: Current logic picks the first max; proposal suggests "The Aspirant" for true ties.
