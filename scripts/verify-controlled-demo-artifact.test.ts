// @vitest-environment node

import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, expect, it } from 'vitest'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function artifact(...contents: string[]) {
  const root = mkdtempSync(join(tmpdir(), 'lifeos-artifact-'))
  roots.push(root)
  mkdirSync(join(root, 'assets'))
  contents.forEach((content, index) => writeFileSync(join(root, 'assets', `${index}.js`), content))
  return root
}

function verify(root: string) {
  return spawnSync('node', ['scripts/verify-controlled-demo-artifact.mjs', root], {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
}

it('accepts a controlled-demo artifact without forbidden emissions', () => {
  expect(verify(artifact('console.log("LifeOS")')).status).toBe(0)
})

it.each(['LIFEOS-INVITE', 'SUPABASE_SERVICE_ROLE_KEY', 'showJoin=1'])('rejects artifact marker %s', (marker) => {
  const result = verify(artifact(marker))

  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain(marker)
})

it('rejects public source-map files', () => {
  const root = artifact('LifeOS')
  writeFileSync(join(root, 'assets', 'public.js.map'), '{}')

  expect(verify(root).status).not.toBe(0)
})
