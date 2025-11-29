import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { calendarService } from '../services/calendarService'

const router = Router()

router.get('/auth-url', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return res.status(501).json({ error: 'Google OAuth not configured' })
  res.json({ url: calendarService.getAuthUrl() })
})

router.get('/callback', async (req: AuthRequest, res: Response) => {
  const { code } = req.query as any
  if (!code) return res.status(400).json({ error: 'code required' })
  // In real flow, identify user via session; here we require Authorization
  try {
    await calendarService.handleCallback(req.user!.id, code)
    res.send('Calendar connected. You can close this window.')
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/events', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const client = await calendarService.getCalendarClient(req.user!.id)
    const resp = await client.events.list({ calendarId: 'primary', maxResults: 50, singleEvents: true, orderBy: 'startTime' })
    res.json(resp.data.items ?? [])
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

export default router
