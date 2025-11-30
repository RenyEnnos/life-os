import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'api', '.mock-data')

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
}

function tablePath(table: string) {
  ensureDir()
  return path.join(dataDir, `${table}.json`)
}

export function readTable<T = any>(table: string): T[] {
  const file = tablePath(table)
  if (!fs.existsSync(file)) return []
  try { const raw = fs.readFileSync(file, 'utf-8'); return JSON.parse(raw) as T[] } catch { return [] }
}

export function writeTable<T = any>(table: string, rows: T[]) {
  const file = tablePath(table)
  fs.writeFileSync(file, JSON.stringify(rows, null, 2), 'utf-8')
}
