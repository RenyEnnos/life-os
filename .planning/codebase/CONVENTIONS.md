# Conventions

## Code Style
- **TypeScript:** Strict type checking is enabled. Interfaces over types where applicable.
- **React Components:** Use functional components and hooks. Prefer named exports over default exports.
- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS unless necessary. For conditionally joining class names, use the utility function `cn` (e.g., `import { cn } from "@/shared/lib/cn"`).

## Feature-Sliced Design (FSD)
Modules under `src/features/` should not cross-import from other features. They must depend only on `src/shared/` or their own internal files.
- `components/`: UI components specific to the feature.
- `pages/`: Route-level entry points.
- `hooks/`: Domain logic encapsulated in custom hooks.
- `api/` or `services/`: Data fetching related to the feature.

## State Management
- **Zustand:** For global synchronous state (e.g., UI toggles, active panels).
- **React Query:** For server state, fetching, caching, and syncing data with the API or Supabase.

## UI Elements
- All interactable elements must use the global Design System components (e.g., `src/shared/ui/Button.tsx`) to ensure consistent styling, accessibility, and interaction feedback (like Framer Motion animations).
