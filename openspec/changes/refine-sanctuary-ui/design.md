# Design: Sanctuary Mode "Ritual" UI

## Aesthetic: Glass & Void
The visual language is inspired by "zen mode" in premium editors and meditation apps.
*   **Color Palette**: Deepest blacks (`#050505`) to reduce eye strain and OLED battery usage. A subtle radial gradient simulates a vignette, focusing attention on the center.
*   **Typography**: The active task title is the hero. We use a Serif font to differentiate the "sacred" focus time from the utilitarian sans-serif UI of the rest of the app.
*   **Motion**: Transitions are slow and deliberate (0.8s). The interface should feel like it's "breathing" or "submerging" the user into the zone.

## Architecture
### Layout Integration
The `SanctuaryOverlay` needs to be a direct child of the root layout, likely in `AppLayout.tsx`, significantly, it must be *after* the `Outlet` and Sidebar elements in the DOM order (or have higher z-index) to obscure them visually.

```tsx
// src/app/layout/AppLayout.tsx
return (
  <div className="...">
    <Sidebar />
    <main><Outlet /></main>
    <SanctuaryOverlay /> {/* z-50 fixed inset-0 */}
  </div>
)
```

### Component Structure (`SanctuaryOverlay.tsx`)
*   **Container**: `fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]`
*   **Background**: Radial gradient overlay.
*   **Content**:
    *   Main Text: `text-4xl font-serif text-white/90`
    *   Hint: `text-white/30 text-sm mt-4`
*   **Controls Container**: `fixed bottom-12`
    *   Opacity: `opacity-50 hover:opacity-100 transition-opacity`
    *   Elements: Play/Pause, Volume Slider (optional), Noise Selector.

## State Management
Uses `useSanctuaryStore` (already implemented).
*   `activeTaskTitle`: Displayed prominently.
*   `soundEnabled`, `soundType`, `volume`: Controlled by the UI.
*   `exit()`: Triggered by Esc key or simple exit button.

## Accessibility
*   **Focus Management**: When active, focus should ideally be trapped within the overlay or at least the "Exit" button should be easily reachable via keyboard.
*   **Reduced Motion**: Respect user's reduced motion preferences (though the "slow" transition is generally gentle).
