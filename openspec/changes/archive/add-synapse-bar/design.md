# Synapse Bar - Technical Design

## Context

The Synapse Bar is the first "Biological Operating System" component, serving as the neural interface between the user and all Life OS features. It must be:

1. **Always Available**: Accessible from any screen via `Cmd+K`
2. **Lightning Fast**: Zero perceived latency on open
3. **Smart but Offline-First**: Pattern matching before AI inference

### Stakeholders
- **User**: Wants quick access without menu navigation
- **System**: Needs a single entry point for cross-feature actions
- **Nexus (AI)**: Requires a fallback invocation path

## Goals / Non-Goals

### Goals
- ✅ Create a global Command Palette using `cmdk` library
- ✅ Implement "Glass & Void" visual design
- ✅ Group commands by new nomenclature (Actions, Missions, Rituals, etc.)
- ✅ Enable pattern matching for common phrases
- ✅ Store open/close state in Zustand

### Non-Goals
- ❌ Implement all command handlers (Phase 2)
- ❌ Build full Nexus (AI) integration (separate spec)
- ❌ Create command-specific UI previews (Phase 2)
- ❌ Implement The Dynamic Now filtering (separate spec)

## Architecture

### Component Hierarchy

```
App.tsx
└── Synapse.tsx (conditionally mounted via Portal)
    ├── SynapseDialog (cmdk.Dialog)
    │   ├── SynapseInput
    │   ├── SynapseList
    │   │   ├── SynapseGroup: "Actions"
    │   │   │   └── SynapseItem[]
    │   │   ├── SynapseGroup: "Missions"
    │   │   ├── SynapseGroup: "Rituals"
    │   │   ├── SynapseGroup: "Resources"
    │   │   ├── SynapseGroup: "Memory"
    │   │   └── SynapseGroup: "Nexus"
    │   └── SynapseFooter (keyboard hints)
    └── useGlobalKeyboardListener (Cmd+K)
```

### State Management

```typescript
// src/shared/stores/synapseStore.ts
interface SynapseState {
  isOpen: boolean;
  query: string;
  activeGroup: SynapseGroup | null;
  
  // Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
}

type SynapseGroup = 'actions' | 'missions' | 'rituals' | 'resources' | 'memory' | 'nexus';
```

### Pattern Matching System

```typescript
// src/shared/lib/synapse/patterns.ts
interface SynapsePattern {
  id: string;
  regex: RegExp;
  groups: string[];
  handler: (matches: RegExpMatchArray) => SynapseAction;
}

// Example patterns
const PATTERNS: SynapsePattern[] = [
  {
    id: 'expense-quick',
    regex: /^(?:gastei|paguei)\s+(\d+(?:[.,]\d{2})?)\s+(?:em\s+)?(.+)$/i,
    groups: ['amount', 'description'],
    handler: (m) => ({ 
      type: 'CREATE_TRANSACTION', 
      payload: { amount: parseFloat(m[1]), description: m[2], type: 'expense' }
    })
  },
  {
    id: 'new-action',
    regex: /^(?:fazer|tarefa|action):\s*(.+)$/i,
    groups: ['title'],
    handler: (m) => ({ type: 'CREATE_ACTION', payload: { title: m[1] } })
  }
];
```

### File Structure

```
src/shared/
├── ui/
│   └── synapse/
│       ├── Synapse.tsx           # Main export, mounts Dialog
│       ├── SynapseDialog.tsx     # cmdk.Dialog wrapper
│       ├── SynapseInput.tsx      # Search input with pattern indicator
│       ├── SynapseList.tsx       # Groups container
│       ├── SynapseGroup.tsx      # Group header + items
│       ├── SynapseItem.tsx       # Individual command
│       ├── SynapseFooter.tsx     # Keyboard hints
│       └── synapse.css           # Glass & Void styles
├── stores/
│   └── synapseStore.ts           # Zustand store
└── lib/
    └── synapse/
        ├── patterns.ts           # Regex patterns
        ├── commands.ts           # Command definitions
        └── types.ts              # TypeScript interfaces
```

## Decisions

### Decision 1: Use `cmdk` over custom implementation

**Choice**: Adopt `pacocoursey/cmdk` library

**Rationale**:
- ~3KB gzipped, minimal footprint
- Handles keyboard navigation, focus management, accessibility
- Used by Linear, Vercel, Raycast — proven at scale
- Composable with custom styling

**Alternatives Considered**:
- Custom from scratch: Higher maintenance, accessibility gaps
- `@headlessui/react`: More generic, less optimized for command palettes
- `kbar`: Similar but less active maintenance

### Decision 2: Pattern before Nexus

**Choice**: Try regex matching before invoking AI

**Rationale**:
- 80% of commands follow predictable patterns
- Zero latency for common actions
- Reduces API costs
- Works offline

**Implementation**:
```typescript
const handleSearch = (query: string) => {
  // 1. Try pattern matching first
  const patternResult = matchPattern(query);
  if (patternResult) {
    return executePatternAction(patternResult);
  }
  
  // 2. Fall back to Nexus only if pattern fails
  if (query.length > 3 && shouldInvokeNexus(query)) {
    return invokeNexus(query);
  }
};
```

### Decision 3: Portal-based mounting

**Choice**: Mount Synapse as a React Portal at document body

**Rationale**:
- Ensures z-index stacking above all content
- Isolates styles from parent components
- Prevents layout shifts

## Visual Specifications

### Dimensions
- Dialog width: `640px` (max), responsive to viewport
- Dialog height: `400px` (max), scrollable
- Input height: `48px`
- Item height: `40px`
- Border radius: `12px`

### Colors (Glass & Void)
```css
.synapse-dialog {
  background: rgba(15, 15, 15, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}

.synapse-input {
  background: transparent;
  color: var(--color-text);
  caret-color: var(--color-primary);
}

.synapse-item[data-selected='true'] {
  background: rgba(255, 255, 255, 0.06);
}
```

### Typography
- Input: Geist Sans, 16px, normal weight
- Group headers: Geist Sans, 12px, 500 weight, uppercase, muted color
- Items: Geist Sans, 14px, normal weight
- Keyboard hints: Geist Mono, 11px

### Animation
```typescript
// Framer Motion config
const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    }
  }
};
```

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| `cmdk` version changes break API | Pin version, create thin wrapper |
| Pattern matching misinterprets input | Show preview before executing, undo support |
| Global keyboard shortcut conflicts | Check for existing handlers, make customizable |

## Migration Plan

This is a new feature, no migration required. Rollout:

1. **Phase 1 (this spec)**: Core UI structure, empty command groups
2. **Phase 2**: Wire up navigation commands (go to Horizon, Actions, etc.)
3. **Phase 3**: Pattern matching for quick actions
4. **Phase 4**: Nexus integration

## Open Questions

1. **Keyboard shortcut**: Is `Cmd+K` acceptable, or should we offer `Cmd+P` alternative?
2. **Recent commands**: Should we persist command history in localStorage?
3. **Command aliases**: Allow users to define custom shortcuts?
