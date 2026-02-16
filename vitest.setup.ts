import '@testing-library/jest-dom/vitest'
// Removed server import for now as it might be causing connection issues if msw isn't fully set up
// import { server } from './src/test/msw/server'

// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-secret-for-vitest'
