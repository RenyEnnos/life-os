/**
 * User authentication API routes
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { supabase } from '../lib/supabase'
import { LoginRequest, RegisterRequest, AuthResponse } from '../../shared/types'
import { z } from 'zod'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined in environment variables.')
  process.exit(1)
}

const loginAttempts: Record<string, { count: number; last: number; lockedUntil?: number }> = {}

async function logAuth(email: string, status: 'success' | 'fail', meta?: { code?: string; reason?: string }, req?: Request) {
  try {
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || 'unknown'
    const ua = req?.headers['user-agent'] || 'unknown'
    await supabase.from('auth_logs').insert([{ email, status, code: meta?.code || null, reason: meta?.reason || null, ip, user_agent: ua, created_at: new Date().toISOString() }])
  } catch {
    // noop: logging failures must not impact auth flow
  }
}

/**
 * User Registration
 * POST /api/auth/register
 */
router.post('/register', async (req: Request<Record<string, never>, unknown, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const schema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(1) })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) {
      await logAuth((req.body?.email as string) || 'unknown', 'fail', { code: 'BAD_REQUEST', reason: 'missing_fields' }, req)
      res.status(400).json({ error: 'Email, password, and name are required', code: 'BAD_REQUEST' })
      return
    }
    const { email, password, name } = parsed.data

    if (!email || !password || !name) {
      await logAuth(email || 'unknown', 'fail', { code: 'BAD_REQUEST', reason: 'missing_fields' }, req)
      res.status(400).json({ error: 'Email, password, and name are required', code: 'BAD_REQUEST' })
      return
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      await logAuth(email, 'fail', { code: 'USER_EXISTS', reason: 'duplicate' }, req)
      res.status(400).json({ error: 'User already exists', code: 'USER_EXISTS' })
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash: passwordHash,
        name,
        preferences: {},
        theme: 'dark'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase registration error:', error)
      await logAuth(email, 'fail', { code: 'REGISTER_FAILED', reason: 'db_error' }, req)
      res.status(500).json({ error: 'Failed to create user', code: 'REGISTER_FAILED' })
      return
    }

    // Generate JWT token
    if (!JWT_SECRET) { res.status(500).json({ error: 'JWT_SECRET not configured' }); return }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
        theme: user.theme,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    }

    await logAuth(email, 'success', { code: 'REGISTER_OK' }, req)
    res.status(201).json(response)
  } catch (error) {
    console.error('Registration error:', error)
    await logAuth(req.body?.email || 'unknown', 'fail', { code: 'SERVER_ERROR', reason: 'exception' }, req)
    res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' })
  }
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request<Record<string, never>, unknown, LoginRequest>, res: Response): Promise<void> => {
  try {
    const schema = z.object({ email: z.string().email(), password: z.string().min(8) })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) {
      await logAuth((req.body?.email as string) || 'unknown', 'fail', { code: 'BAD_REQUEST', reason: 'missing_fields' }, req)
      res.status(400).json({ error: 'Email and password are required', code: 'BAD_REQUEST' })
      return
    }
    const { email, password } = parsed.data

    if (!email || !password) {
      await logAuth(email || 'unknown', 'fail', { code: 'BAD_REQUEST', reason: 'missing_fields' }, req)
      res.status(400).json({ error: 'Email and password are required', code: 'BAD_REQUEST' })
      return
    }

    const info = loginAttempts[email] || { count: 0, last: 0, lockedUntil: undefined }
    if (info.lockedUntil && info.lockedUntil > Date.now()) {
      await logAuth(email, 'fail', { code: 'ACCOUNT_LOCKED', reason: 'rate_limit' }, req)
      res.status(423).json({ error: 'Account temporarily locked', code: 'ACCOUNT_LOCKED' })
      return
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      const now = Date.now()
      const attempts = loginAttempts[email] || { count: 0, last: 0 }
      loginAttempts[email] = { ...attempts, count: attempts.count + 1, last: now }
      await logAuth(email, 'fail', { code: 'USER_NOT_FOUND', reason: 'not_found' }, req)
      res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' })
      return
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      const now = Date.now()
      const attempts = loginAttempts[email] || { count: 0, last: 0 }
      const withinWindow = attempts.last && (now - attempts.last) < 15 * 60 * 1000
      const newCount = withinWindow ? attempts.count + 1 : 1
      const lock = newCount >= 5 ? now + 15 * 60 * 1000 : undefined
      loginAttempts[email] = { count: newCount, last: now, lockedUntil: lock }
      if (lock) {
        await logAuth(email, 'fail', { code: 'ACCOUNT_LOCKED', reason: 'too_many_attempts' }, req)
        res.status(423).json({ error: 'Account temporarily locked', code: 'ACCOUNT_LOCKED' })
      } else {
        await logAuth(email, 'fail', { code: 'WRONG_PASSWORD', reason: 'bad_password' }, req)
        res.status(401).json({ error: 'Incorrect password', code: 'WRONG_PASSWORD' })
      }
      return
    }

    // Generate JWT token
    if (!JWT_SECRET) { res.status(500).json({ error: 'JWT_SECRET not configured' }); return }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    if (loginAttempts[email]) delete loginAttempts[email]

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
        theme: user.theme,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    }

    await logAuth(email, 'success', { code: 'LOGIN_OK' }, req)
    res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    await logAuth(req.body?.email || 'unknown', 'fail', { code: 'SERVER_ERROR', reason: 'exception' }, req)
    res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' })
  }
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  // In a stateless JWT system, logout is handled client-side
  // We can optionally blacklist tokens or perform cleanup here
  res.json({ message: 'Logged out successfully' })
})

/**
 * Token Verify
 * GET /api/auth/verify
 */
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'Access token required' })
      return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; email: string }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, preferences, theme, created_at, updated_at')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    res.json(user)
  } catch {
    res.status(403).json({ error: 'Invalid token' })
  }
})

/**
 * Update Profile
 * PUT /api/auth/profile
 */
router.put('/profile', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'Access token required' })
      return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; email: string }
    const { preferences } = req.body

    const { data: user, error } = await supabase
      .from('users')
      .update({ preferences })
      .eq('id', decoded.userId)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: 'Failed to update profile' })
      return
    }

    res.json(user)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
