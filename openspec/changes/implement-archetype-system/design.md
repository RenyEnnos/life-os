# Design: Archetype System

## Architecture

### Data Flow
1.  **Source**: `user_xp.attributes` (JSON with `body`, `mind`, `spirit`, `output` keys).
2.  **Logic**: `getArchetype(attributes)` → `Archetype` object.
3.  **Consumers**: `LevelBadge`, `ArchetypeCard`, potentially Dashboard/Profile.

### Archetype Definition
```typescript
interface Archetype {
    id: 'maker' | 'scholar' | 'titan' | 'monk' | 'aspirant';
    name: string; // "The Maker"
    color: string; // Tailwind class e.g., "text-amber-500"
    bgColor: string; // "bg-amber-500/10"
    icon: LucideIcon; // Hammer, BookOpen, Dumbbell, Leaf, Compass
    description: string; // Short flavor text
}
```

### Archetype Mapping
| Dominant Attr | Archetype    | Color         | Icon        |
|---------------|--------------|---------------|-------------|
| output        | The Maker    | Amber/Orange  | `Hammer`    |
| mind          | The Scholar  | Blue/Indigo   | `BookOpen`  |
| body          | The Titan    | Red/Rose      | `Dumbbell`  |
| spirit        | The Monk     | Emerald/Teal  | `Leaf`      |
| tie/zero      | The Aspirant | Gray          | `Compass`   |

### Component Responsibilities
- **`getArchetype()`**: Pure function. No side effects. Testable.
- **`ArchetypeCard`**: Presentational. Takes `archetype` and `dominantValue` as props (or uses `useUserXP` internally for convenience).
- **`LevelBadge`**: Already exists. Will be updated to use `getArchetype()` for color sourcing instead of inline logic.

## Trade-offs
- **Option A**: Keep LevelBadge inline logic (simpler, but duplicates archetype detection).
- **Option B (Chosen)**: Abstract to `getArchetype()`, reuse across components. Slightly more files, but DRY.
