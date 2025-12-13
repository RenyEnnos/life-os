# Design: Total UI Overhaul

## 1. Foundation & Design Tokens

### Tailwind Configuration
Refactor `tailwind.config.js` to strictly use CSS Variables, enabling dynamic runtime theming and "Deep Glass" effects.

```javascript
// tailwind.config.js (Proposed)
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))", // #030303
        surface: "hsl(var(--surface))", // #0A0A0B
        primary: "hsl(var(--primary))", // #007bff
        // ... mapped to global.css variables
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        // Fluid Typography
        xs: "clamp(0.75rem, 0.70rem + 0.25vw, 0.875rem)",
        sm: "clamp(0.875rem, 0.83rem + 0.21vw, 1rem)",
        base: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
        lg: "clamp(1.125rem, 1.08rem + 0.23vw, 1.25rem)",
        xl: "clamp(1.25rem, 1.20rem + 0.25vw, 1.5rem)",
        "2xl": "clamp(1.5rem, 1.45rem + 0.25vw, 1.875rem)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/container-queries")],
}
```

### Global CSS (Variables)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 1.2%; /* #030303 */
    --surface: 240 5.9% 4%; /* #0A0A0B */
    --primary: 211 100% 50%; /* #007bff */
    --header-height: 4rem;
  }
}
```

## 2. Layout Strategy

### AppLayout Refactor
Move from fixed padding (`pl-24`) to a grid/flex strategy that respects the device state.

```tsx
// src/app/layout/AppLayout.tsx (Sketch)
export function AppLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Sidebar morphs based on screen size */}
      <NavigationSystem /> 
      
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 pt-[var(--header-height)] md:pt-8 mb-20 md:mb-0">
        <PageTransition>
           <Outlet />
        </PageTransition>
      </main>
      
      <BackgroundEffects />
    </div>
  )
}
```

### Navigation System
- **Desktop (>768px)**: Fixed Sidebar on left.
- **Mobile (<768px)**: Bottom Navigation Bar + Header with Hamburger menu (for less frequent items) if needed, or just smart Bottom Bar.

## 3. "Deep Glass" Components

### Bento Cards
Use `@container` queries to make cards self-aware of their size.

```tsx
<div className="@container card-wrapper">
  <div className="flex flex-col @sm:flex-row gap-4 p-4 rounded-xl bg-surface/50 backdrop-blur-xl border border-white/10">
    <div className="w-full @sm:w-1/3">Icon</div>
    <div className="w-full @sm:w-2/3">Content</div>
  </div>
</div>
```

## 4. Performance & Micro-interactions
- Use `will-change-transform` sparingly.
- Memoize `Particles` and heavy visual effects.
- Lazy load widgets below the fold.
