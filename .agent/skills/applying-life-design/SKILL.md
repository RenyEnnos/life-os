---
name: applying-life-design
description: Enforces the LifeOS premium aesthetic (Glassmorphism, Animations, Tailwind) on UI components. Use when designing interfaces or creating new React components.
---

# Applying Life Design

This skill enforces the "Second Brain" premium aesthetic defined for the LifeOS project. It ensures consistency across all UI components using Glassmorphism, specific Tailwind tokens, and Framer Motion animations.

## When to use this skill
- When the user asks to "design a component" or "create a page".
- When fixing "ugly" or "broken" UI.
- When creating widgets, modals, or cards.

## Workflow
1.  **Structure**: Use semantic HTML wrapped in `motion.div` for entry animations.
2.  **Styling**: Apply the Glassmorphism Formula (see below).
3.  **Interaction**: Ensure all interactive elements have hover states and micro-interactions.

## Instructions

### 1. The Glassmorphism Formula
NEVER use solid backgrounds for containers. Use layers of transparency.

**Standard Card/Container:**
```tsx
<div className="bg-zinc-900/20 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg">
  {/* Content */}
</div>
```

**Hoverable Item:**
```tsx
<div className="hover:bg-white/5 hover:border-white/10 transition-all duration-300">
```

### 2. Typography & Inputs
-   **Fonts**: `font-display` for headers, `font-sans` for body, `font-mono` for data/code.
-   **Inputs**: No borders by default. "Phantom" inputs preferred.

**Standard Input:**
```tsx
<input 
  className="bg-transparent border-none text-zinc-200 placeholder-zinc-600 focus:ring-0" 
  placeholder="Type here..." 
/>
```

### 3. Animation Standards
Use `framer-motion` for all entrances.

**Page/Modal Entrance:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", duration: 0.5 }}
>
```

### 4. Color Palette
-   **Primary**: Do not use raw colors. Use `text-primary` or `bg-primary/20`.
-   **Text**: `text-zinc-200` (Main), `text-zinc-400` (Secondary), `text-zinc-600` (Disabled).
-   **Borders**: Always `border-white/5` or `border-white/10`.

## Resources
- [Tailwind Config](file:///src/index.css) (Check for custom colors)
