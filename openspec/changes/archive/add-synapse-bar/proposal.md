# Change: Add Synapse Bar (Global Command Palette)

## Why

The Life OS needs a **zero-latency, always-accessible command interface** that aligns with the "Biological Operating System" philosophy. Currently, users navigate via traditional menus and click-based interactions. A global Command Palette (Synapse Bar) enables:

1. **Instant Access**: `Cmd+K` summons the interface from anywhere
2. **Natural Language Intent**: Users type what they want ("Gastei 50 mercado") instead of navigating menus
3. **Pattern-First, AI-Second**: Local regex matching handles 80% of common patterns; LLM invoked only when needed

This is the foundational UI component that unifies all future features under a single, lightning-fast interface.

## What Changes

### New Domain Vocabulary
This proposal adopts the new Life OS nomenclature:
- Dashboard → **Horizon** (Visão do que vem por aí)
- Tasks → **Actions** (Verbos acionáveis)
- Projects → **Missions** (Propósito maior)
- Habits → **Rituals** (Repetição sagrada)
- Journal → **Memory** (Segundo cérebro/Ressonância)
- Finances → **Resources** (Energia armazenada)
- AI Assistant → **Nexus** (Inteligência central)

### Technical Additions
- **[NEW]** Install `cmdk` library as the Command Palette foundation
- **[NEW]** Create `src/shared/ui/synapse/Synapse.tsx` - Main modal component
- **[NEW]** Create `src/shared/stores/synapseStore.ts` - Zustand store for open/close state
- **[NEW]** Add global keyboard listener (`Cmd+K` / `Ctrl+K`)
- **[NEW]** Implement Pattern Matching system with local regex for common actions
- **[NEW]** Style with "Glass & Void" design system (blur, #050505, subtle borders)

### User Experience
- Command groups organized by new nomenclature: Actions, Missions, Rituals, Resources, Memory, Nexus
- Fuzzy search with instant results
- Rich previews for selected items
- Theme: Dark glass with 1px borders, Geist Sans typography

## Impact

### Affected Code
| File/Directory | Change |
|---|---|
| `package.json` | Add `cmdk` dependency |
| `src/shared/ui/synapse/` | New directory with Synapse components |
| `src/shared/stores/synapseStore.ts` | New Zustand store |
| `src/app/App.tsx` | Mount Synapse at root level |
| `src/index.css` | Additional Glass & Void utilities |

### Dependencies
- Requires: `cmdk` (lightweight, ~3KB gzipped)
- Leverages: Existing `zustand`, `framer-motion` stack

### Future Extensions
This component serves as the foundation for:
- **Dynamic Now (Horizon)**: Quick filter actions
- **Sanctuary Mode**: One-click focus activation
- **Ressonância Neural**: On-demand memory analysis

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Keyboard conflict with other apps | Use standard `Cmd+K` pattern; provide settings to rebind |
| Regex patterns too rigid | Fallback to Nexus (AI) for unrecognized patterns |
| Performance on large datasets | Virtual scrolling for command list; debounced search |

## Design System Alignment

### Visual Specs ("Glass & Void")
- Background: `#050505`
- Surface: `rgba(15, 15, 15, 0.6)` with `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Typography: Geist Sans (primary), Newsreader Italic (quotes/secondary)
- Animation: Framer Motion spring transitions
