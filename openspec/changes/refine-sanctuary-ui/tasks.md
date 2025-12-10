# Tasks

- [x] Update `SanctuaryOverlay.tsx` structure and styles <!-- id: 0 -->
    - [x] Implement container with `#050505` background and radial vignette.
    - [x] Apply Framer Motion variants for slow entrance/exit (0.8s easeInOut).
    - [x] Style the active task title with Serif font and large size.
    - [x] Create the bottom control bar with opacity transition (faded by default, visible on hover).
    - [x] Ensure "Esc" key listener is robust.
- [x] Integrate `SanctuaryOverlay` into `AppLayout.tsx` <!-- id: 1 -->
    - [x] Import `SanctuaryOverlay`.
    - [x] Place it at the root level (likely inside the `return` statement, after other content).
    - [x] Ensure `z-index` is high enough (e.g., `z-50`) to cover Sidebar and Dock.
- [x] Verify functionality <!-- id: 2 -->
    - [x] Activate Sanctuary Mode (via store or command).
    - [x] Confirm Sidebar/Dock are covered.
    - [x] Test interactions (audio toggle, volume, exit).
    - [x] Test "Esc" key.
