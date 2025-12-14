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
    }
  },
  resolve: {
    alias: {
      '@': pathResolve(__dirname, './src')
    }
  }
})
