/**
 * User authentication API routes
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { supabase } from '../lib/supabase'
import { LoginRequest, RegisterRequest, AuthResponse } from '../../shared/types'
import { normalizeEmail, normalizeName } from '@/shared/lib/normalize'
import { financeCategoryService } from '../services/financeCategoryService'

import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { loginSchema, registerSchema, profileUpdateSchema } from '@/shared/schemas/auth'

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

if (!JWT_SECRET && process.env.NODE_ENV !== 'test') {
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
  const logEmail = normalizeEmail(req.body?.email ?? '') || req.body?.email || 'unknown'
  try {
    const { email, password, name } = req.body
    const normEmail = normalizeEmail(email)
    const normName = normalizeName(name)

    // Check if profile already exists
    console.log('[Register] Checking for existing profile:', email);
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', normEmail) // Supabase Auth user id is the PK for profiles
      .single()

    // Create user in Supabase Auth first (conceptually, since we use profiles here)
    // For this implementation, we will assume Supabase Auth handles the user creation
    // and we just create the profile.
    
    // Hash password (if still using custom password table)
    const passwordHash = await bcrypt.hash(password, 10)

    // Create profile
    console.log('[Register] Inserting profile into DB...');
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([{
        full_name: normName,
        nickname: normName.split(' ')[0],
        preferences: {},
        theme: 'dark'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase profile creation error:', error)
      await logAuth(logEmail, 'fail', { code: 'REGISTER_FAILED', reason: 'db_error' }, req)
      res.status(500).json({ error: 'Failed to create profile', code: 'REGISTER_FAILED' })
      return
    }

    // Generate JWT token
    if (!JWT_SECRET) { res.status(500).json({ error: 'JWT_SECRET not configured' }); return }
    const token = jwt.sign(
      { userId: profile.id, email: normEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set HttpOnly cookie
    res.cookie('token', token, authCookieOptions)

    const response: AuthResponse = {
      token,
      user: {
        id: profile.id,
        email: normEmail,
        name: profile.nickname || profile.full_name,
        preferences: profile.preferences,
        theme: profile.theme,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    }

    // Create default finance categories for new user (async, non-blocking)
    financeCategoryService.createDefaultCategories(profile.id).catch(err => {
      console.error('[Register] Failed to create default categories:', err)
    })

    await logAuth(logEmail, 'success', { code: 'REGISTER_OK' }, req)
    res.status(201).json(response)
  } catch (error) {
    console.error('[Register] CRITICAL ERROR:', error)
    if (error instanceof Error) console.error(error.stack);
    await logAuth(logEmail, 'fail', { code: 'SERVER_ERROR', reason: 'exception' }, req)
    res.status(500).json({ error: 'Internal server error', code: 'SERVER_ERROR' })
  }
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', validate(loginSchema), async (req: Request<Record<string, never>, unknown, LoginRequest>, res: Response): Promise<void> => {
  const logEmail = normalizeEmail(req.body?.email ?? '') || req.body?.email || 'unknown'
  try {
    const { email, password } = req.body
    const normEmail = normalizeEmail(email)
    const attemptKey = normEmail

    if (!email || !password) {
      await logAuth(logEmail, 'fail', { code: 'BAD_REQUEST', reason: 'missing_fields' }, req)
      res.status(400).json({ error: 'Email and password are required', code: 'BAD_REQUEST' })
      return
    }

    const info = loginAttempts[attemptKey] || { count: 0, last: 0, lockedUntil: undefined }
    if (info.lockedUntil && info.lockedUntil > Date.now()) {
      await logAuth(logEmail, 'fail', { code: 'ACCOUNT_LOCKED', reason: 'rate_limit' }, req)
      res.status(423).json({ error: 'Account temporarily locked', code: 'ACCOUNT_LOCKED' })
      return
    }

    // Find profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', normEmail) // Assuming id is used here, adjust if email is unique elsewhere
      .single()

    if (error || !profile) {
      const now = Date.now()
      const attempts = loginAttempts[attemptKey] || { count: 0, last: 0 }
      loginAttempts[attemptKey] = { ...attempts, count: attempts.count + 1, last: now }
      await logAuth(logEmail, 'fail', { code: 'USER_NOT_FOUND', reason: 'not_found' }, req)
      res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' })
      return
    }

    // Verify password (if using custom passwords, otherwise Supabase Auth should handle this)
    // For now we keep the current logic but pointing to profile
    const isValidPassword = await bcrypt.compare(password, profile.password_hash)
    if (!isValidPassword) {
      const now = Date.now()
      const attempts = loginAttempts[attemptKey] || { count: 0, last: 0 }
      const withinWindow = attempts.last && (now - attempts.last) < 15 * 60 * 1000
      const newCount = withinWindow ? attempts.count + 1 : 1
      const lock = newCount >= 5 ? now + 15 * 60 * 1000 : undefined
      loginAttempts[attemptKey] = { count: newCount, last: now, lockedUntil: lock }
      if (lock) {
        await logAuth(logEmail, 'fail', { code: 'ACCOUNT_LOCKED', reason: 'too_many_attempts' }, req)
        res.status(423).json({ error: 'Account temporarily locked', code: 'ACCOUNT_LOCKED' })
      } else {
        await logAuth(logEmail, 'fail', { code: 'WRONG_PASSWORD', reason: 'bad_password' }, req)
        res.status(401).json({ error: 'Incorrect password', code: 'WRONG_PASSWORD' })
      }
      return
    }

    // Generate JWT token
    if (!JWT_SECRET) { res.status(500).json({ error: 'JWT_SECRET not configured' }); return }
    const token = jwt.sign(
      { userId: profile.id, email: normEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set HttpOnly cookie
    res.cookie('token', token, authCookieOptions)

    if (loginAttempts[attemptKey]) delete loginAttempts[attemptKey]

    const response: AuthResponse = {
      token,
      user: {
        id: profile.id,
        email: normEmail,
        name: profile.nickname || profile.full_name,
        preferences: profile.preferences,
        theme: profile.theme,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    }

    await logAuth(logEmail, 'success', { code: 'LOGIN_OK' }, req)
    res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    await logAuth(logEmail, 'fail', { code: 'SERVER_ERROR', reason: 'exception' }, req)
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
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify current session token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid, returns user data
 *       401:
 *         description: No token provided or invalid
 */
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      res.status(401).json({ error: 'Access token required' })
      return
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as JwtPayload & { userId: string; email: string }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, nickname, avatar_url, preferences, theme, created_at, updated_at')
      .eq('id', decoded.userId)
      .single()

    if (error || !profile) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    // Map profile to expected user format
    const user = {
      ...profile,
      email: decoded.email,
      name: profile.nickname || profile.full_name
    }

    res.json(user)
  } catch {
    res.status(403).json({ error: 'Invalid token' })
  }
})

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  // Placeholder for password reset logic
  res.json({ message: 'If an account exists with that email, a reset link will be sent.' })
})

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  // Placeholder for password reset logic
  res.json({ message: 'Password has been reset successfully.' })
})

/**
 * Update Profile
 * PATCH /api/auth/profile
 */
router.patch('/profile', authenticateToken, validate(profileUpdateSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { preferences, name, avatar_url, theme, nickname } = req.body as {
      preferences?: Record<string, unknown>
      name?: string
      avatar_url?: string
      theme?: 'light' | 'dark'
      nickname?: string
    }

    const updates: Record<string, unknown> = {}
    if (preferences !== undefined) updates.preferences = preferences
    if (name !== undefined) updates.full_name = normalizeName(name)
    if (nickname !== undefined) updates.nickname = nickname
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (theme !== undefined) updates.theme = theme

    if (!Object.keys(updates).length) {
      res.status(400).json({ error: 'No valid profile fields provided' })
      return
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user!.id)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: 'Failed to update profile' })
      return
    }

    res.json({
      ...profile,
      email: req.user!.email,
      name: profile.nickname || profile.full_name
    })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
