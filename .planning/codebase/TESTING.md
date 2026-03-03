# Testing

## Frameworks
- **Unit & Integration:** Vitest combined with `@testing-library/react`.
- **End-to-End (E2E):** Playwright for critical user journeys and performance testing.
- **Mocking:** MSW (Mock Service Worker) for intercepting API requests in tests.

## Structure
- Tests should live alongside the file they are testing in a `__tests__` directory.
- Test files should be named `[filename].test.tsx` or `[filename].int.test.tsx` for integration tests.

## Guidelines
- Follow the Arrange-Act-Assert (AAA) pattern.
- Mock external providers (like React Query, Contexts) using wrappers in tests (e.g., `renderWithProviders`).
- E2E tests should cover main user workflows (authentication, creating items, navigation) without depending heavily on specific UI details.
