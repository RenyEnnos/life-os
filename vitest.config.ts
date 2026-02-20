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
      all: false, // Only count files actually imported by tests
      // Only include critical business logic in coverage calculations
      include: [
        'src/features/*/api/**/*.{js,jsx,ts,tsx}',
        'src/features/*/hooks/**/*.{js,jsx,ts,tsx}',
        'src/features/*/logic/**/*.{js,jsx,ts,tsx}',
        'src/features/gamification/**/*.{js,jsx,ts,tsx}',
        'src/features/onboarding/**/*.{js,jsx,ts,tsx}',
        'src/features/habits/api/**/*.{js,jsx,ts,tsx}',
        'src/features/habits/logic/**/*.{js,jsx,ts,tsx}',
        'src/features/habits/hooks/**/*.{js,jsx,ts,tsx}',
        'src/features/journal/api/**/*.{js,jsx,ts,tsx}',
        'src/features/health/api/**/*.{js,jsx,ts,tsx}',
        'src/features/tasks/api/**/*.{js,jsx,ts,tsx}',
        'src/features/auth/api/**/*.{js,jsx,ts,tsx}',
        'src/shared/api/http.ts',
        'src/shared/api/authToken.ts',
        'src/shared/lib/normalize.ts',
        'src/shared/lib/syncQueue.ts',
        'src/shared/lib/cn.ts',
        'src/shared/lib/dynamicNow/**/*',
        'src/shared/lib/audio/noiseGenerator.ts'
      ],
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
      ],
      thresholds: {
        lines: 25,
        functions: 40,
        branches: 60,
        statements: 25,
        perFile: false,
        autoUpdate: true
      }
    }
  },
  resolve: {
    alias: {
      '@': pathResolve(__dirname, './src')
    }
  }
})
