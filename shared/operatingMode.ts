export type OperatingMode = 'local-dev' | 'controlled-demo'

type Environment = Record<string, string | undefined>

export interface InviteSeed {
  code: string
  email: string
  fullName?: string
}

const VENDOR_VARIABLES = [
  'VITE_SENTRY_DSN',
  'VITE_GA_MEASUREMENT_ID',
  'VITE_ANALYTICS_ENDPOINT',
  'VITE_ERROR_ENDPOINT',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

function invalid(name: string): never {
  throw new Error(`Invalid operating-mode configuration: ${name}`)
}

function isForbiddenFlag(value?: string): boolean {
  return Boolean(value?.trim()) && value?.trim().toLowerCase() !== 'false'
}

export function parseInviteSeeds(raw?: string): InviteSeed[] {
  if (!raw?.trim()) return []

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed.map((value) => {
      if (!value || typeof value !== 'object') throw new Error('invalid invite')
      const invite = value as Record<string, unknown>
      const email = typeof invite.email === 'string' ? invite.email.trim().toLowerCase() : ''
      const code = typeof invite.code === 'string' ? invite.code.trim() : ''
      const fullName = typeof invite.fullName === 'string' ? invite.fullName.trim() : ''
      if (!email || !code) throw new Error('invalid invite')
      return { email, code, ...(fullName ? { fullName } : {}) }
    })
  } catch (error) {
    if (!(error instanceof SyntaxError)) return []
  }

  return raw
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const [emailPart = '', codePart = '', ...nameParts] = segment.split(':')
      const email = emailPart.trim().toLowerCase()
      const code = codePart.trim()
      const fullName = nameParts.join(':').trim()
      return { email, code, ...(fullName ? { fullName } : {}) }
    })
    .filter((invite) => invite.email && invite.code)
}

export function validateBuildOperatingMode(env: Environment): OperatingMode {
  const mode = env.LIFEOS_OPERATING_MODE?.trim()
  if (mode !== 'local-dev' && mode !== 'controlled-demo') invalid('LIFEOS_OPERATING_MODE')

  if (mode === 'local-dev') {
    return mode
  }

  if (isForbiddenFlag(env.VITE_BYPASS_MVP_INVITE_GATE)) invalid('VITE_BYPASS_MVP_INVITE_GATE')
  if (isForbiddenFlag(env.VITE_ENABLE_INTERNAL_MVP_ADMIN)) invalid('VITE_ENABLE_INTERNAL_MVP_ADMIN')
  for (const name of VENDOR_VARIABLES) {
    if (env[name]?.trim()) invalid(name)
  }

  return mode
}

export function validateServerOperatingMode(env: Environment): OperatingMode {
  const mode = validateBuildOperatingMode(env)
  if (mode === 'local-dev') return mode

  if (env.NODE_ENV !== 'production') invalid('NODE_ENV')

  try {
    const origin = new URL(env.ALLOWED_ORIGIN ?? '')
    if (
      origin.protocol !== 'https:' ||
      origin.origin !== env.ALLOWED_ORIGIN?.trim() ||
      origin.username ||
      origin.password ||
      origin.hostname.includes('*')
    ) invalid('ALLOWED_ORIGIN')
  } catch {
    invalid('ALLOWED_ORIGIN')
  }

  const secret = env.LIFEOS_SESSION_SECRET?.trim() ?? ''
  if (
    secret.length < 32 ||
    new Set(secret).size < 12 ||
    /(?:change[-_ ]?me|synthetic|test[-_ ]?secret|example[-_ ]?secret)/i.test(secret)
  ) {
    invalid('LIFEOS_SESSION_SECRET')
  }

  const invites = parseInviteSeeds(env.LIFEOS_INVITES)
  const emails = new Set<string>()
  const codes = new Set<string>()
  if (
    invites.length === 0 ||
    invites.some((invite) => {
      const duplicate = emails.has(invite.email) || codes.has(invite.code)
      emails.add(invite.email)
      codes.add(invite.code)
      return duplicate ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite.email) ||
        invite.email === 'partner@lifeos.local' ||
        invite.code === 'LIFEOS-INVITE'
    })
  ) invalid('LIFEOS_INVITES')

  if (env.LIFEOS_MVP_REPOSITORY !== 'file') invalid('LIFEOS_MVP_REPOSITORY')
  if (env.DATABASE_URL?.trim()) invalid('DATABASE_URL')

  return mode
}
