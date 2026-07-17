// @vitest-environment node

import { spawnSync } from 'node:child_process'

import { expect, it } from 'vitest'

it('stops server startup when the operating mode is missing', () => {
  const result = spawnSync('node', ['--import', 'tsx', 'api/server.ts'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
    env: {
      ...process.env,
      LIFEOS_SESSION_SECRET: '',
      LIFEOS_OPERATING_MODE: '',
    },
  })
  const output = `${result.stdout}\n${result.stderr}`

  expect(result.status).not.toBe(0)
  expect(output).toContain('LIFEOS_OPERATING_MODE')
  expect(output).not.toContain('LIFEOS_SESSION_SECRET or JWT_SECRET')
})
