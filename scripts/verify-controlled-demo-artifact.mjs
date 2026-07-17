import { readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.argv[2] ?? 'dist')
const forbidden = ['LIFEOS-INVITE', 'SUPABASE_SERVICE_ROLE_KEY', 'showJoin=1']
const textExtensions = /\.(?:css|html|js|json|svg|txt|webmanifest)$/
const pending = [root]

while (pending.length) {
  const path = pending.pop()
  if (!path) continue

  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path)) pending.push(resolve(path, entry))
    continue
  }

  if (path.endsWith('.map')) throw new Error('Controlled-demo artifact contains a public source map')
  if (!textExtensions.test(path)) continue

  const contents = readFileSync(path, 'utf8')
  const marker = forbidden.find((value) => contents.includes(value))
  if (marker) throw new Error(`Controlled-demo artifact contains forbidden marker: ${marker}`)
}

console.log('Controlled-demo artifact policy passed')
