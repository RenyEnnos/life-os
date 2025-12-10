# Sanctuary Mode - Implementation Tasks

> **Status**: ✅ Core Implementation Complete  
> **Priority**: #3 (After Dynamic Now)

---

## 1. State Management
- [x] 1.1 Create `src/shared/stores/sanctuaryStore.ts` (Zustand)
- [x] 1.2 Implement state: `isActive`, `activeTaskId`, `soundEnabled`, `soundType`
- [x] 1.3 Implement actions: `enter()`, `exit()`, `toggleSound()`, `setSoundType()`
- [x] 1.4 TypeScript types for `SanctuaryState` and `SoundType`

## 2. Audio Engine (Web Audio API)
- [x] 2.1 Create `src/shared/lib/audio/noiseGenerator.ts`
- [x] 2.2 Implement white noise generation (no external files)
- [x] 2.3 Implement pink noise variant
- [x] 2.4 Implement brown noise variant
- [x] 2.5 Add volume control and fade in/out

## 3. Core Components
- [x] 3.1 Create `src/shared/ui/sanctuary/SanctuaryOverlay.tsx` (main container)
- [x] 3.2 Create `src/shared/ui/sanctuary/SanctuaryTask.tsx` (centered task view) → *Inlined*
- [x] 3.3 Create `src/shared/ui/sanctuary/SanctuaryControls.tsx` (exit, sound buttons) → *Inlined*
- [x] 3.4 Create `src/shared/ui/sanctuary/sanctuary.css` (styling)

## 4. Layout Integration
- [x] 4.1 Update `MainLayout.tsx` to conditionally hide Sidebar/Topbar → *Overlay covers everything*
- [x] 4.2 Mount `SanctuaryOverlay` when `isActive = true`
- [x] 4.3 Add smooth enter/exit animations with Framer Motion

## 5. Task Integration
- [ ] 5.1 Add "Enter Sanctuary" button to TaskCard
- [ ] 5.2 Add keyboard shortcut (e.g., `Cmd+Shift+S`) to enter with selected task
- [x] 5.3 Wire button to `sanctuaryStore.enter(taskId)`

## 6. Synapse Integration
- [x] 6.1 Add "Enter Sanctuary Mode" command to Synapse Bar
- [ ] 6.2 Add "Exit Sanctuary Mode" command (only visible when active)

## 7. Verification
- [x] 7.1 Test entering Sanctuary hides Sidebar/Topbar
- [x] 7.2 Test Escape key exits Sanctuary
- [x] 7.3 Test audio plays and stops correctly
- [x] 7.4 Test audio fades in/out smoothly
- [x] 7.5 Run `npm run check` and `npm run build`

---

## Summary

**Core Features Implemented:**
- Full Web Audio noise generator (white, pink, brown noise)
- Beautiful full-screen overlay with Glass & Void design
- Keyboard shortcuts (Esc to exit, S to toggle sound)
- Sound type selector (white/pink/brown)
- Synapse Bar integration ("Enter Sanctuary" command)
- Smooth Framer Motion animations

**Remaining Work (Phase 2):**
- TaskCard "Enter Sanctuary" button
- Pass actual task context when entering
- Exit command in Synapse (conditional)
