---
type: guide
status: active
last_updated: 2026-04-27
tags: [ai-agent, code-patterns, conventions]
---

# AGENTS.md

Development guidelines for agentic coding assistants working on the LifeOS codebase.

> **Quick Reference:** For project overview, commands, and architecture summary, see [CLAUDE.md](./CLAUDE.md). For design system tokens and component specs, see [DESIGN.md](./DESIGN.md).

## Code Style Guidelines

### Imports & Aliases
- Always use `@/*` alias for src imports: `@/features/tasks/hooks/useTasks`
- External packages: import specific exports, not entire libraries: `import { Button } from 'lucide-react'`
- Group imports: React/external libraries → internal aliases → types

### TypeScript
- Strict mode enabled — always type everything, avoid `any` (ESLint error)
- Use `Record<string, unknown>` or `unknown` for untyped data, not `any`
- Infer types from database: `DbTask = Database['public']['Tables']['tasks']['Row']`
- Extend DB types for UI: `interface Task extends Omit<DbTask, 'tags'> { tags?: string[] }`

### File Organization (Feature-Based Architecture)
```
src/features/[feature-name]/
  api/              # API calls (feature.api.ts)
  components/       # Feature components
  hooks/            # React Query hooks (useFeature.ts)
  __tests__/        # Feature tests
  types.ts          # Feature-specific types
  index.tsx         # Feature page/entry point
```

### Component Patterns
- Use `React.forwardRef` for components needing ref forwarding
- Use `class-variance-authority` for variant props (see Button.tsx)
- Combine Tailwind classes with `cn()` utility: `className={cn("base-class", isActive && "active-class")}`
- Export interfaces for props separately for clarity

### State Management & Data Fetching
- **API calls**: Use `@tanstack/react-query` via custom hooks (e.g., `useTasks`, `useHabits`)
- **Global state**: Use Zustand stores in `src/shared/stores/`
- **Local form state**: React `useState`
- **Server mutations**: `useMutation` with `queryClient.invalidateQueries` on success

### API Layer
- All API calls go through `apiClient` from `@/shared/api/http`
- Use typed methods: `apiClient.get<T>(), apiClient.post<T>(url, data)`
- Error handling: `ApiError` class includes status and details
- Always handle 4xx client errors gracefully (warnings), 5xx server errors critically

### Testing
- Test files: `*.test.ts` or `*.test.tsx` in `__tests__/` directories
- Mock external dependencies: `vi.mock('@/shared/api/http', ...)`
- Use globals: `describe, it, expect` from vitest (no import needed)
- Component tests: `@testing-library/react` for rendering
- API tests: Mock http client, test returned data shape

### Naming Conventions
- **Components**: PascalCase (`TaskWidget`, `HabitCard`)
- **Hooks**: camelCase with `use` prefix (`useTasks`, `useDashboardStats`)
- **Files**: camelCase for modules, PascalCase for components (`tasks.api.ts`, `TaskWidget.tsx`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **DB tables**: snake_case (PostgreSQL convention)

### Error Handling
- Use `try/catch` for async operations
- Log 4xx errors as warnings, 5xx as errors
- User-facing errors should be translated strings
- Return default values gracefully (e.g., `data || defaultValue`)
- Always invalidate queries on successful mutations

### Styling (Tailwind)
- Use semantic color tokens: `bg-background`, `text-foreground`, `border-border`
- Custom colors defined in tailwind.config.js: `primary`, `oled`, `glass`
- Dark mode via `class` strategy — components should support both
- Responsive: mobile-first, use `md:`, `lg:` prefixes
- Animations: use defined animations (`animate-pulse-slow`, `animate-enter`)

### Backend (Express + Supabase)
- Routes in `api/routes/`, services in `api/services/`
- All routes require `authenticateToken` middleware except auth endpoints
- Use Supabase client: `import { supabase } from '../lib/supabase'`
- Return JSON responses: `{ success: boolean, data?, error? }`
- Log errors with context: `console.error('Error creating task:', error)`

### Git Workflow
- Run `npm run lint` and `npm run typecheck` before committing
- Follow conventional commits: `feat:`, `fix:`, `refactor:`, `test:`
- Never commit `.env` files or secrets
- Mock disabled features instead of leaving TODOs

### Key Libraries & Patterns
- **Icons**: `lucide-react` — import specific icons
- **Forms**: `zod` for validation, `@radix-ui/*` for accessible primitives
- **Charts**: `recharts` for data visualization
- **Animations**: `framer-motion` for UI transitions
- **Routing**: `react-router-dom` with nested routes
- **Date handling**: `date-fns` utilities

## Common Patterns to Follow

**Custom Hook with React Query:**
```typescript
export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', user?.id],
    queryFn: () => tasksApi.getAll(),
    enabled: !!user,
  });
  const createTask = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
  return { tasks: data || [], isLoading, createTask };
}
```

**API Service Function:**
```typescript
export const tasksApi = {
  getAll: async () => apiClient.get<Task[]>('/api/tasks'),
  create: async (task: Partial<Task>) => apiClient.post<Task>('/api/tasks', task),
};
```

**Component with Variants:**
```typescript
const buttonVariants = cva("base-classes", {
  variants: { variant: { primary: "...", secondary: "..." } },
  defaultVariants: { variant: "primary" },
});
```

## Anti-Patterns (DO NOT)

| Anti-Pattern | Why It's Wrong | Do This Instead |
|--------------|---------------|-----------------|
| `import * as X from 'lib'` | Tree-shaking breaks, bundle bloat | Import specific exports |
| `any` type | Defeats TypeScript safety | Use `unknown` or proper types |
| Business logic in components | Untestable, hard to refactor | Put logic in hooks or api/ |
| Direct fetch() calls | Bypasses auth injection, no Electron IPC fallback | Use `fetchJSON` / `apiClient` |
| Importing across features | Creates tight coupling, breaks module boundaries | Use shared/ for cross-feature code |
| Skipping types.ts | Loses feature encapsulation | Always define feature types |
| `console.log` in production | Leaks data, clutters output | Use logger from `@/shared/lib/logger` |
| Inline Tailwind everywhere | Inconsistent design, hard to maintain | Use cva variants + semantic tokens |
