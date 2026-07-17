import { describe, expect, it } from 'vitest'

import {
  validateBuildOperatingMode,
  validateServerOperatingMode,
} from './operatingMode'

const controlledDemo = {
  LIFEOS_OPERATING_MODE: 'controlled-demo',
  NODE_ENV: 'production',
  ALLOWED_ORIGIN: 'https://demo.example.test',
  LIFEOS_SESSION_SECRET: 'g7f4Qm9rT2v8Kx3pL6w1Nz5cHs0bYdEa',
  LIFEOS_INVITES: JSON.stringify([
    { email: 'person-a@example.test', code: 'DEMO-A-UNIQUE' },
    { email: 'person-b@example.test', code: 'DEMO-B-UNIQUE' },
  ]),
  LIFEOS_MVP_REPOSITORY: 'file',
}

describe('operating mode configuration', () => {
  it('keeps explicit local development available', () => {
    const env = { LIFEOS_OPERATING_MODE: 'local-dev', NODE_ENV: 'production' }

    expect(validateBuildOperatingMode(env)).toBe('local-dev')
    expect(validateServerOperatingMode(env)).toBe('local-dev')
  })

  it('rejects missing and unsupported modes', () => {
    expect(() => validateBuildOperatingMode({})).toThrow('LIFEOS_OPERATING_MODE')
    expect(() =>
      validateBuildOperatingMode({ LIFEOS_OPERATING_MODE: 'partner-beta' }),
    ).toThrow('LIFEOS_OPERATING_MODE')
  })

  it('accepts a complete controlled-demo profile', () => {
    expect(validateBuildOperatingMode(controlledDemo)).toBe('controlled-demo')
    expect(validateServerOperatingMode(controlledDemo)).toBe('controlled-demo')
  })

  it.each([
    ['VITE_BYPASS_MVP_INVITE_GATE', 'true'],
    ['VITE_BYPASS_MVP_INVITE_GATE', '1'],
    ['VITE_ENABLE_INTERNAL_MVP_ADMIN', 'true'],
    ['VITE_ENABLE_INTERNAL_MVP_ADMIN', 'yes'],
    ['VITE_SENTRY_DSN', 'https://public@example.test/1'],
    ['VITE_GA_MEASUREMENT_ID', 'G-TEST'],
    ['VITE_ANALYTICS_ENDPOINT', 'https://analytics.example.test'],
    ['VITE_ERROR_ENDPOINT', 'https://errors.example.test'],
    ['SUPABASE_SERVICE_ROLE_KEY', 'synthetic-privileged-value'],
  ])('rejects %s from controlled-demo builds without echoing its value', (name, value) => {
    expect(() => validateBuildOperatingMode({ ...controlledDemo, [name]: value })).toThrow(name)

    try {
      validateBuildOperatingMode({ ...controlledDemo, [name]: value })
    } catch (error) {
      expect(String(error)).not.toContain(value)
    }
  })

  it.each([
    ['NODE_ENV', 'development'],
    ['ALLOWED_ORIGIN', 'http://demo.example.test'],
    ['ALLOWED_ORIGIN', 'https://*.example.test'],
    ['LIFEOS_SESSION_SECRET', 'too-short'],
    ['LIFEOS_SESSION_SECRET', 'canonical-e2e-synthetic-secret'],
    ['LIFEOS_SESSION_SECRET', 'change-me-change-me-change-me-change-me'],
    ['LIFEOS_SESSION_SECRET', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'],
    ['LIFEOS_INVITES', ''],
    ['LIFEOS_INVITES', 'not-an-invite'],
    ['LIFEOS_INVITES', JSON.stringify([{ email: 'not-an-email', code: 'DEMO-A' }])],
    [
      'LIFEOS_INVITES',
      JSON.stringify([{ email: 'partner@lifeos.local', code: 'LIFEOS-INVITE' }]),
    ],
    [
      'LIFEOS_INVITES',
      JSON.stringify([
        { email: 'a@example.test', code: 'DUPLICATE' },
        { email: 'b@example.test', code: 'DUPLICATE' },
      ]),
    ],
    ['LIFEOS_MVP_REPOSITORY', ''],
    ['LIFEOS_MVP_REPOSITORY', 'prisma'],
    ['DATABASE_URL', 'postgresql://unused.example.test/lifeos'],
  ])('rejects invalid controlled-demo server variable %s', (name, value) => {
    expect(() => validateServerOperatingMode({ ...controlledDemo, [name]: value })).toThrow(name)
  })

  it('does not accept the JWT compatibility alias for controlled-demo', () => {
    const { LIFEOS_SESSION_SECRET: _removed, ...withoutCanonicalSecret } = controlledDemo

    expect(() =>
      validateServerOperatingMode({
        ...withoutCanonicalSecret,
        JWT_SECRET: 'g7f4Qm9rT2v8Kx3pL6w1Nz5cHs0bYdEa',
      }),
    ).toThrow('LIFEOS_SESSION_SECRET')
  })
})
