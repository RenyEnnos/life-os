import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import { dirname, resolve as pathResolve } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reportOnFailure: true,
      all: true,
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
        '**/__tests__/**',
        'src/api/**',
        'api/**',
        // Exclude non-critical files from coverage requirements
        'src/**/*.stories.tsx',
        'src/**/*.stories.ts',
        'src/shared/types/database.ts',
        'src/design/**/*',
        'src/stories/**/*',
        'src/shared/types/**/*.ts',
        'src/tokens/**/*',
        'src/motion/**/*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': pathResolve(__dirname, './src')
    }
  }
})
