# Synapse Bar - Implementation Tasks

> **Status**: ✅ Implemented  
> **Priority**: #1 (Foundation for all future UI interactions)

---

## 1. Setup & Dependencies
- [x] 1.1 Install `cmdk` package via npm
- [x] 1.2 Verify `cmdk` works with existing React 18 + Vite setup
- [x] 1.3 Create directory structure: `src/shared/ui/synapse/`, `src/shared/lib/synapse/`

## 2. Zustand Store
- [x] 2.1 Create `src/shared/stores/synapseStore.ts`
- [x] 2.2 Implement state: `isOpen`, `query`, `activeGroup`
- [x] 2.3 Implement actions: `open()`, `close()`, `toggle()`, `setQuery()`
- [x] 2.4 Add TypeScript types for `SynapseState` and `SynapseGroup`

## 3. Core Components
- [x] 3.1 Create `src/shared/ui/synapse/Synapse.tsx` (main export with Portal)
- [x] 3.2 Create `src/shared/ui/synapse/SynapseDialog.tsx` (cmdk.Dialog wrapper) → *Implemented inline in Synapse.tsx*
- [x] 3.3 Create `src/shared/ui/synapse/SynapseInput.tsx` (search input) → *Implemented inline*
- [x] 3.4 Create `src/shared/ui/synapse/SynapseList.tsx` (groups container) → *Implemented inline*
- [x] 3.5 Create `src/shared/ui/synapse/SynapseGroup.tsx` (group header + items) → *Implemented inline*
- [x] 3.6 Create `src/shared/ui/synapse/SynapseItem.tsx` (individual command) → *Implemented inline*
- [x] 3.7 Create `src/shared/ui/synapse/SynapseFooter.tsx` (keyboard hints) → *Implemented inline*

## 4. Styling (Glass & Void)
- [x] 4.1 Create `src/shared/ui/synapse/synapse.css` with Glass & Void styles
- [x] 4.2 Apply backdrop blur, subtle borders, #050505 background
- [x] 4.3 Style selected item state with subtle highlight
- [x] 4.4 Add Framer Motion enter/exit animations
- [x] 4.5 Ensure z-index is above all app content

## 5. Global Keyboard Listener
- [x] 5.1 Create hook `useGlobalSynapseShortcut.ts` → *Implemented in Synapse.tsx useEffect*
- [x] 5.2 Listen for `Cmd+K` (Mac) and `Ctrl+K` (Windows/Linux)
- [x] 5.3 Prevent default browser behavior
- [x] 5.4 Wire hook to `synapseStore.toggle()`

## 6. Command Groups Structure
- [x] 6.1 Define command types in `src/shared/lib/synapse/types.ts`
- [x] 6.2 Create static command definitions in `src/shared/lib/synapse/commands.ts`
- [x] 6.3 Organize commands by new nomenclature groups:
  - Actions (Tasks)
  - Missions (Projects)
  - Rituals (Habits)
  - Resources (Finances)
  - Memory (Journal)
  - Nexus (AI Assistant)
- [x] 6.4 Add icons using `lucide-react`

## 7. App Integration
- [x] 7.1 Mount `<Synapse />` in `src/app/App.tsx` (at root level)
- [x] 7.2 Verify Dialog appears above all content
- [x] 7.3 Test keyboard shortcut from different pages
- [x] 7.4 Ensure ESC closes the dialog

## 8. Verification
- [x] 8.1 Manual test: `Cmd+K` opens Synapse from Dashboard/Horizon
- [x] 8.2 Manual test: `Cmd+K` opens Synapse from other pages
- [x] 8.3 Manual test: ESC closes Synapse
- [x] 8.4 Manual test: Click outside closes Synapse
- [x] 8.5 Manual test: Keyboard navigation works (↑/↓/Enter)
- [x] 8.6 Visual test: Glass & Void styling matches design specs
- [x] 8.7 Run `npm run check` (TypeScript validation)
- [x] 8.8 Run `npm run lint` (ESLint validation) → *Synapse files pass; pre-existing issues in other files*
- [x] 8.9 Run `npm run build` (production build succeeds)

---

## Dependencies

| Task | Depends On |
|---|---|
| 3.x Core Components | 1.x Setup, 2.x Zustand Store |
| 4.x Styling | 3.x Core Components |
| 5.x Keyboard Listener | 2.x Zustand Store |
| 6.x Command Groups | 3.x Core Components |
| 7.x App Integration | All above |
| 8.x Verification | 7.x App Integration |

## Parallelizable Work

- **2.x Zustand Store** and **1.x Setup** can be done in parallel
- **4.x Styling** and **6.x Command Groups** can be done in parallel after 3.x
- **5.x Keyboard Listener** can be done after 2.x, independent of 3.x/4.x
