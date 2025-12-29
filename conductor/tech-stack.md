# Technology Stack

## Core
-   **Framework:** React 18.2+
-   **Build Tool:** Vite 5+ (SWC compiler)
-   **Language:** TypeScript 5.3+ (Strict Mode, Zero `any`)
-   **Styling:** Tailwind CSS 3.4+ (Mobile-first, utility-first)
-   **Icons:** Lucide React
-   **Animation:** Framer Motion
-   **Backend:** Supabase (PostgreSQL)

## State Management & Data
-   **Server State:** `@tanstack/react-query` v5 (Factory pattern for keys)
-   **Client State:** `zustand` (Atomic stores, minimal UI state)
-   **Validations:** Zod
-   **Dates:** date-fns

## AI Infrastructure
-   **Provider:** Groq Cloud (Llama 3 70B / Mixtral 8x7B)
-   **Interface:** `groq-sdk` via Supabase Edge Functions

## Architectural Principles
-   **Hybrid Feature Architecture:** Code is organized by domain-driven modules (`src/features/`).
-   **Colocation:** Related code (components, hooks, api, types) lives together.
-   **Deletability:** Removing a feature folder removes the feature completely.
-   **No Root Components:** All components live in feature folders or `shared/ui`.
