# Structure

## Directory Layout

```
├── api/               # Express Backend
│   ├── routes/        # API Routing
│   ├── services/      # Business Logic
│   └── server.ts      # Server Entry Point
├── src/               # React Frontend
│   ├── app/           # App Initialization (Providers, Router)
│   ├── features/      # Feature Modules (Auth, Calendar, Focus, Projects, etc.)
│   │   └── [feature]/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       └── __tests__/
│   ├── shared/        # Shared resources (UI components, utils, types)
│   │   ├── ui/        # Design System components (Button, Modal, etc.)
│   │   ├── hooks/     # Global custom hooks
│   │   └── lib/       # Utility functions
│   └── main.tsx       # React Entry Point
├── tests/             # End-to-End and Performance Tests
└── scripts/           # Build, Deployment, and Utility Scripts
```

## Key Entities
- **Features:** Encapsulate specific domains like `ai-assistant`, `auth`, `calendar`, `dashboard`, `finances`, `focus`, `habits`, `health`, `journal`, `projects`, `rewards`, `settings`, `tasks`, and `university`.
- **Shared UI:** A library of Radix and Framer Motion powered components located in `src/shared/ui/`.
