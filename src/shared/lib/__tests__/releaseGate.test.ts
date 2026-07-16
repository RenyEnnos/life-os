import { existsSync, readFileSync } from 'node:fs'

import advisoryPlaywrightConfig from '../../../../playwright.config'
import releasePlaywrightConfig from '../../../../playwright.release.config'

function readPackageJsonScripts() {
  const packageJson = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8')) as {
    scripts?: Record<string, string>
  }

  return packageJson.scripts ?? {}
}

describe('release gate contract', () => {
  it('uses one honest web static-and-unit workflow', () => {
    const workflow = readFileSync(`${process.cwd()}/.github/workflows/ci.yml`, 'utf8')

    expect(workflow).toContain('name: Web CI')
    expect(workflow).toContain('name: web / static-and-unit')
    expect(workflow).toContain('npm run typecheck')
    expect(workflow).toContain('npm run lint')
    expect(workflow).toContain('npm run test')
    expect(workflow).toContain('npm run build')
    expect(workflow).toContain('npm run build:server')
    expect(workflow).not.toContain('electron:build')
    expect(workflow).not.toContain('test:e2e')
  })

  it('removes duplicate generic-test and false-RLS workflow ownership', () => {
    expect(existsSync(`${process.cwd()}/.github/workflows/test.yml`)).toBe(false)
    expect(existsSync(`${process.cwd()}/.github/workflows/ci-rls.yml`)).toBe(false)
  })

  it('keeps Electron smoke separate from the canonical web workflow', () => {
    const scripts = readPackageJsonScripts()

    expect(scripts['test:e2e']).toBe('playwright test -c playwright.release.config.ts')
    expect(scripts['test:e2e:smoke']).toBe('playwright test -c playwright.release.config.ts')
    expect(scripts['test:e2e:advisory']).toBe('playwright test -c playwright.config.ts')
  })

  it('keeps the experimental Electron config smoke-only and browser-free', () => {
    const releaseProjects = (releasePlaywrightConfig.projects ?? []) as Array<{ name?: string }>

    expect(releasePlaywrightConfig.testMatch).toBe('**/smoke.spec.ts')
    expect(releasePlaywrightConfig.webServer).toBeUndefined()
    expect(releaseProjects.map((project) => project.name)).toEqual(['smoke'])
  })

  it('labels browser projects as advisory and keeps smoke out of that lane', () => {
    const advisoryProjects = (advisoryPlaywrightConfig.projects ?? []) as Array<{
      name?: string
      testIgnore?: string[]
    }>

    expect(advisoryPlaywrightConfig.webServer).toBeDefined()
    expect(advisoryProjects.length).toBeGreaterThan(0)
    expect(
      advisoryProjects.every((project) => project.name?.startsWith('advisory-') === true),
    ).toBe(true)
    expect(
      advisoryProjects.every((project) => project.testIgnore?.includes('**/smoke.spec.ts') === true),
    ).toBe(true)
  })

  it('keeps experimental Electron smoke anchored to canonical MVP routes', () => {
    const smokeSpec = readFileSync(`${process.cwd()}/tests/e2e/smoke.spec.ts`, 'utf8')
    const legacyReleaseRoutes = [
      '#/tasks',
      '#/habits',
      '#/calendar',
      '#/journal',
      '#/projects',
      '#/university',
      '#/ai-assistant',
      '#/focus',
      '#/gamification',
      '#/design',
      '#/finances',
      '#/health',
    ]

    expect(smokeSpec).toContain('/mvp')

    for (const route of legacyReleaseRoutes) {
      expect(smokeSpec).not.toContain(route)
    }
  })
})
