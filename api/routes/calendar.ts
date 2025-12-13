import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { calendarService } from '../services/calendarService'

const router = Router()

router.get('/auth-url', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return res.status(501).json({ error: 'Google OAuth not configured' })
  res.json({ url: calendarService.getAuthUrl() })
})

// Redirect Google callback to Frontend to handle auth state securely
router.get('/callback', async (req, res) => {
  const { code } = req.query as Record<string, string>
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  if (!code) {
    return res.redirect(`${frontendUrl}/calendar?error=no_code`)
  }
  // Passing code to frontend to execute the authenticated exchange via POST /connect
  res.redirect(`${frontendUrl}/calendar?code=${code}`)
})

// Secure endpoint for frontend to exchange code for tokens
router.post('/connect', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'code required' })

  try {
    await calendarService.handleCallback(req.user!.id, code)
    res.json({ success: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(500).json({ error: msg })
  }
})

router.get('/events', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const client = await calendarService.getCalendarClient(req.user!.id)
    const resp = await client.events.list({ calendarId: 'primary', maxResults: 50, singleEvents: true, orderBy: 'startTime' })
    res.json(resp.data.items ?? [])
  } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Unknown error'; res.status(500).json({ error: msg }) }
})

export default router
