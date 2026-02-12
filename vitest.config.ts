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
      provider: 'v8'
    },
    env: {
      JWT_SECRET: 'test-secret',
      NODE_ENV: 'test',
      AI_TEST_MODE: 'mock'
    }
  },
  resolve: {
    alias: {
      '@': pathResolve(__dirname, './src')
    }
  }
})
