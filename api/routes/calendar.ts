/**
 * Calendar API routes
 * Handle Google Calendar OAuth integration and event management
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { calendarService } from '../services/calendarService'
import jwt from 'jsonwebtoken'
import { validate } from '../middleware/validate'
import { calendarConnectSchema, createCalendarEventSchema } from '@/shared/schemas/calendar'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET

/**
 * Get Google OAuth authorization URL
 * GET /api/calendar/auth-url
 */
router.get('/auth-url', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      res.status(501).json({ error: 'Google OAuth not configured', code: 'OAUTH_NOT_CONFIGURED' })
      return
    }
    if (!JWT_SECRET) {
      res.status(500).json({ error: 'JWT secret missing', code: 'SERVER_CONFIG_ERROR' })
      return
    }
    const state = jwt.sign({ uid: req.user!.id }, JWT_SECRET, { expiresIn: '15m' })
    res.json({ url: calendarService.getAuthUrl(state) })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Failed to generate auth URL', code: 'AUTH_URL_FAILED', details: msg })
  }
})

/**
 * OAuth callback handler - redirects to frontend
 * GET /api/calendar/callback
 */
router.get('/callback', async (req: AuthRequest, res: Response): Promise<void> => {
  const { code, state } = req.query as Record<string, string>
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  if (!code || !state) {
    res.redirect(`${frontendUrl}/calendar?error=missing_oauth_params`)
    return
  }
  if (!JWT_SECRET) {
    res.redirect(`${frontendUrl}/calendar?error=server_config`)
    return
  }
  try {
    // Validate state to avoid attaching another user's code
    jwt.verify(state, JWT_SECRET)
  } catch {
    res.redirect(`${frontendUrl}/calendar?error=invalid_state`)
    return
  }
  // Passing code to frontend to execute the authenticated exchange via POST /connect
  res.redirect(`${frontendUrl}/calendar?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`)
})

/**
 * Exchange OAuth code for access tokens
 * POST /api/calendar/connect
 */
router.post('/connect', authenticateToken, validate(calendarConnectSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, state } = req.body

    if (!JWT_SECRET) {
      res.status(500).json({ error: 'JWT_SECRET not configured', code: 'SERVER_CONFIG_ERROR' })
      return
    }

    const decoded = jwt.verify(state, JWT_SECRET) as { uid: string }
    if (!decoded?.uid || decoded.uid !== req.user!.id) {
      res.status(403).json({ error: 'State does not match user', code: 'INVALID_STATE' })
      return
    }

    await calendarService.handleCallback(req.user!.id, code)
    res.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Failed to connect calendar', code: 'CONNECT_FAILED', details: msg })
  }
})

/**
 * Get calendar events
 * GET /api/calendar/events
 */
router.get('/events', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await calendarService.getCalendarClient(req.user!.id)
    const resp = await client.events.list({
      calendarId: 'primary',
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime'
    })
    res.json(resp.data.items ?? [])
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Failed to fetch calendar events', code: 'EVENTS_FETCH_FAILED', details: msg })
  }
})

/**
 * Create calendar event
 * POST /api/calendar/events
 */
router.post('/events', authenticateToken, validate(createCalendarEventSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await calendarService.getCalendarClient(req.user!.id)
    const resp = await client.events.insert({
      calendarId: 'primary',
      requestBody: req.body
    })
    res.status(201).json(resp.data)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Failed to create calendar event', code: 'EVENT_CREATE_FAILED', details: msg })
  }
})

export default router
