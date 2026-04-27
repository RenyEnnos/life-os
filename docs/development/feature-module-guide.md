---
type: guide
status: active
last_updated: 2026-04-27
tags: [development, guide]
---

# Feature Module Guide

## Module Structure

Every feature module follows this directory structure:

```
src/features/[feature-name]/
  api/                  # API call functions
    feature.api.ts      # Typed API functions
  components/           # Feature-specific React components
    FeatureWidget.tsx
    FeatureCard.tsx
  hooks/                # React Query hooks
    useFeature.ts       # Data fetching and mutation hooks
  __tests__/            # Feature tests
    feature.test.ts
    feature.int.test.tsx
  types.ts              # Feature-specific TypeScript types
  index.tsx             # Feature page/entry point
```

## Creating a New Feature Module

### Step 1: Create the directory structure

```bash
mkdir -p src/features/my-feature/{api,components,hooks,__tests__}
```

### Step 2: Define types

Create `src/features/my-feature/types.ts`:

```typescript
export interface MyItem {
  id: string;
  title: string;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### Step 3: Create API functions

Create `src/features/my-feature/api/my-feature.api.ts`:

```typescript
import { apiClient } from '@/shared/api/http';
import type { MyItem } from '../types';

export const myFeatureApi = {
  getAll: () => apiClient.get<MyItem[]>('/api/my-feature'),
  create: (item: Partial<MyItem>) => apiClient.post<MyItem>('/api/my-feature', item),
  update: (id: string, patch: Partial<MyItem>) => apiClient.patch<MyItem>(`/api/my-feature/${id}`, patch),
  delete: (id: string) => apiClient.delete(`/api/my-feature/${id}`),
};
```

### Step 4: Create React Query hooks

Create `src/features/my-feature/hooks/useMyFeature.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { myFeatureApi } from '../api/my-feature.api';
import type { MyItem } from '../types';

export function useMyFeature() {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery<MyItem[]>({
    queryKey: ['my-feature'],
    queryFn: myFeatureApi.getAll,
  });

  const createItem = useMutation({
    mutationFn: myFeatureApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-feature'] }),
  });

  const updateItem = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MyItem> }) =>
      myFeatureApi.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-feature'] }),
  });

  const deleteItem = useMutation({
    mutationFn: myFeatureApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-feature'] }),
  });

  return { items: items || [], isLoading, createItem, updateItem, deleteItem };
}
```

### Step 5: Create components

Create `src/features/my-feature/components/MyFeatureWidget.tsx`:

```typescript
import { cn } from '@/shared/lib/cn';
import { useMyFeature } from '../hooks/useMyFeature';

export function MyFeatureWidget() {
  const { items, isLoading } = useMyFeature();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={cn("rounded-xl border border-white/5 bg-zinc-900/40 p-6")}>
      <h2 className="text-lg font-semibold">My Feature</h2>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-400">No items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Step 6: Create the page entry point

Create `src/features/my-feature/index.tsx`:

```typescript
import { MyFeatureWidget } from './components/MyFeatureWidget';

export default function MyFeaturePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Feature</h1>
      <MyFeatureWidget />
    </div>
  );
}
```

### Step 7: Add tests

Create `src/features/my-feature/__tests__/my-feature.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { myFeatureApi } from '../api/my-feature.api';

describe('myFeatureApi', () => {
  it('exports expected methods', () => {
    expect(typeof myFeatureApi.getAll).toBe('function');
    expect(typeof myFeatureApi.create).toBe('function');
    expect(typeof myFeatureApi.update).toBe('function');
    expect(typeof myFeatureApi.delete).toBe('function');
  });
});
```

### Step 8: Register the route

Add the route in `src/config/routes/index.tsx`:

```typescript
{
  path: '/my-feature',
  element: <MyFeaturePage />,
  // ... other route config
}
```

## Existing Patterns

### CRUD Pattern

Most features follow the standard Create/Read/Update/Delete pattern shown above. Examples: `tasks`, `habits`, `journal`.

### Widget Pattern

Some features are widgets displayed on a dashboard. They export a widget component rather than a full page. Examples: `dashboard` widgets.

### Form Pattern

Features with complex forms use `react-hook-form` with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  // ...
}
```

## Anti-Patterns

### Don't

- **Don't** put API calls directly in components. Always go through hooks.
- **Don't** use `any` types. Use `Record<string, unknown>` or `unknown` if the type is unclear.
- **Don't** import from `@/shared/lib/cn` without using it. Remove unused imports.
- **Don't** create features without types. Always define `types.ts` first.
- **Don't** bypass React Query for server state. Use Zustand only for client-only global state.
- **Don't** use inline styles. Use Tailwind classes with the `cn()` utility.
- **Don't** skip tests. Every feature module should have at least basic tests.

### Do

- **Do** use `cn()` for class merging: `className={cn("base", isActive && "active")}`
- **Do** use `class-variance-authority` for component variants.
- **Do** use `React.forwardRef` when ref forwarding is needed.
- **Do** invalidate queries on successful mutations.
- **Do** handle loading and error states in every data-fetching component.
- **Do** use semantic color tokens (`bg-background`, `text-foreground`, `border-border`).
