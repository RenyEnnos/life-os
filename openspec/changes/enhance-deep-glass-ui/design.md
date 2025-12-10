# Design: Deep Glass Refinements

## Architecture

### Cinematic Flow Engine (`AppLayout`)
The transition logic is simplified to "Optical Only".
- **Old**: `y: 8` (slide) + `scale` + `blur`.
- **New**: `scale` + `blur` ONLY.
- **Why**: Vertical movement implies "stacking" or "pages". We want to imply "refocusing" the same viewport.

### Deep Input Component
The input field is physically modeled as a "cutout" in the glass surface.

```css
/* Deep Input Style */
.input-deep {
  background: rgba(0, 0, 0, 0.2); /* Darker than surface */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3); /* Inner shadow for depth */
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Focus Glow */
.input-glow {
  background: linear-gradient(to right, blue/20, purple/20);
  filter: blur(8px);
}
```

## Component Updates

1.  **`src/app/layout/AppLayout.tsx`**: Update `pageVariants`.
2.  **`src/shared/ui/Input.tsx`**: Replace `Input` implementation. Retain `TextArea` export to prevent breaking changes, ideally styling it similarly.

## Risks
- **Accessibility**: Ensure contrast ratios remain high enough with the transparent backgrounds.
- **Performance**: Blur filters on inputs can be expensive if overused, but acceptable for single focused elements.
