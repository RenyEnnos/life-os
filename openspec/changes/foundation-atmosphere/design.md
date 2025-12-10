# Design: Atmospheric Deep Surface

## Philosophy
"Não se constrói um palácio de vidro em terreno instável."
The visual foundation must support depth and light. We move from a flat 2D plane to a 2.5D space where light interacts with surfaces.

## Core Concepts

### 1. The Deep Surface (#030303)
Instead of the void (#000000), we define a physical material that can accept light.
- **Background**: `#030303` (Deep Zinc)
- **Surface**: `#0A0A0B` (slightly lighter, for cards)
- **Border**: `rgba(255, 255, 255, 0.08)` (subtle separation)

### 2. Precision Typography
Type must feel "machined" and technical.
- **Font**: Inter (Variable)
- **Settings**:
    - `"cv11"`: Geometric/Modern 'a'
    - `"cv05"`: Distinctive 'l' (legibility)
    - `"ss01"`: Technical numbering

### 3. Atmospheric Lighting (The Stage)
A radial gradient representing a "top-down" light source.
```css
background: radial-gradient(
  circle at 50% 0%, 
  rgba(255, 255, 255, 0.08) 0%, 
  transparent 60%
);
```
This draws the eye to the center and creates a stage for content.
