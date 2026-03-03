# Architecture

## Overview
The project follows a **Feature-Sliced Design (FSD)** architecture on the frontend, separated by domain modules (e.g., `features/calendar`, `features/projects`, `features/focus`), and a layered API structure on the backend.

## Frontend
- **`src/app/`**: Global setup, routing configuration, layout wrappers, and global providers (Auth, Toast, React Query).
- **`src/features/`**: Domain-specific modules containing their own components, pages, hooks, tests, and state.
- **`src/shared/`**: Reusable components (`ui`), utilities, hooks, types, and services.
- **State Architecture:** Uses Zustand for local/global synchronous state and React Query for server state and data fetching. Context API is used for foundational global states like Auth and Theme.

## Backend
- **`api/`**: Express server application.
- **`api/routes/` & `api/controllers/`**: API endpoints and request handling.
- **`api/services/` & `api/repositories/`**: Business logic and database access layers.

## Pattern Issues (Buttons and Interactions)
Currently, there is a disconnect between the Architectural intent and the UI implementation in several module pages. Many pages consist of "dummy" UI mockup code where standard HTML `<button>` tags are used without binding to the state management layer or utilizing the generic `src/shared/ui/Button.tsx`.
