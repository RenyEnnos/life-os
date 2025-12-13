# Design: Unify Visual System

## 1. The "Truth" Architecture
We will establish a strict hierarchy for design tokens:

1.  **`src/design/tokens.ts`**: The conceptual definition of the "Biological Design System". It will export the raw values (HSL/Hex) for reference and usage in non-React contexts if needed.
2.  **`index.css`**: The implementation of these tokens as CSS Custom Properties (`--surface`, `--primary`), supporting dynamic theming.
3.  **`tailwind.config.js`**: The consumer of CSS variables, mapping utilities (`bg-surface`) to them.

## 2. Deep Glass Philosophy ("Glass Cockpit")
- **Surface**: Avoid `#000`. Use deep rich grays (e.g., `#060608`) for depth.
- **Lighting**: Use `shadow-inner` and `box-shadow` to create "carved" or "elevated" effects.
- **Borders**: Gradient borders (`border-white/5` to `white/20`) to simulate edge lighting.

## 3. Atomic Components Strategy

### Button (`src/shared/ui/Button.tsx`)
- **Default**: Inner glow, slight gradient background, sophisticated hover (scale + brightness).
- **Glass**: Backdrop blur, subtle border.

### Input (`src/shared/ui/Input.tsx`)
- **State**: Default (Sunken), Focus (Glow + Ring).
- **Texture**: `bg-black/20` with `backdrop-blur`.

## 4. Responsiveness
- **Fluid Type**: Continue usage of `lamp()` from `tailwind.config.js`.
- **Zero-Overflow**: Ensure generic components don't enforce fixed widths that break on `<320px`.
