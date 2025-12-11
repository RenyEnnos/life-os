# Design: Neural Nexus (Synapse v2)

## Architectural Context

The Synapse bar is the **central nervous system** of Life OS — a global command palette accessible via `Cmd+K`. This upgrade transforms it from a utility into a **premium launcher** inspired by Raycast/Spotlight, integrating the "Deep Glass" design system.

## Design Decisions

### 1. Styling Strategy: Tailwind over CSS

**Decision**: Move from `synapse.css` class-based styling to inline Tailwind classes.

**Rationale**:
- Consistency with BentoCard and other Deep Glass components
- Single source of truth for design tokens
- Easier to maintain and iterate

**Trade-off**: Slightly longer JSX, but better alignment with codebase conventions.

---

### 2. Context HUD: Mock Data First

**Decision**: Display static/mock data for Weather, Focus, and Bitcoin in the HUD header.

**Rationale**:
- Demonstrates the visual design immediately
- Real API integration (via `ContextGateway`) can be layered in later
- Avoids blocking this change on API availability

**Future**: Connect to `/api/context/synapse-briefing` endpoint (already exists).

---

### 3. Animation Physics

**Decision**: Use `framer-motion` with cubic-bezier easing `[0.23, 1, 0.32, 1]`.

**Rationale**:
- Matches the existing animation curve used in BentoCards
- Provides a snappy, premium feel
- Spring animations for the modal entrance

---

### 4. CSS Cleanup vs. Full Migration

**Decision**: Keep minimal CSS for `[data-cmdk-root]` font-family and scrollbar styling.

**Rationale**:
- These are cmdk-specific overrides not easily expressible in Tailwind
- Full migration to Tailwind scrollbar utilities is possible but lower priority

---

## Component Architecture

```
┌──────────────────────────────────────────────┐
│  HUD Header (Weather | Focus | Bitcoin)      │
├──────────────────────────────────────────────┤
│  🔍 Input (Spotlight-style, h-14)            │
├──────────────────────────────────────────────┤
│  Command List                                │
│  ├─ Navigation Group                         │
│  │  ├─ Dashboard                             │
│  │  ├─ Tasks & Protocol                      │
│  │  └─ Temporal View                         │
│  └─ System Group                             │
│     └─ Open Dev Terminal                     │
├──────────────────────────────────────────────┤
│  Footer (↵ select | esc close)               │
└──────────────────────────────────────────────┘
```

## Visual Specifications

| Element | Specification |
|---------|---------------|
| Container Background | `bg-[#0A0A0B]/90` |
| Backdrop Blur | `backdrop-blur-2xl` |
| Border | `border border-white/10` |
| Shadow | `shadow-2xl shadow-black/50` |
| Ring | `ring-1 ring-white/5` |
| HUD Text | `text-[10px] uppercase tracking-widest` |
| Input Height | `h-14` |
| Input Font | `text-lg` |
| Item Hover | `hover:bg-white/5` |
| Item Selected | `data-[selected=true]:bg-white/10` |
