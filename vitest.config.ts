import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['api/tests/**/*.test.ts', 'src/**/__tests__/**/*.test.ts', 'src/**/__tests__/**/*.test.tsx'],
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})
