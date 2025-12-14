import '@testing-library/jest-dom/vitest'
import { server } from './src/test/msw/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
