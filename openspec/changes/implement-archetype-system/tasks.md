# Tasks

- [x] Create Archetype Logic <!-- id: 0 -->
    - [x] Create `src/features/gamification/logic/archetypes.ts`.
    - [x] Define `Archetype` interface and `ARCHETYPES` constant map.
    - [x] Implement `getArchetype(attributes: XPAttributes): Archetype` function.
    - [x] Handle tie-breaking (return "Aspirant" if all values are equal or zero).

- [x] Create ArchetypeCard Component <!-- id: 1 -->
    - [x] Create `src/features/gamification/components/ArchetypeCard.tsx`.
    - [x] Use `useUserXP` and `getArchetype()` to determine the current archetype.
    - [x] Display icon, name, description, and a progress bar for the dominant attribute.
    - [x] Apply "MagicCard" or neon-gradient styling.

- [x] Refactor LevelBadge <!-- id: 2 -->
    - [x] Update `src/shared/ui/gamification/LevelBadge.tsx` to use `getArchetype()`.
    - [x] Replace inline dominant color logic with archetype color.
    - [x] Add archetype name to the title/tooltip.

- [x] Integration (Optional - Sidebar) <!-- id: 3 -->
    - [x] Verify `LevelBadge` still renders correctly in `Sidebar.tsx`.
    - [x] Consider adding archetype name below "Life OS" title (minor enhancement).

- [x] Verification <!-- id: 4 -->
    - [x] Open Dashboard.
    - [x] Verify LevelBadge shows correct archetype color.
    - [x] Hover over badge to see archetype name in tooltip.

