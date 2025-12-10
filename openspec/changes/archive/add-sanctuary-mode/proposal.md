# Change: Add Sanctuary Mode (Focus Mode)

## Why

When a user needs deep focus, the Life OS should provide a **distraction-free environment**. Sanctuary Mode removes all UI chrome (sidebar, topbar, notifications) and centers the current task on screen with optional ambient audio.

This transforms the app from a productivity dashboard into a **focused work sanctuary**.

## What Changes

### Core Mechanics
1. **UI Suppression**: When `isSanctuaryMode = true`, unmount Sidebar and Topbar
2. **Task Centering**: Current task displayed in minimalist, centered view
3. **Ambient Audio**: Web Audio API generates white/pink noise (no external assets)
4. **Quick Exit**: Press `Escape` or dedicated button to exit

### User Flow
1. User selects a task and clicks "Enter Sanctuary"
2. UI elements fade out, task fades to center
3. Optional: Ambient sound starts playing
4. User works in distraction-free mode
5. User presses Escape or clicks X to exit
6. UI elements fade back in

## Technical Approach

### State Management (Zustand)
```typescript
interface SanctuaryState {
  isActive: boolean;
  activeTaskId: string | null;
  soundEnabled: boolean;
  soundType: 'white' | 'pink' | 'brown' | 'none';
  
  enter: (taskId: string) => void;
  exit: () => void;
  toggleSound: () => void;
  setSoundType: (type: SoundType) => void;
}
```

### Web Audio API for Noise
```typescript
// No external files needed - generate noise mathematically
function createWhiteNoise(audioContext: AudioContext): AudioBufferSourceNode {
  const bufferSize = 2 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // Random values between -1 and 1
  }
  // Apply shaping filter for pink/brown noise variants
}
```

## Impact

### Affected Code
| File/Directory | Change |
|---|---|
| `src/shared/stores/sanctuaryStore.ts` | New Zustand store |
| `src/shared/ui/sanctuary/` | New components directory |
| `src/shared/lib/audio/noiseGenerator.ts` | Web Audio API utilities |
| `src/app/layout/MainLayout.tsx` | Conditional rendering based on sanctuary state |
| `src/features/tasks/components/TaskCard.tsx` | "Enter Sanctuary" button |

### Dependencies
- **None new** - Uses native Web Audio API
- Leverages existing `framer-motion` for animations

## Design (Glass & Void)

### Visual
- Background: Pure `#050505` with subtle vignette
- Task card: Centered, slightly elevated with soft glow
- Controls: Floating minimal buttons (exit, sound toggle)
- Typography: Larger scale for focus

### Animation
- Enter: Sidebar/Topbar fade out (200ms), task card scales up and centers
- Exit: Reverse animation
- Sound: Fade in/out over 500ms
