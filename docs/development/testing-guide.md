---
type: guide
status: active
last_updated: 2026-04-27
tags: [development, guide]
---

# Testing Guide

## Test Types

LifeOS uses three levels of testing:

| Type | Framework | File Pattern | Purpose |
|------|-----------|-------------|---------|
| Unit | Vitest | `*.test.ts` / `*.test.tsx` | Business logic, hooks, utilities |
| Integration | Vitest + Testing Library | `*.int.test.tsx` | Component interactions, API flows |
| E2E | Playwright | `*.spec.ts` | Full user flows in Electron |

## Running Tests

```bash
# All unit and integration tests
npm run test

# Watch mode
npm run test:watch

# Integration tests only
npm run test:integration

# Single test file
npx vitest run path/to/test.test.ts

# Tests matching a pattern
npx vitest run --pattern "tasks"

# E2E (Electron smoke -- authoritative release gate)
npm run test:e2e

# E2E (browser advisory -- NOT release evidence)
npm run test:e2e:advisory
```

## Unit Tests

Unit tests validate business logic, hooks, and utilities in isolation.

### Location

- Co-located with source files in `__tests__/` directories
- Or alongside source files with `.test.ts` / `.test.tsx` suffix

### Writing Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { calculateWeeklyScore } from '../utils';

describe('calculateWeeklyScore', () => {
  it('returns 0 for empty completions', () => {
    expect(calculateWeeklyScore([])).toBe(0);
  });

  it('calculates average completion rate', () => {
    const items = [
      { completed: true, weight: 1 },
      { completed: false, weight: 1 },
      { completed: true, weight: 2 },
    ];
    expect(calculateWeeklyScore(items)).toBeCloseTo(0.67);
  });
});
```

### Mocking

```typescript
// Mock a module
vi.mock('@/shared/api/http', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock a hook
vi.mock('../hooks/useMyFeature', () => ({
  useMyFeature: () => ({
    items: [],
    isLoading: false,
  }),
}));

// Use in tests
import { apiClient } from '@/shared/api/http';

it('fetches items', async () => {
  vi.mocked(apiClient.get).mockResolvedValue([{ id: '1', title: 'Test' }]);
  const result = await myFeatureApi.getAll();
  expect(result).toHaveLength(1);
});
```

## Integration Tests

Integration tests validate component interactions and user flows.

### Location

- `__tests__/*.int.test.tsx` files in feature modules

### Writing Integration Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyFeatureWidget } from '../components/MyFeatureWidget';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('MyFeatureWidget', () => {
  it('renders empty state', () => {
    renderWithProviders(<MyFeatureWidget />);
    expect(screen.getByText('No items yet.')).toBeInTheDocument();
  });

  it('renders item list', async () => {
    vi.mock('../hooks/useMyFeature', () => ({
      useMyFeature: () => ({
        items: [{ id: '1', title: 'Test Item', status: 'active' }],
        isLoading: false,
      }),
    }));
    renderWithProviders(<MyFeatureWidget />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
});
```

## E2E Tests (Playwright)

E2E tests validate full user flows in the Electron desktop app.

### Release Gate

The authoritative release gate is the **Electron smoke lane**:

```bash
npm run test:e2e
```

This runs `tests/e2e/smoke.spec.ts` against the Electron app. It proves:

1. Login works
2. Onboarding completes
3. Weekly plan generates and confirms
4. Daily execution works
5. Reflection saves

### Advisory Lane

Browser-based Playwright tests are quarantined and NOT release evidence:

```bash
npm run test:e2e:advisory
```

### Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can complete weekly loop', async ({ page }) => {
  // Login
  await page.goto('/#/login');
  await page.fill('input[name="email"]', 'partner@lifeos.local');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Verify redirect to workspace
  await expect(page).toHaveURL(/mvp/);

  // Complete onboarding
  await page.click('[data-testid="start-onboarding"]');
  // ... fill onboarding form ...

  // Generate weekly plan
  await page.click('[data-testid="generate-plan"]');
  await expect(page.locator('[data-testid="plan-generated"]')).toBeVisible();
});
```

## Storybook

Storybook provides a development environment for UI components in isolation.

### Running

```bash
npm run storybook
```

Opens on port 6006.

### Writing Stories

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Click me',
    variant: 'secondary',
  },
};
```

## Test Configuration

### Vitest

Configuration in `vitest.config.ts`:

- Globals enabled (`describe`, `it`, `expect` available without import)
- Path aliases configured (`@/` maps to `src/`)
- Setup files for testing-library

### Playwright

Two configurations:

- `playwright.config.ts` -- base config
- `playwright.release.config.ts` -- Electron smoke (used by `npm run test:e2e`)

## Best Practices

1. **Test behavior, not implementation.** Focus on what the component does, not how it does it.
2. **Use data-testid for selectors.** Avoid brittle CSS selectors.
3. **Mock at the boundary.** Mock API calls and external services, not internal functions.
4. **Keep tests fast.** Unit tests should complete in milliseconds. Integration tests in seconds.
5. **One assertion per test.** Each test should verify one behavior.
6. **Use descriptive test names.** Names should explain what is being tested and expected behavior.
