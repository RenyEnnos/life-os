# LifeOS 2.5 Design System

**Core Philosophy:**
A "Digital Cockpit" aesthetic. High contrast, OLED-optimized, focused on data clarity and flow state.

## Color Palette
- **Background:** `OLED Black (#050505)` - Absolute deep black for contrast and battery saving.
- **Surface (Glass):** `rgba(24, 24, 27, 0.4)` - Used for widgets, sidebars, and cards. Requires `backdrop-filter: blur(12px)`.
- **Primary Accent:** `Electric Blue (#308ce8)` - For active states, primary buttons, and key data points.
- **Secondary Accent:** `Success Green (#10b981)` - For completion states (habits, goals).
- **Text Primary:** `White (#ffffff)` - Headings and main data.
- **Text Secondary:** `Zinc 400 (#a1a1aa)` - Labels and metadata.
- **Border:** `rgba(255, 255, 255, 0.05)` - Subtle definition for glass components.

## Typography
- **Font Family:** `Inter` (Google Fonts).
- **Weights:** Light (300) for large numbers, Regular (400) for body, Medium (500) for headings.

## Shape & Layout
- **Containers:** Rounded 24px (Outer Widgets).
- **Inner Elements:** Rounded 12px or 16px (Buttons, Inputs, Inner Cards).
- **Spacing:** Generous padding (24px standard).
- **Grid:** Bento Grid layout (modular, masonry-style).

## Interactive Components
- **Buttons:** Glass background with hover glow effect (Electric Blue shadow).
- **Inputs:** Pill-shaped glass fields with icon prefixes.
- **Navigation:** Vertical sidebar with icon-only or icon+text items. Active state = Electric Blue text + Glow.
