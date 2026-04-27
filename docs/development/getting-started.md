---
type: guide
status: active
last_updated: 2026-04-27
tags: [development, guide]
---

# Getting Started

## Prerequisites

- **Node.js:** v18.x or higher
- **npm:** v9.x or higher
- **Electron:** Installed automatically via `npm install`
- **Git:** For version control

## Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/RenyEnnos/life-os.git
cd life-os

# 2. Install dependencies
npm install

# 3. Start the Electron desktop app
npm run electron:dev
```

The app opens automatically. All data is stored locally in SQLite -- no database server required.

## Environment Variables

LifeOS works offline by default. Create a `.env` file only if you need optional features:

```bash
# Optional: Supabase cloud sync
VITE_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhb...[ANON_KEY]"

# Optional: Express API development server
LIFEOS_SESSION_SECRET="your-secret-key-here"
JWT_SECRET="your-secret-key-here"

# Environment
NODE_ENV="development"
```

## Dev Environment

### Running in Development Mode

```bash
# Electron desktop (primary)
npm run electron:dev

# Web app (Vite on :5173 + Express on :3001)
npm run dev
```

### Running Quality Checks

```bash
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint
npm run test             # All unit/integration tests
npm run test:watch       # Watch mode
```

### Running Storybook

```bash
npm run storybook        # Design system on port 6006
```

## First Contribution

1. **Find an issue:** Check GitHub issues or the `docs/mvp/implementation-checklist.md` for open tasks.
2. **Create a branch:** `git checkout -b feat/your-feature-name`
3. **Make changes:** Follow the conventions in [Feature Module Guide](./feature-module-guide.md).
4. **Run checks:** `npm run typecheck && npm run lint && npm run test`
5. **Commit:** Use conventional commits (`feat:`, `fix:`, `refactor:`, `test:`).
6. **Push and create a PR:** `git push origin feat/your-feature-name`

## Troubleshooting

### App won't start

- Ensure Node.js v18+ is installed: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for port conflicts on 5173 (Vite) or 3001 (Express)

### Database errors

- The SQLite database is created automatically on first run
- In development, it's at the project root (`lifeos.db`)
- Delete it to reset all local data

### TypeScript errors

- Run `npm run prisma:generate` if Prisma types are missing
- Run `npm run typecheck` to see all type errors
