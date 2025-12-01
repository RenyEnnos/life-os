import { Router } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { initRealtime, realtimeBus } from '../lib/realtime'

const router = Router()

initRealtime()
const JWT_SECRET = process.env.JWT_SECRET

router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  const token = (req.query.token as string) || (req.headers['authorization']?.toString().replace(/^Bearer\s+/i, '') || '')
  if (!token) { res.status(401).end(); return }
  if (!JWT_SECRET) { res.status(500).end(); return }
  let userId: string | undefined
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string }
    userId = decoded.userId
  } catch {
    res.status(403).end(); return
  }

  const handler = (evt: { table: string, payload: { new?: Record<string, any>; old?: Record<string, any> } }) => {
    const row = evt.payload?.new ?? evt.payload?.old ?? {}
    const belongsToUser = row.user_id === userId || row.id === userId
    if (!belongsToUser) return
    res.write(`event: ${evt.table}\n`)
    res.write(`data: ${JSON.stringify(evt.payload)}\n\n`)
  }

  realtimeBus.on('db_change', handler)

  req.on('close', () => {
    realtimeBus.off('db_change', handler)
    res.end()
  })
})

export default router
