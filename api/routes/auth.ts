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
import { normalizeEmail, normalizeName } from '@/shared/lib/normalize'

import { validate } from '../middleware/validate'
import { loginSchema, registerSchema } from '@/shared/schemas/auth'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET
const isProduction = process.env.NODE_ENV === 'production'
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' as const : 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
}

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
    // noop
  }
}

/**
 * User Registration
 * POST /api/auth/register
 */
router.post('/register', validate(registerSchema), async (req: Request<Record<string, never>, unknown, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body
    const normEmail = normalizeEmail(email)
    const normName = normalizeName(name)

    // Check if user already exists
    console.log('[Register] Checking for existing user:', email);
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normEmail)
      .single()

    // Ignore error if it's just "not found" (PGRST116)
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[Register] Check Error:', checkError);
    }

    if (existingUser) {
      console.log('[Register] User exists:', existingUser.id);
      await logAuth(email, 'fail', { code: 'USER_EXISTS', reason: 'duplicate' }, req)
      res.status(400).json({ error: 'User already exists', code: 'USER_EXISTS' })
      return
    }

    // Hash password
    console.log('[Register] Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    console.log('[Register] Inserting user into DB...');
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email: normEmail,
        password_hash: passwordHash,
        name: normName,
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

    // Set HttpOnly cookie
    res.cookie('token', token, authCookieOptions)

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
    console.error('[Register] CRITICAL ERROR:', error)
    if (error instanceof Error) console.error(error.stack);
    await logAuth(req.body?.email || 'unknown', 'fail', { code: 'SERVER_ERROR', reason: 'exception' }, req)
    res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' })
  }
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', validate(loginSchema), async (req: Request<Record<string, never>, unknown, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const normEmail = normalizeEmail(email)

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
      .eq('email', normEmail)
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

    // Set HttpOnly cookie
    res.cookie('token', token, authCookieOptions)

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

    await logAuth(normEmail, 'success', { code: 'LOGIN_OK' }, req)
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
  res.clearCookie('token', authCookieOptions)
  res.json({ message: 'Logged out successfully' })
})

/**
 * Token Verify
 * GET /api/auth/verify
 */
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      res.status(401).json({ error: 'Access token required' })
      return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; email: string }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, avatar_url, preferences, theme, created_at, updated_at')
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
 * PATCH /api/auth/profile
 */
router.patch('/profile', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'Access token required' })
      return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; email: string }
    const { preferences, name, avatar_url } = req.body

    const updates: Record<string, any> = {}
    if (preferences) updates.preferences = preferences
    if (name) updates.name = name
    if (avatar_url) updates.avatar_url = avatar_url

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
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
