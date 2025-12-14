# Unified Navigation Design

## Philosophy
The navigation should be a quiet, omnipresent anchor in the "Deep Glass" ecosystem. It should feel like a piece of the glass cockpit—functional, beautiful, and consistent.

## Visual Language
- **Glassmorphism**: `bg-zinc-900/20` with `backdrop-blur-xl`.
- **Borders**: `border-r border-white/5` (subtle separation).
- **Active State**:
    - `bg-primary/10`
    - `text-primary`
    - `border-primary/20` (subtle light catch)
    - `shadow-[0_0_15px_rgba(48,140,232,0.2)]` (inner glow)
- **Inactive State**: `text-zinc-500` -> `hover:text-white` & `hover:bg-white/5`.
- **Proportions**:
    - Width: `w-24` (96px) on Desktop.
    - Icon Size: `w-5 h-5` (20px) or `w-6 h-6` (24px). strict consistency.
    - Padding: `py-8` vertical, `gap-6` between items.

## Iconography
- **System**: Lucide React.
- **Style**: Outlined, 2px stroke (default), clean geometry.
- **Consistency**: All navigation items must use imports from `lucide-react`. No mixing with Material Symbols.

## Layout Structure
- **Desktop**: Fixed Sidebar on Left (`aside`).
- **Mobile**: Floating Dock or Bottom Bar (`NavigationSystem` already handles this via `Dock`).
- **Integration**: `AppLayout` controls placement. Feature pages are pure content (`main`).
