---
type: reference
status: active
last_updated: 2026-04-27
tags: [design-system, ui, tokens]
---

# LifeOS Design System

> **Platform:** LifeOS is an Electron-first desktop application. This design system targets the desktop experience as the primary canvas. Web and mobile layouts exist as responsive fallbacks.

## 1. Visual Theme & Atmosphere

LifeOS is built on the "Digital Cockpit" philosophy — a design language inspired by high-performance avionics and modern spacecraft interfaces, adapted for personal productivity. The guiding principle is **zero ambient noise, maximum signal**: every pixel exists to communicate data clearly, never to decorate.

The experience centers on a void. An OLED-black canvas eliminates visual weight, allowing content to emerge with weightlessness and precision. Glassmorphism panels float above this void, their translucent surfaces and subtle blur creating a sense of layered depth — like looking through a cockpit canopy at the instruments beyond. There is no skeuomorphism, no faux-materials, no unnecessary ornamentation. The interface is honest about being software, and confident in that identity.

The atmosphere is deliberately calm and focused. Color is used with extreme restraint: electric blue appears only where the user's attention should land — active states, critical data points, actionable buttons. The rest of the palette operates in near-monochrome, allowing the eye to rest until guided. This scarcity of color is what makes it powerful. When something is blue in LifeOS, it matters.

The design prioritizes **flow state**. No element competes for attention. Transitions are swift but smooth — fast enough to feel responsive, gentle enough to avoid jarring. The spatial layout follows cockpit ergonomics: primary instruments front and center, secondary context in peripheral panels, always glanceable, always contextual.

### Key Characteristics

- **OLED-first backgrounds** — `#050505` as the foundational canvas, true black for zero light emission on OLED panels and maximum contrast for all overlay elements
- **Glassmorphism layers** — translucent surfaces with `backdrop-blur`, subtle borders at 5% white opacity, and ambient shadows that suggest elevation without heaviness
- **Surgical use of color** — electric blue (`#308ce8`) is the sole accent, reserved exclusively for interactive states, active navigation, and key data values; all other surfaces live in near-grayscale
- **Ambient glow** — soft blue radiance (`rgba(48, 140, 232, 0.15)`) emanates from active elements, creating a sense of energy without visual clutter
- **Depth through shadow** — deep ambient shadows (`0 20px 60px rgba(0, 0, 0, 0.80)`) separate floating panels from the void beneath, establishing a clear z-axis hierarchy
- **Typographic clarity** — near-white text (`#ffffff`) for primary data, muted zinc (`#a1a1aa`) for labels and metadata; no decorative typefaces, pure functional legibility
- **Semantic restraint** — green (`#10b981`) exclusively for completion and success; red (`#ef4444`) exclusively for errors and destructive actions; never both present simultaneously without intentional contrast

---

## 2. Color Palette & Roles

Every color in LifeOS has a singular, clearly defined role. There are no decorative colors — each token maps to a specific interaction pattern or semantic meaning.

### Primary

- **Electric Blue** (`#308ce8`, HSL `210 79% 55%`): The single accent color of the entire interface. Used for primary action buttons, active navigation states, selected items, data highlights, and interactive links. Its high saturation and moderate lightness ensure strong contrast against both the OLED black background and glass surfaces. This color carries the full weight of interactivity — when it appears, the user knows they can act.

### Surface & Glass

- **OLED Black** (`#050505`, HSL `0 0% 1.2%`): The foundational background color. Near-true black optimized for OLED displays to minimize power consumption and eliminate backlight bleed. Serves as the visual "void" from which all content floats. On non-OLED displays, it reads as a deep, non-reflective charcoal that avoids the harshness of pure `#000000`.
- **Glass Surface** (`rgba(24, 24, 27, 0.4)`, HSL `240 5.9% 6%` at 40% opacity): The primary panel and card background. Applied with `backdrop-blur` to create the signature translucent glass effect — content behind the panel softly diffuses, creating depth. At 40% opacity over the OLED background, it reads as a subtle, barely-there layer of surface without competing with content.
- **Surface Highlight** (HSL `240 5% 10%`): A slightly elevated surface state for hover and focus interactions on cards and list items. Provides immediate tactile feedback — the panel brightens imperceptibly, signaling interactivity without breaking the dark atmosphere.
- **Glass Border** (`rgba(255, 255, 255, 0.05)`): An ultra-subtle edge definition applied to glass panels. At 5% white opacity, it is nearly invisible in isolation but provides critical separation between adjacent surfaces and floating elements. This single-pixel border is what prevents glass panels from dissolving into the background.

### Interactive

- **Accent Glow** (`rgba(48, 140, 232, 0.15)`): A soft, diffused blue radiance applied as a box-shadow or background gradient around focused and active elements. At 15% opacity, it creates an ambient energy halo — the feeling that an element is "powered on" — without introducing hard visual edges. Used on focused inputs, active buttons, and highlighted data widgets.
- **Link & Hover** (`#308ce8`): All clickable text and interactive non-button elements use Electric Blue. On hover, secondary elements transition to this color to signal they are actionable. Never used for static text.
- **Focus Ring** (`rgba(48, 140, 232, 0.4)`): The keyboard navigation focus indicator. At 40% opacity, it is clearly visible for accessibility without being visually heavy. Rendered as a 2px outline offset from the focused element, ensuring WCAG-compliant visibility on all surface types.

### Semantic

- **Success Green** (`#10b981`): Exclusively reserved for positive completion states — habit check-ins, goal achievements, successful sync indicators, and confirmed actions. Applied as text color, icon fill, or progress-bar fill. Never used decoratively. When green appears, something has been accomplished.
- **Warning Red** (`#ef4444`): Used for errors, destructive action confirmations, missed deadlines, and critical alerts. High-saturation red ensures immediate recognition. Applied sparingly — an error state should be impossible to overlook but equally impossible to mistake for a decorative element.
- **Destructive** (HSL `0 84.2% 60.2%`): The system destructive token, mapped to confirmation dialogs, delete buttons, and irreversible action triggers. Distinct from the general warning red in HSL space to allow targeted theming, but visually similar in its urgency. Pairing this color with explicit text confirmation ("Are you sure?") is a mandatory interaction pattern.

### Neutral Scale

- **Text Primary** (`#ffffff`, HSL `0 0% 93%` at actual rendering): The primary text color for headings, data values, and all high-priority content. Rendered at near-white for maximum contrast against the dark background. Every major data point, title, and user-facing value uses this color.
- **Text Secondary** (`#a1a1aa`, Zinc-400): Applied to labels, timestamps, placeholder text, helper descriptions, and metadata. At this zinc value, it is clearly legible but visually recessive — the eye skips over it when scanning for primary data, yet it is available when sought. Essential for maintaining hierarchy without adding visual noise.
- **Muted** (HSL `240 3.7% 15.9%`): The muted background state, used for disabled surfaces, collapsed sections, and inactive tabs. Visually signals "this area is present but not currently relevant."
- **Muted Foreground** (HSL `240 5% 64.9%`): Text color for muted or disabled content. Lower contrast than secondary text, reinforcing that the element is non-interactive. Used for placeholder states, disabled form labels, and empty-state descriptive text.

### Shadows

- **Glass Shadow** (`0 20px 60px rgba(0, 0, 0, 0.80)`): The primary drop shadow for elevated glass panels. The large vertical offset (20px) and wide blur (60px) create a sense of significant elevation — the panel appears to float high above the background. At 80% opacity, the shadow is deep and rich, reinforcing the void-like quality of the canvas beneath.
- **Ambient Shadow** (`0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.60)`): A compound shadow combining a 1px white border-glow (at 8% opacity) with a softer, closer drop shadow. Used for secondary surfaces, dropdown panels, and tooltips — elements that are elevated but not floating as high as primary cards. The white border component creates a subtle "edge light" effect, as if ambient light is catching the panel's rim.

---

## 3. Typography Rules

Typography in LifeOS is engineered for glanceability and precision. Every typeface, weight, and spacing decision serves the cockpit philosophy: data must be legible at a distance, hierarchy must be instant, and the reader should never have to decode the interface to find the information they need.

### Font Family

| Role | Font | Source | Notes |
|------|------|--------|-------|
| **Primary UI** | Inter | Google Fonts (self-hosted `.woff2`) | The sole workhorse. Clean geometric sans-serif with excellent screen rendering at all sizes. |
| **Icons** | Material Symbols Outlined | Google Fonts (variable) | Variable font with adjustable weight, grade, and optical size. Outlined style only for consistency. |
| **Monospace** | Custom (LifeOS Mono) | `/assets/fonts/monospace.woff2` | Proprietary `.woff2` for code blocks, IDs, timestamps, and data tables. |

**Font features enabled globally:**

```css
font-feature-settings: "cv11", "cv05", "ss01";
```

- `cv11` — Alternate single-story "a" for improved legibility at small sizes
- `cv05` — Open-form "6" and "9" to reduce misreads in data-heavy views
- `ss01` — Stylistic set for consistent numeral widths in tabular data

**Variable font axis configuration:**

```css
font-variation-settings: "wght" 400;
```

Weights are applied dynamically per element. The full Inter weight spectrum is loaded:

| CSS Weight | Class Token | Usage |
|-----------|-------------|-------|
| 200 | `font-thin` | Display headings, large numerical data |
| 300 | `font-light` | Secondary display text, decorative headings |
| 400 | `font-normal` | Body text, descriptions, standard content |
| 500 | `font-medium` | Section headings, button labels, UI chrome |
| 600 | `font-semibold` | Emphasized data, active navigation, alerts |

### Typography Scale

The type scale is anchored to a modular ratio of **1.25 (Major Third)**, providing clear hierarchical jumps without excessive size variation. All sizes are expressed in `rem` for accessibility scaling.

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 4rem;      /* 64px */
```

### Font Scale System

LifeOS supports user-driven font scaling via a `data-font-scale` attribute on the `<html>` element. This allows users to adjust the global type size without breaking layout or requiring a page reload.

```html
<html data-font-scale="lg">
```

| Scale Token | Multiplier | Use Case |
|-------------|-----------|----------|
| `xs` | 0.75x | Dense data views, compact dashboards |
| `sm` | 0.875x | Standard compact mode |
| `md` | 1.00x | Default — no attribute needed |
| `lg` | 1.125x | Comfortable reading, presentations |
| `xl` | 1.25x | Accessibility, large display setups |
| `2xl` | 1.50x | Maximum accessibility scaling |

The scale applies uniformly to all `rem`-based values (type, spacing, sizing) via a CSS custom property cascade:

```css
[data-font-scale="xs"] { --font-scale: 0.75; }
[data-font-scale="sm"] { --font-scale: 0.875; }
[data-font-scale="md"] { --font-scale: 1; }
[data-font-scale="lg"] { --font-scale: 1.125; }
[data-font-scale="xl"] { --font-scale: 1.25; }
[data-font-scale="2xl"] { --font-scale: 1.5; }
```

### Hierarchy Table

| Role | Size | Weight | Line Height | Letter Spacing | Context |
|------|------|--------|-------------|----------------|---------|
| **Display XL** | 48–64px | 200 (Thin) | 1.05 (tight) | -0.03em | Hero headings, splash screens, large metric callouts. Designed for maximum visual impact with minimum visual weight — the thin stroke creates an elegant, almost ethereal presence against the void. |
| **Display** | 36–48px | 200 (Thin) | 1.1 | -0.02em | Secondary hero text, section introductions, feature highlights. Used when prominence is needed but the content is not the singular focus of the view. |
| **Heading 1** | 30–36px | 500 (Medium) | 1.25 | -0.01em | Page titles, modal titles, primary view headers. The medium weight provides strong presence without heaviness. Always paired with significant top margin (32–48px) to establish breathing room. |
| **Heading 2** | 24px | 500 (Medium) | 1.3 | 0 | Section headers within views, card group titles, form section labels. The neutral letter spacing ensures clean alignment in grid layouts. |
| **Heading 3** | 18–20px | 500 (Medium) | 1.35 | 0 | Card titles, widget headers, sub-section labels. The upper size bound (20px) is used for primary data widgets; the lower bound (18px) for secondary cards and list item headings. |
| **Body** | 14–16px | 400 (Regular) | 1.6 | 0 | The workhorse. All descriptive text, form content, settings descriptions, modal body copy, and general prose. At 14px, it is used within dense data views; 16px is the standard for all other contexts. The 1.6 line-height optimizes for sustained reading comfort. |
| **Body Small** | 13px | 400 (Regular) | 1.5 | 0 | Secondary text, helper descriptions, timestamps, placeholder text, metadata lines. Distinct enough from Body to create clear visual hierarchy but not so small as to require squinting. |
| **Caption / Label** | 11–12px | 500 (Medium) | 1.4 | 0.05–0.08em (uppercase) | UI labels, badges, status indicators, form field labels, column headers in tables. Always uppercase with expanded tracking to create visual distinction at small sizes. The medium weight ensures legibility despite the reduced size. |
| **Data / Large Numbers** | 36–48px | 200 (Thin) | 1.05 | -0.02em | Dashboard metrics, habit streak counts, score displays, timer readouts. The thin weight transforms numerical data into a visual centerpiece — the numbers float with a weightlessness that reinforces the "digital cockpit" metaphor. |

### Line Height & Spacing Principles

- **Display sizes** use tight line heights (1.05–1.1) to maintain visual cohesion in multi-line hero text
- **Body text** uses a generous 1.6 ratio for sustained reading comfort
- **Labels and captions** use tighter line heights (1.4) since they are never multi-line in practice
- **Letter spacing** is negative for large display text (optical correction) and positive for small uppercase labels (breathability)

### Typographic Contrast Ratios

All text combinations meet WCAG AAA contrast requirements against their respective backgrounds:

| Text Color | Background | Contrast Ratio |
|-----------|------------|----------------|
| `#ffffff` | `#050505` (OLED Black) | **21.0:1** (AAA) |
| `#a1a1aa` | `#050505` (OLED Black) | **9.8:1** (AAA) |
| `#ffffff` | `rgba(24, 24, 27, 0.4)` (Glass) | **17.2:1** (AAA) |
| `#a1a1aa` | `rgba(24, 24, 27, 0.4)` (Glass) | **8.1:1** (AAA) |
| `#ffffff` | `#308ce8` (Electric Blue) | **4.6:1** (AA) |

---

## 4. Component Stylings

Every component in LifeOS follows a unified material language: glass surfaces, subtle depth, and the electric blue accent reserved for interactive truth. Components are built with [CVA (Class Variance Authority)](https://cva.style) for type-safe variant composition, ensuring consistency across every instance.

### Button

**Source:** `src/shared/ui/Button.tsx`

Buttons are the primary interaction surface in LifeOS. Each variant communicates a distinct intent through its visual weight, from the prominence of a primary action to the quiet affordance of a ghost button. All buttons include a tactile micro-interaction: a subtle scale-down on press (0.97) and a smooth spring-back release.

| Variant | Background | Text | Border | Radius | Hover | Active | Use |
|---------|-----------|------|--------|--------|-------|--------|-----|
| **Primary** | `#308ce8` | `#ffffff` | None | `12px` (xl) | Glow shadow `0 0 20px rgba(48, 140, 232, 0.3)`, brightness 1.1 | Scale 0.97 | Primary actions: Save, Create, Confirm. The single most prominent interactive element in any view. |
| **Secondary** | `rgba(24, 24, 27, 0.4)` | `#ffffff` | `1px solid rgba(255, 255, 255, 0.05)` | `12px` (xl) | Background lightens to `rgba(24, 24, 27, 0.6)`, border to `rgba(255, 255, 255, 0.1)` | Scale 0.97 | Secondary actions: Edit, Filter, Sort. Present but not commanding attention. |
| **Outline** | Transparent | `#ffffff` | `1px solid rgba(255, 255, 255, 0.1)` | `12px` (xl) | Border brightens to `rgba(255, 255, 255, 0.2)`, bg `rgba(255, 255, 255, 0.02)` | Scale 0.97 | Tertiary actions, navigation within dense UIs. Minimal visual footprint. |
| **Destructive** | `#ef4444` | `#ffffff` | None | `12px` (xl) | Glow shadow `0 0 20px rgba(239, 68, 68, 0.3)`, brightness 1.1 | Scale 0.97 | Irreversible actions: Delete, Remove, Reset. High-saturation red demands pause before action. |
| **Ghost** | Transparent | `#a1a1aa` | None | `12px` (xl) | Background `rgba(255, 255, 255, 0.05)`, text `#ffffff` | Scale 0.97 | Minimal actions: Close, dismiss, overflow menu triggers. Disappears into the interface until needed. |
| **Link** | Transparent | `#308ce8` | None | `0` | Underline, opacity 0.8 | Scale 0.97 | Inline text links, "See all" navigation, contextual redirects. |

**Size scale:**

| Size | Height | Padding (x) | Font Size | Icon Size |
|------|--------|-------------|-----------|-----------|
| `sm` | 32px | 12px | 13px | 16px |
| `md` | 40px | 16px | 14px | 18px |
| `lg` | 48px | 20px | 16px | 20px |

**Disabled state:** Opacity 0.4, pointer-events none, no hover transition.

---

### BentoCard

**Source:** `src/shared/ui/BentoCard.tsx`

The BentoCard is the foundational container for all dashboard content. It implements the signature glassmorphism effect with an interactive spotlight that follows the cursor, creating the sensation of illuminating a translucent panel with a flashlight.

**Visual properties:**

| Property | Value | Notes |
|----------|-------|-------|
| Background | `rgba(24, 24, 27, 0.4)` | Glass surface at 40% opacity |
| Backdrop Filter | `blur(24px)` | Extra-strong blur for pronounced depth |
| Border | `1px solid rgba(255, 255, 255, 0.05)` | Near-invisible edge definition |
| Border Radius | `24px` (3xl) | Generous rounding for floating panel aesthetic |
| Box Shadow | `0 20px 60px rgba(0, 0, 0, 0.80)` | Deep ambient shadow for elevation |
| Padding | `24px` | Standard internal spacing |

**Interactive states:**

| State | Transformation | Transition |
|-------|---------------|------------|
| **Default** | `scale(1)`, opacity 1 | — |
| **Hover** | `scale(1.01)`, spotlight gradient overlay at cursor position | Spring (280, 26) |
| **Tap/Press** | `scale(0.98)` | Spring (400, 30) |

The **spotlight effect** is a radial gradient (`rgba(48, 140, 232, 0.06)`) positioned at the cursor coordinates via Framer Motion's `useMotionValue` and `useTransform`. The gradient has a 200px radius, creating a soft pool of blue that reveals the card's interactive nature. The spotlight is clipped to the card's border-radius via `overflow: hidden`.

**Bento size variants:**

| Variant | Grid Span | Min Height | Use |
|---------|-----------|------------|-----|
| `sm` | 1 column | 120px | Metric widgets, status indicators, toggle cards |
| `md` | 1 column | 200px | Standard cards: habits, tasks, weather, calendar preview |
| `lg` | 2 columns | 280px | Featured widgets: main chart, habit overview, focus timer |
| `xl` | 2 columns | 400px | Hero widgets: primary visualization, detailed analytics |

---

### Input & TextArea

**Source:** `src/shared/ui/Input.tsx`

Form inputs in LifeOS follow a glass-pill aesthetic — rounded, translucent, and unobtrusive. The goal is to make data entry feel like filling liquid into a vessel: smooth, contained, and satisfying.

**Visual properties:**

| Property | Value |
|----------|-------|
| Background | `rgba(24, 24, 27, 0.3)` |
| Border | `1px solid rgba(255, 255, 255, 0.08)` |
| Border Radius | `9999px` (pill) for Input; `16px` (2xl) for TextArea |
| Text Color | `#ffffff` |
| Placeholder Color | `#71717a` (Zinc-500) |
| Padding | `12px 16px` (Input) / `12px 16px` (TextArea) |
| Height | 44px (Input) |

**State transitions:**

| State | Border | Shadow | Notes |
|-------|--------|--------|-------|
| **Default** | `rgba(255, 255, 255, 0.08)` | None | Quiet, blends into surface |
| **Focus** | `#308ce8` | `0 0 0 3px rgba(48, 140, 232, 0.15)` | Electric blue border + soft glow ring |
| **Error** | `#ef4444` | `0 0 0 3px rgba(239, 68, 68, 0.15)` | Red border + soft red glow ring |
| **Disabled** | `rgba(255, 255, 255, 0.04)` | None | Opacity 0.6, cursor not-allowed |

**Prefix/suffix support:** Inputs accept left-aligned icon prefixes (20px Material Symbol) and right-aligned action suffixes (clear button, unit label). The prefix icon is rendered in Zinc-500, transitioning to Electric Blue on focus.

---

### Modal

**Source:** `src/shared/ui/Modal.tsx`

Modals are rendered via React Portal directly into `document.body`, ensuring they always sit above all other content regardless of DOM nesting. The modal system implements a layered backdrop strategy: the backdrop is a semi-transparent black overlay with a 4px blur, while the modal surface itself is a glass panel with stronger blur.

**Visual properties:**

| Property | Value |
|----------|-------|
| **Backdrop** | `rgba(0, 0, 0, 0.6)`, `backdrop-blur(4px)` |
| **Surface Background** | `rgba(24, 24, 27, 0.8)` |
| **Surface Backdrop** | `blur(40px)` |
| **Surface Border** | `1px solid rgba(255, 255, 255, 0.08)` |
| **Border Radius** | `16px` (2xl) |
| **Max Width** | 560px (default), 720px (wide), 400px (compact) |
| **Box Shadow** | `0 25px 80px rgba(0, 0, 0, 0.90)` |

**Animation (Framer Motion):**

| Phase | Property | Value |
|-------|----------|-------|
| **Enter** | Opacity | 0 → 1 (200ms ease-out) |
| **Enter** | Scale | 0.95 → 1 (spring: 300, 25) |
| **Enter** | Y | 8px → 0 (spring: 300, 25) |
| **Exit** | Opacity | 1 → 0 (150ms ease-in) |
| **Exit** | Scale | 1 → 0.97 (150ms ease-in) |

The spring configuration (`300, 25`) creates a slightly bouncy entrance — the modal overshoots by approximately 2% before settling, giving it a tactile, physical quality. The backdrop fades independently with a simple opacity transition (200ms).

**Accessibility:** Focus is trapped within the modal via `useFocusTrap`. Escape key closes the modal. The backdrop click-to-close is opt-in per modal instance (`closeOnBackdropClick`).

---

### Navigation

Navigation in LifeOS adapts to the viewport: a full sidebar on desktop and a floating dock on mobile, maintaining the same mental model across both.

#### Sidebar (Desktop, 1024px+)

| Property | Value |
|----------|-------|
| Width | 96px |
| Background | `rgba(24, 24, 27, 0.4)` |
| Backdrop | `blur(24px)` |
| Border Right | `1px solid rgba(255, 255, 255, 0.05)` |
| Layout | Vertical, icon-only |
| Item Height | 48px |
| Item Border Radius | 12px |
| Item Spacing | 4px gap between items |

**Item states:**

| State | Background | Icon Color | Text | Glow |
|-------|-----------|------------|------|------|
| **Default** | Transparent | `#a1a1aa` (Zinc-400) | None (icon-only) | None |
| **Hover** | `rgba(255, 255, 255, 0.05)` | `#ffffff` | None | None |
| **Active** | `rgba(48, 140, 232, 0.1)` | `#308ce8` | Electric Blue | `0 0 12px rgba(48, 140, 232, 0.2)` inner glow |

Active items include a subtle **left-indicator bar** (2px wide, full height, `#308ce8`, border-radius 0 2px 2px 0) positioned absolutely on the left edge of the item.

#### Dock (Mobile, <1024px)

| Property | Value |
|----------|-------|
| Position | Fixed bottom, horizontally centered |
| Background | `rgba(24, 24, 27, 0.6)` |
| Backdrop | `blur(24px)` |
| Border | `1px solid rgba(255, 255, 255, 0.08)` |
| Border Radius | `24px` (3xl) |
| Padding | `8px 12px` |
| Bottom Offset | 16px from viewport edge |
| Shadow | `0 8px 32px rgba(0, 0, 0, 0.60)` |
| Max Width | 380px |

The dock follows the macOS-style floating pill pattern. Items are arranged horizontally with 4px gaps. The active item is indicated by the same Electric Blue icon + glow treatment as the sidebar. A safe-area inset is applied for devices with home indicators.

---

### Badge

Badges are compact informational tokens used for status indicators, counts, and categorical labels.

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| **Default** | `rgba(255, 255, 255, 0.08)` | `#ffffff` | None | Neutral labels, category tags |
| **Primary** | `rgba(48, 140, 232, 0.15)` | `#308ce8` | None | Active selections, current filters |
| **Success** | `rgba(16, 185, 129, 0.15)` | `#10b981` | None | Completion, success states |
| **Warning** | `rgba(239, 68, 68, 0.15)` | `#ef4444` | None | Alerts, errors, missed items |
| **Outline** | Transparent | `#a1a1aa` | `1px solid rgba(255, 255, 255, 0.1)` | Subtle tags, inactive categories |

**Shared properties:** `border-radius: 9999px` (pill), `padding: 2px 8px`, `font-size: 11px`, `font-weight: 500`, `text-transform: uppercase`, `letter-spacing: 0.05em`.

---

### Tag

Tags extend badges with dismissibility and larger touch targets. Used for multi-select filters, applied labels, and chip-style selections.

| Property | Value |
|----------|-------|
| Background | `rgba(255, 255, 255, 0.06)` |
| Text | `#ffffff` |
| Border Radius | `8px` |
| Padding | `4px 8px` (content) / `4px 12px` (with icon) |
| Font Size | 12px |
| Font Weight | 500 |
| Close Icon | Material Symbols `close` at 14px, Zinc-400, hover: `#ef4444` |

**Remove animation:** On dismiss, the tag scales to 0.8 and fades to 0 opacity over 150ms, with the remaining tags sliding to fill the gap (spring: 300, 30).

---

### Toggle

Binary switches for settings and preferences.

| Property | Value |
|----------|-------|
| Track Width | 44px |
| Track Height | 24px |
| Track Border Radius | 12px |
| Track (Off) | `rgba(255, 255, 255, 0.1)` |
| Track (On) | `#308ce8` |
| Thumb Diameter | 18px |
| Thumb Color | `#ffffff` |
| Thumb Shadow | `0 1px 3px rgba(0, 0, 0, 0.3)` |
| Thumb Position (Off) | `translateX(3px)` |
| Thumb Position (On) | `translateX(23px)` |
| Transition | Spring (300, 30) |

**Focus state:** 2px focus ring `rgba(48, 140, 232, 0.4)` with 2px offset around the track.

**Disabled state:** Track opacity 0.4, cursor not-allowed, no transition.

---

### Tabs

Tab navigation for switching between content panels within a single view.

| Property | Value |
|----------|-------|
| Container Background | `rgba(24, 24, 27, 0.3)` |
| Container Border Radius | 12px |
| Container Padding | 4px |
| Tab Height | 36px |
| Tab Border Radius | 8px |
| Tab Font Size | 13px |
| Tab Font Weight | 500 |

**Tab states:**

| State | Background | Text | Notes |
|-------|-----------|------|-------|
| **Inactive** | Transparent | `#a1a1aa` | Subtle, recedes into container |
| **Hover** | `rgba(255, 255, 255, 0.05)` | `#ffffff` | Brightens on hover for feedback |
| **Active** | `rgba(48, 140, 232, 0.15)` | `#308ce8` | Glass-like highlight, electric blue text |
| **Focus** | Same as Active | Same as Active | 2px focus ring `rgba(48, 140, 232, 0.4)` |

The active tab indicator slides smoothly between tabs using Framer Motion's `layoutId` prop, creating a shared-element transition effect. The sliding indicator has a subtle blue glow (`box-shadow: 0 0 8px rgba(48, 140, 232, 0.2)`).

**Size variants:**

| Size | Height | Font Size | Padding (x) |
|------|--------|-----------|-------------|
| `sm` | 30px | 12px | 12px |
| `md` | 36px | 13px | 16px |
| `lg` | 44px | 14px | 20px |

---

## 5. Layout Principles

Every spatial decision in LifeOS follows a strict rhythm derived from a 4px base unit. This system ensures that every element aligns to a predictable vertical and horizontal grid, making the interface feel cohesive even when components vary wildly in size.

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `--space-2` | 8px | Tight gaps between related elements (label + input, icon + text) |
| `--space-4` | 16px | Standard component gap within a card or widget |
| `--space-6` | 24px | Standard padding inside cards and panels |
| `--space-8` | 32px | Generous separation between major sections |

Padding and margin values are never arbitrary. If a component needs a value outside this scale, it is a signal that the layout may need restructuring.

### Grid and Container

The primary content area uses a CSS Grid **Bento layout** with four columns. Cards span 1, 2, or 4 columns depending on their importance, creating a magazine-like rhythm that guides the eye.

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[160px] gap-4
```

The application container is centered with `max-width: 1400px` (Tailwind `2xl` breakpoint) and `2rem` horizontal padding. This ensures content never stretches to full viewport width on ultra-wide monitors, preserving comfortable reading line lengths.

Auto rows are set to `160px`, giving each card a consistent minimum height. Cards that need more content area can span multiple rows via `row-span-2` or `row-span-3` utility classes.

### Border Radius Scale

Border radius is applied in three tiers to establish a visual hierarchy of containment:

| Tier | Radius | Usage |
|------|--------|-------|
| Outer containers | `rounded-3xl` (24px) | Dashboard cards, sidebar panels, modal wrappers |
| Inner elements | `rounded-xl` (12px) | Buttons, input fields, badges, nested containers |
| Pills / Avatars | `rounded-full` (9999px) | Tags, status indicators, user avatars, floating action buttons |

Interactive elements never drop below `rounded-lg` (8px). Sharp corners (0px) are reserved exclusively for decorative dividers and the app window frame itself.

---

## 6. Depth and Elevation

Depth in LifeOS is communicated through a layered system of shadows, backdrop blur, and subtle highlights. The goal is to make surfaces appear to float above the OLED void, reinforcing the "cockpit" metaphor without relying on heavy skeuomorphic effects.

### Elevation Levels

| Level | Name | Shadow | Typical Usage |
|-------|------|--------|---------------|
| 0 | Flat | none | Backgrounds, dividers, inactive text |
| 1 | Glass | `0 20px 60px rgba(0,0,0,0.80)` | Cards, widgets, sidebar panels |
| 2 | Ambient | `0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.60)` | Modals, dropdown menus, popovers |
| 3 | Elevated | Level 1 shadow + accent glow `0 0 40px rgba(48,140,232,0.12)` | Active cards, focused items, drag previews |

Each level is implemented as a Tailwind custom class in `theme.extend.boxShadow`, making them composable with `shadow-glass`, `shadow-ambient`, and `shadow-elevated`.

### Backdrop Blur

Glassmorphism relies on two blur intensities:

| Token | Tailwind | Blur Radius | Usage |
|-------|----------|-------------|-------|
| Standard | `backdrop-blur-xl` | 24px | All glass surfaces (cards, sidebar, panels) |
| Heavy | `backdrop-blur-2xl` | 40px | Modal overlays, notification banners, critical alerts |

The heavier blur on modals creates a stronger sense of separation from the underlying content, naturally drawing focus to the foreground interaction.

### Decorative Depth

Beyond shadow and blur, three decorative techniques add atmospheric depth:

1. **Noise texture overlay.** A subtle SVG noise filter applied via `::after` pseudo-element with `opacity: 0.03`. This breaks the flat digital feel and gives surfaces a tactile grain, visible only on close inspection.

2. **Glow spot.** A radial gradient (`radial-gradient(ellipse at 50% 0%, rgba(48,140,232,0.15), transparent 70%)`) positioned at the top-center of the viewport. It simulates ambient overhead lighting and subtly shifts the background from pure black to a cool near-black in the upper region.

3. **Accent glow.** Applied to elevated elements as an additional box-shadow layer: `0 0 40px rgba(48,140,232,0.12)`. This Electric Blue halo signals interactivity and draws attention without competing with content.

---

## 7. Do's and Don'ts

This section codifies the design invariants that must hold across every screen, component, and future feature.

### Do

- **Use OLED Black (`#050505`) as the primary background.** This is the foundation of the entire visual language. Every surface is defined by what it reveals against this void.
- **Apply glassmorphism to every surface.** A glass panel combines: semi-transparent background (`rgba(24,24,27,0.4)`), `backdrop-blur-xl`, and a 1px border at `rgba(255,255,255,0.05)`. Never ship a flat opaque card.
- **Use Inter exclusively.** Configure `font-feature-settings: "cv11", "cv05", "ss01"` for improved figure and ligature rendering. No other typeface is permitted.
- **Reserve Electric Blue (`#308ce8`) for interactive and active states.** This color is a signal, not decoration. Use it for focused inputs, selected nav items, active toggles, and hover accents.
- **Animate with Framer Motion using micro-interactions.** Hover scale: `1.01`. Tap scale: `0.98`. Spring-based transitions with `stiffness: 400, damping: 30`. Keep motion durations under 200ms.
- **Respect `prefers-reduced-motion`.** When this media query is active, disable all scale and spring animations. Static states only.
- **Use semantic colors for feedback.** Green (`#10b981`) for success, Red (`#ef4444`) for errors, Amber for warnings. Never rely on shape or position alone to communicate status.
- **Apply the border radius scale consistently.** Outer containers get `rounded-3xl`, inner elements get `rounded-xl`, and nothing interactive goes below `rounded-lg`.
- **Support safe-area insets.** On mobile or notched screens, add `padding-top: env(safe-area-inset-top)` and `padding-bottom: env(safe-area-inset-bottom)` to fixed bars and floating elements.

### Don't

- **Never use white or light backgrounds.** This is a dark-first application. Light surfaces break the cockpit metaphor and cause eye strain in low-light environments.
- **Never use solid heavy borders.** Borders must always be translucent white at 5-8% opacity. Solid borders look harsh against the dark background.
- **Never use fonts other than Inter.** Consistency in typography is non-negotiable.
- **Never use bright or saturated colors outside the defined palette.** Neon greens, vivid yellows, and hot pinks have no place here. Every color must pass through the muted-dark filter of the design language.
- **Never skip backdrop-blur on a glass surface.** A translucent background without blur is just a dark grey box. Blur is what makes it glass.
- **Never use hard shadows.** No `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`. All shadows follow the glass/ambient/elevated system with large blur radii and high opacity blacks.
- **Never use border-radius smaller than 8px on interactive elements.** Buttons, inputs, and clickable cards must feel approachable and soft.
- **Never ignore platform conventions.** On mobile, use bottom navigation. On desktop, use the fixed sidebar. Do not try to make one layout work everywhere.

---

## 8. Responsive Behavior

LifeOS is an **Electron-first desktop application**. The primary experience targets desktop window sizes (1024px+). The responsive breakpoints below define how the interface adapts when the window is resized or when the web version is accessed on smaller screens.

### Breakpoint Table

| Name | Width | Columns | Layout Character |
|------|-------|---------|------------------|
| `sm` | 640px | 1 | Single column, bottom dock navigation |
| `md` | 768px | 2 | Two-column bento grid, bottom dock |
| `lg` | 1024px | 3 | Three-column grid, sidebar appears |
| `xl` | 1280px | 4 | Full four-column bento, fixed sidebar |

### Desktop — Primary Experience (lg and above)

This is the **canonical layout** — the Electron window defaults to this view.

The desktop layout uses a fixed **96px sidebar** on the left edge. It displays only icons (no labels) to maximize horizontal space for content. The sidebar uses the same glass treatment as cards: `bg-zinc-950/40` with `backdrop-blur-xl`.

The content area fills the remaining width with `margin-left: 96px`. The bento grid operates at full four-column capacity, with cards spanning one or more columns to create visual variety.

Window chrome (traffic light buttons on macOS) is integrated into the sidebar header area on desktop, keeping the content area clean.

### Small Viewport / Web Fallback (below lg)

When the window is resized below 1024px or when the web version is accessed on smaller screens, the sidebar is removed and replaced by:

1. **Floating Dock.** A compact pill-shaped bar fixed to the bottom of the viewport, containing 4-5 primary navigation icons. It uses `shadow-elevated` and `backdrop-blur-2xl` to float above content.

2. **Bottom Navigation Bar.** When inside a specific section (e.g., a task detail view), a contextual bottom bar replaces the dock with back/action buttons.

Content switches to single or two-column layout. Cards stack vertically with `gap-4` spacing. No card spans more than 2 columns on small viewports.

### Touch Targets

All interactive elements meet WCAG minimum touch target requirements:

- **Minimum size:** 44px x 44px
- **Button minimum height:** 40px
- **Spacing between targets:** At least 8px to prevent accidental clicks/taps

These values are enforced via Tailwind's `min-h-[44px]` and `min-w-[44px]` utilities on all interactive components.

---

## 9. Agent Prompt Guide

This section equips AI coding agents with the precise context needed to generate LifeOS-compliant components. Copy the reference values and example prompts below when instructing an agent to build UI.

### Quick Color Reference

| Property | Value | Hex/Token |
|----------|-------|-----------|
| Background | OLED Black | `#050505` |
| Surface / Glass | Zinc-950 at 40% | `rgba(24, 24, 27, 0.4)` |
| Primary / Interactive | Electric Blue | `#308ce8` |
| Text (Primary) | White | `#ffffff` |
| Text (Secondary) | Zinc-400 | `#a1a1aa` |
| Success | Emerald-500 | `#10b981` |
| Error | Red-500 | `#ef4444` |
| Border | White at 5% | `rgba(255, 255, 255, 0.05)` |

### Example Component Prompts

**1. Dashboard Card**

```
Build a dashboard card component for LifeOS.
- Background: rgba(24,24,27,0.4) with backdrop-blur-xl
- Border: 1px solid rgba(255,255,255,0.05)
- Border radius: 24px (rounded-3xl)
- Padding: 24px
- Shadow: 0 20px 60px rgba(0,0,0,0.80)
- Hover: Framer Motion scale(1.01) with spring transition
- Tap: scale(0.98)
- App base background is #050505
- Use Inter font with font-feature-settings "cv11", "cv05", "ss01"
- Support prefers-reduced-motion
```

**2. Button Set**

```
Build a set of three button variants for LifeOS (primary, secondary, ghost).
- All buttons: min-height 40px, border-radius 12px, Inter font
- Primary: bg #308ce8, white text, hover brightness 1.1
- Secondary: bg rgba(255,255,255,0.05), white text, border 1px rgba(255,255,255,0.08)
- Ghost: transparent bg, zinc-400 (#a1a1aa) text, no border, bg on hover rgba(255,255,255,0.05)
- All: Framer Motion scale(0.98) on tap, spring transition
- Respect prefers-reduced-motion
- Padding: 12px 24px
```

**3. Navigation Sidebar**

```
Build a fixed sidebar navigation for LifeOS desktop layout.
- Width: 96px, full viewport height, fixed left
- Background: rgba(24,24,27,0.4) with backdrop-blur-xl
- Border-right: 1px solid rgba(255,255,255,0.05)
- Icon-only nav items, 44px x 44px touch targets
- Active item: Electric Blue (#308ce8) icon tint + subtle bg highlight
- Inactive items: zinc-400 (#a1a1aa)
- Shadow: 0 20px 60px rgba(0,0,0,0.80)
- Hidden below lg breakpoint (use Tailwind lg: flex, below lg: hidden)
```

**4. Form Input**

```
Build a form input component for LifeOS.
- Background: rgba(24,24,27,0.4)
- Border: 1px solid rgba(255,255,255,0.05)
- Border radius: 12px (rounded-xl)
- Focus state: border-color #308ce8, add 0 0 0 2px rgba(48,140,232,0.2) ring
- Text color: #ffffff, placeholder: #a1a1aa
- Min height: 40px, padding: 8px 16px
- Font: Inter with font-feature-settings "cv11", "cv05", "ss01"
- Background app is #050505
```

### Iteration Guide

When working with an AI agent on LifeOS components, enforce these rules in every iteration:

1. **Always use OLED Black (#050505) as the base background.** No exceptions, no gradients for the app shell.
2. **Every surface must use glassmorphism.** Combine `bg rgba(24,24,27,0.4)` + `backdrop-blur-xl` + `border rgba(255,255,255,0.05)`. A surface without blur is a broken surface.
3. **Use Inter font exclusively** with `font-feature-settings: "cv11", "cv05", "ss01"`. Do not substitute.
4. **Electric Blue (#308ce8) is only for interactive and active states.** It must never be used as a background fill or decorative color.
5. **Animations use Framer Motion** with `scale(1.01)` hover, `scale(0.98)` tap, and spring transitions (`stiffness: 400, damping: 30`). Duration stays under 200ms.
6. **Respect `prefers-reduced-motion`.** When active, all motion is disabled. Static states only.
7. **Border radius follows the scale:** 24px for outer containers, 12px for inner elements, 8px minimum for anything interactive.
8. **Shadows use the defined system.** Glass: `0 20px 60px rgba(0,0,0,0.80)`. Ambient: `0 0 0 1px rgba(255,255,255,0.08), 0 10px 30px rgba(0,0,0,0.60)`. Elevated adds accent glow. No hard shadows ever.
