# Phase 7: The Neural Nexus (Synapse v2)

Transform the Synapse command palette (`Cmd+K`) from a utilitarian search bar into a premium "Neural Nexus" interface — a floating Deep Glass HUD that provides contextual awareness before the user types.

## User Review Required

> [!IMPORTANT]
> **Breaking Visual Change**: The Synapse bar will have a completely new appearance with a context HUD header. The existing CSS-based styling will be replaced with Tailwind classes for consistency with the Deep Glass design system.

> [!NOTE]
> The Context HUD displays **mock data** for Weather, Focus, and Bitcoin. Real API integration (from the existing `ContextGateway` service) can be connected in a follow-up change.

## Proposed Changes

### Synapse Component

#### [MODIFY] [Synapse.tsx](file:///c:/Users/pedro/Documents/life-os/src/shared/ui/synapse/Synapse.tsx)

Complete refactor to implement Neural Nexus design:

1. **Deep Glass Container**: Replace CSS-based styling with Tailwind using `bg-[#0A0A0B]/90`, `backdrop-blur-2xl`, `border-white/10`
2. **Context HUD Header**: New top section displaying:
   - Weather (CloudRain icon + temp)
   - Focus percentage (Activity icon)
   - Bitcoin price (Bitcoin icon + value)
3. **Premium Input**: Increase height to `h-14`, larger text (`text-lg`), spotlight-style look
4. **Tactile Feedback**: List items with `hover:bg-white/5` and `data-[selected=true]:bg-white/10` matching BentoCard physics
5. **Keyboard Legend Footer**: Minimalist hints for `↵` select and `esc` close

---

#### [MODIFY] [synapse.css](file:///c:/Users/pedro/Documents/life-os/src/shared/ui/synapse/synapse.css)

Clean up conflicting CSS rules that may override Tailwind:
- Remove `.synapse-dialog` background/border/shadow (now inline via Tailwind)
- Keep `[data-cmdk-root]` font-family and scrollbar styles

---

### Synapse Bar Spec

#### [MODIFY] [spec.md](file:///c:/Users/pedro/Documents/life-os/openspec/specs/synapse-bar/spec.md)

Add new requirements for Context HUD and updated visual styling.

## Verification Plan

### Manual Verification

1. **Open Synapse**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows)
2. **Verify Context HUD**: Confirm presence of Weather, Focus, and Bitcoin indicators in top bar
3. **Test Input**: Confirm larger input field with spotlight-style appearance
4. **Test Hover/Selection**: Navigate with arrow keys, verify tactile hover effects
5. **Test Close**: Press `Esc` or click outside to close
6. **Visual Check**: Confirm "polished obsidian" aesthetic with deep glass blur
