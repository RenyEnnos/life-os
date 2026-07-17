import { existsSync, readFileSync } from 'node:fs'

import advisoryPlaywrightConfig from '../../../../playwright.config'
import electronPlaywrightConfig from '../../../../playwright.electron.config'
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
    const staticJob = workflow.split(/^ {2}canonical-e2e:/m)[0]

    expect(workflow).toContain('name: Web CI')
    expect(workflow).toContain('name: web / static-and-unit')
    expect(workflow).toContain('npm run typecheck')
    expect(workflow).toContain('npm run lint')
    expect(workflow).toContain('npm run test')
    expect(workflow).toContain('npm run build')
    expect(workflow).toContain('npm run build:server')
    expect(staticJob).not.toContain('electron:build')
    expect(staticJob).not.toContain('test:e2e')
  })

  it('publishes canonical browser evidence as a separate stable job', () => {
    const workflow = readFileSync(`${process.cwd()}/.github/workflows/ci.yml`, 'utf8')

    expect(workflow).toContain('name: web / canonical-e2e')
    expect(workflow).toContain('npx playwright install --with-deps chromium')
    expect(workflow).toContain('npm run test:e2e')
    expect(workflow).toMatch(/if:\s*always\(\)[\s\S]*rm -rf test-results\/canonical/)
  })

  it('removes duplicate generic-test and false-RLS workflow ownership', () => {
    expect(existsSync(`${process.cwd()}/.github/workflows/test.yml`)).toBe(false)
    expect(existsSync(`${process.cwd()}/.github/workflows/ci-rls.yml`)).toBe(false)
  })

  it('keeps Electron smoke separate from the canonical web workflow', () => {
    const scripts = readPackageJsonScripts()

    expect(scripts['test:e2e']).toBe('playwright test -c playwright.release.config.ts')
    expect(scripts['test:e2e:electron-advisory']).toBe(
      'playwright test -c playwright.electron.config.ts',
    )
    expect(scripts['test:e2e:advisory']).toBe('playwright test -c playwright.config.ts')
  })

  it('keeps the experimental Electron config smoke-only and browser-free', () => {
    const electronProjects = (electronPlaywrightConfig.projects ?? []) as Array<{ name?: string }>

    expect(electronPlaywrightConfig.testMatch).toBe('**/smoke.spec.ts')
    expect(electronPlaywrightConfig.webServer).toBeUndefined()
    expect(electronProjects.map((project) => project.name)).toEqual(['advisory-electron'])
  })

  it('owns the canonical browser journey in one Chromium project', () => {
    const releaseProjects = (releasePlaywrightConfig.projects ?? []) as Array<{ name?: string }>

    expect(releasePlaywrightConfig.testMatch).toBe('**/canonical.spec.ts')
    expect(releasePlaywrightConfig.outputDir).toBe('test-results/canonical/playwright')
    expect(releasePlaywrightConfig.webServer).toBeDefined()
    expect(releaseProjects.map((project) => project.name)).toEqual(['canonical-chromium'])
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
    expect(
      advisoryProjects.every(
        (project) => project.testIgnore?.includes('**/canonical.spec.ts') === true,
      ),
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

  it('keeps container acceptance aligned with the canonical single-process runtime', () => {
    const compose = readFileSync(`${process.cwd()}/docker-compose.yml`, 'utf8')
    const dockerignore = readFileSync(`${process.cwd()}/.dockerignore`, 'utf8')
    const dockerfile = readFileSync(`${process.cwd()}/Dockerfile`, 'utf8')
    const workflow = readFileSync(
      `${process.cwd()}/.github/workflows/docker-acceptance-smoke.yml`,
      'utf8',
    )

    expect(compose).toContain('"3001:3001"')
    expect(compose).toContain('LIFEOS_SESSION_SECRET')
    expect(compose).toContain('LIFEOS_OPERATING_MODE=controlled-demo')
    expect(compose).toContain('ALLOWED_ORIGIN=${ALLOWED_ORIGIN:?ALLOWED_ORIGIN is required}')
    expect(compose).toContain('LIFEOS_INVITES=${LIFEOS_INVITES:?LIFEOS_INVITES is required}')
    expect(compose).toContain('LIFEOS_MVP_REPOSITORY=file')
    expect(compose).not.toContain('SUPABASE_SERVICE_ROLE_KEY')
    expect(compose).not.toContain('lifeosredis')
    expect(compose).not.toMatch(/^\s{2}(redis|nginx):/m)
    expect(workflow).toContain('.State.Health.Status')
    expect(workflow).toContain('LIFEOS_OPERATING_MODE=controlled-demo')
    expect(workflow).toContain('-e NODE_ENV=production')
    expect(workflow).toContain('session_secret="$(openssl rand -hex 32)"')
    expect(workflow).not.toContain('--health-cmd')
    expect(workflow).toContain('http://127.0.0.1:3001/mvp/today')
    expect(workflow).toContain('http://127.0.0.1:3001/api/auth/verify')
    expect(dockerignore).toContain('node_modules')
    expect(dockerignore).toContain('.git')
    expect(dockerignore).toContain('dist')
    expect(dockerignore).toContain('.data')
    expect(dockerfile).toContain('RUN npm run prisma:generate')
    expect(dockerfile).toContain('ENV LIFEOS_OPERATING_MODE=controlled-demo')
    expect(dockerfile.indexOf('RUN npm run prisma:generate')).toBeLessThan(
      dockerfile.indexOf('RUN npm run build'),
    )
    expect(dockerfile).toContain(
      'COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma',
    )
  })

  it('enforces the operating mode at build, startup, and canonical CI boundaries', () => {
    const vite = readFileSync(`${process.cwd()}/vite.config.ts`, 'utf8')
    const server = readFileSync(`${process.cwd()}/api/server.ts`, 'utf8')
    const workflow = readFileSync(`${process.cwd()}/.github/workflows/ci.yml`, 'utf8')
    const releaseConfig = readFileSync(`${process.cwd()}/playwright.release.config.ts`, 'utf8')
    const scripts = readPackageJsonScripts()

    expect(vite).toContain('validateBuildOperatingMode')
    expect(server).toContain('validateServerOperatingMode')
    expect(workflow).toContain('LIFEOS_OPERATING_MODE: local-dev')
    expect(releaseConfig).toContain("LIFEOS_OPERATING_MODE: 'local-dev'")
    expect(scripts['verify:controlled-demo-artifact']).toBe(
      'node scripts/verify-controlled-demo-artifact.mjs dist',
    )
  })
})
