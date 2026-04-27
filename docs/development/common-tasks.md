---
type: guide
status: active
last_updated: 2026-04-27
tags: [development, guide]
---

# Common Tasks

Decision trees for the most frequent development tasks.

---

## "I need to add a new API endpoint"

### 1. Define the route in `api/app.ts`

```typescript
app.post('/api/my-feature', async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = myFeatureSchema.safeParse(req.body);
    if (!parsed.success) {
      return fail(res, 'Validation failed');
    }
    ok(res, await repository.myMethod(req.authUser!.id, parsed.data));
  } catch (error) {
    next(error);
  }
});
```

### 2. Add Zod validation schema

Either inline in `api/app.ts` or in `shared/schemas/`:

```typescript
const myFeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});
```

### 3. Add repository method

In the appropriate repository class:

```typescript
async myMethod(userId: string, input: MyInput) {
  // File-backed: write to JSON
  // Prisma-backed: database operation
  // SQLite: direct query
}
```

### 4. Add IPC handler (if Electron)

In `electron/ipc/my-feature.ts`:

```typescript
ipcMain.handle('my-feature:method', async (event, input) => {
  return repository.myMethod(getCurrentUserId(event), input);
});
```

### 5. Add preload bridge (if Electron)

In `electron/preload.ts`:

```typescript
myFeature: {
  method: (input) => ipcRenderer.invoke('my-feature:method', input),
},
```

### 6. Write tests

- Unit test for the repository method
- Integration test for the API endpoint
- Add to `api/__tests__/` or feature `__tests__/`

### 7. Update docs

- Add to `docs/api/README.md` endpoint table
- Create detailed endpoint doc in `docs/api/my-feature.md`

---

## "I need to add a new component"

### 1. Determine location

- **Shared component** (reusable across features): `src/shared/ui/`
- **Feature-specific component**: `src/features/[name]/components/`

### 2. Create the component

```typescript
import { cn } from '@/shared/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl",
  {
    variants: {
      variant: {
        default: "p-6",
        compact: "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, variant, className }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)}>
      {children}
    </div>
  );
}
```

### 3. Add Storybook story

```typescript
// src/shared/ui/Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Shared/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { children: "Card content" },
};
```

### 4. Add tests

```typescript
// src/shared/ui/__tests__/Card.test.tsx
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

it('renders children', () => {
  render(<Card>Hello</Card>);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

---

## "I need to add a new feature module"

See [Feature Module Guide](./feature-module-guide.md) for the complete step-by-step process.

Quick checklist:

1. `mkdir -p src/features/my-feature/{api,components,hooks,__tests__}`
2. Create `types.ts`
3. Create API functions
4. Create React Query hooks
5. Create components
6. Create page entry point (`index.tsx`)
7. Add tests
8. Register route in `src/config/routes/index.tsx`
9. Add to navigation if needed (`src/app/layout/navItems.ts`)

---

## "I need to add a test"

### Unit test

```bash
# Create test file next to source
touch src/features/my-feature/__tests__/my-feature.test.ts

# Run it
npx vitest run src/features/my-feature/__tests__/my-feature.test.ts
```

### Integration test

```bash
# Create with .int.test.tsx suffix
touch src/features/my-feature/__tests__/my-feature.int.test.tsx

# Run integration tests
npm run test:integration
```

### E2E test

```bash
# Add to tests/e2e/smoke.spec.ts for release-critical flows
# Add to tests/e2e/ for advisory-only flows

# Run
npm run test:e2e          # Release gate
npm run test:e2e:advisory # Advisory only
```

### Test file conventions

- Unit: `*.test.ts` or `*.test.tsx`
- Integration: `*.int.test.tsx`
- E2E: `*.spec.ts`
- Place in `__tests__/` directory or alongside source

---

## "I need to modify an IPC handler"

### 1. Find the handler

IPC handlers are in `electron/ipc/`. Search for the channel name:

```bash
grep -r "tasks:getAll" electron/ipc/
```

### 2. Modify the handler

```typescript
// electron/ipc/tasks.ts
ipcMain.handle('tasks:getAll', async (event) => {
  const userId = getCurrentUserId(event);
  // Add new logic here
  return repository.getAll(userId);
});
```

### 3. Update the preload bridge (if signature changed)

In `electron/preload.ts`:

```typescript
tasks: {
  getAll: (options?: FilterOptions) => ipcRenderer.invoke('tasks:getAll', options),
  // ...
}
```

### 4. Update the renderer call site

In the component or hook that calls the IPC method:

```typescript
const tasks = await window.api.tasks.getAll({ status: 'active' });
```

### 5. Write tests

```typescript
// electron/ipc/__tests__/tasks.test.ts
import { describe, it, expect, vi } from 'vitest';

describe('tasks IPC handlers', () => {
  it('getAll returns tasks for user', async () => {
    // Test the handler
  });
});
```

### 6. Verify type safety

Run `npm run typecheck` to ensure the preload types match the IPC handler expectations.
