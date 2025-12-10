# Design: Visual Legacy

## Architecture

### Data Source
We need to aggregate `user_xp.xp_history` or query `user_achievements`/`tasks`/`habits` logs.
The `user_xp` table has `xp_history` (JSONB) which records `[{ date, amount, source }]`.
We can use this to calculate "Daily Total XP".

Algorithm:
`DailyXP = Sum(amount) where date matches Day`

### Canvas Rendering
To support high performance animations for 365+ days (stars):
- Use `<canvas>` for rendering stars.
- Star properties: `x`, `y`, `radius` (based on XP), `opacity` (based on recency/XP).
- Animation: Subtle twinkling (random opacity fluctuation).

### Interface
```typescript
interface StarData {
  date: string; // YYYY-MM-DD
  xp: number;
  level: number; // Intensity 0-4
}
```

### Aesthetic
- **Background**: Deep space (dark/black).
- **Stars**: White/Blue/Gold based on dominant attribute? Or just unified "Starlight".
- **Grid**: None. Organic distribution? Or structured grid but stylized?
  - *Decision*: Structured Grid (Calendar-like) but rendered as stars is easier to read. "Constellation" might imply completely random, but for a "Legacy" (history) a calendar structure (Year/Month) is usually preferred for utility.
  - *Refinement*: Let's stick to a "Grid of Stars" (7 rows x 52 cols) but styled as glowing orbs.

## Trade-offs
- **Canvas vs SVG**: Canvas is faster for many particles, but SVG is easier for accessibility/interaction. Given < 400 items, SVG is feasible and easier to style with Tailwind/CSS classes.
- **Data Size**: `xp_history` in `user_xp` is currently capped at 50 entries in service layer! **Criticial Issue**.
  - *Correction*: We need a way to store full history or query logs.
  - *Alternative*: Query `transactions` / `habits` logs? No, XP history is different.
  - *Design Change*: We might need a `xp_logs` table if `xp_history` JSONB is truncated.
  - *MVP*: Use existing `xp_history` (limit 50 days) OR rely on `habit_logs` + `completed tasks` for the visualization proxy?
  - *Decision*: For this proposal, we will assume we use whatever history is available, but note the limitation.
  - *Better*: Create `xp_logs` table? Or remove the 50 limit? The limit was "Keep history manageable".
  - *Plan*: Remove the limit or increase it to 365 for now in the service layer if we want a full year. Or assume the user just started.

## Security
- Read-only visualization. Low risk.
