import { defineConfig } from 'vitest/config';
import path from 'path';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    environment: 'node',
    include: ['api/tests/**/*.test.ts', 'src/**/__tests__/**/*.test.ts', 'src/**/__tests__/**/*.test.tsx'],
    globals: true,
    coverage: {
      reporter: ['text', 'html']
    },
    // Storybook snapshot tests handled via standard jsdom tests
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
