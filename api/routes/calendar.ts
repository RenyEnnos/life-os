import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { calendarService } from '../services/calendarService'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET

router.get('/auth-url', authenticateToken, async (req: AuthRequest, res: Response) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return res.status(501).json({ error: 'Google OAuth not configured' })
  if (!JWT_SECRET) return res.status(500).json({ error: 'JWT secret missing' })
  const state = JWT_SECRET ? jwt.sign({ uid: req.user!.id }, JWT_SECRET, { expiresIn: '15m' }) : undefined
  res.json({ url: calendarService.getAuthUrl(state) })
})

// Redirect Google callback to Frontend to handle auth state securely
router.get('/callback', async (req, res) => {
  const { code, state } = req.query as Record<string, string>
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  if (!code || !state) {
    return res.redirect(`${frontendUrl}/calendar?error=missing_oauth_params`)
  }
  if (!JWT_SECRET) {
    return res.redirect(`${frontendUrl}/calendar?error=server_config`)
  }
  try {
    // Validate state to avoid attaching another user's code
    jwt.verify(state, JWT_SECRET)
  } catch {
    return res.redirect(`${frontendUrl}/calendar?error=invalid_state`)
  }
  // Passing code to frontend to execute the authenticated exchange via POST /connect
  res.redirect(`${frontendUrl}/calendar?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`)
})

// Secure endpoint for frontend to exchange code for tokens
router.post('/connect', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { code, state } = req.body as { code?: string; state?: string }
  if (!code || !state) return res.status(400).json({ error: 'code and state required' })
  if (!JWT_SECRET) return res.status(500).json({ error: 'JWT_SECRET not configured' })

  try {
    const decoded = jwt.verify(state, JWT_SECRET) as { uid: string }
    if (!decoded?.uid || decoded.uid !== req.user!.id) {
      return res.status(403).json({ error: 'state does not match user' })
    }
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
