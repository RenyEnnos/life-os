# Tasks: Upgrade Synapse Nexus

## Implementation Order

1. [x] **Replace Synapse.tsx** — Apply complete Neural Nexus implementation with Deep Glass styling, Context HUD, and tactile feedback
2. [x] **Clean synapse.css** — Remove conflicting CSS rules for dialog background/border/shadow
3. [x] **Update synapse-bar spec** — Add requirements for Context HUD and Deep Glass visual design
4. [x] **Manual Testing** — Verify `Cmd+K`/`Ctrl+K` functionality, visual appearance, and keyboard navigation

## Dependencies

- Existing `framer-motion` and `cmdk` packages (already installed)
- `lucide-react` icons (CloudRain, Bitcoin, Activity already available)
- No new npm dependencies required

## Parallelizable Work

- Steps 1 and 2 can be done in parallel
- Step 3 (spec update) can be done after implementation
- Step 4 is sequential (requires all changes applied)
