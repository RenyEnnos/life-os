/**
 * User authentication API routes
 * Handle user registration, login, token management, etc.
 * Uses Supabase Auth for identity and public.profiles for metadata.
 */
import { Router, type Request, type Response } from 'express'
import { supabase } from '../lib/supabase'
import { LoginRequest, RegisterRequest, AuthResponse } from '@/shared/types'
import { normalizeEmail, normalizeName } from '@/shared/lib/normalize'
import { financeCategoryService } from '../services/financeCategoryService'

import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { loginSchema, registerSchema, profileUpdateSchema } from '@/shared/schemas/auth'

const router = Router()
const isProduction = process.env.NODE_ENV === 'production'
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' as const : 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
}

async function logAuth(email: string, status: 'success' | 'fail', meta?: { code?: string; reason?: string }, req?: Request) {
  try {
    const ip = (req?.headers['x-forwarded-for'] as string) || req?.ip || 'unknown'
    const ua = req?.headers['user-agent'] || 'unknown'
    await supabase.from('auth_logs').insert([{ email, status, code: meta?.code || null, reason: meta?.reason || null, ip, user_agent: ua, created_at: new Date().toISOString() }])
  } catch (error) {
    console.error('Failed to log auth event:', error)
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
    const normName = normalizeName(name)

    // Register user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: normName,
        },
      },
    })

    if (authError || !authData.user) {
      console.error('Supabase Auth registration error:', authError)
      await logAuth(logEmail, 'fail', { code: 'REGISTER_FAILED', reason: authError?.message || 'auth_error' }, req)
      res.status(authError?.status || 500).json({ error: authError?.message || 'Failed to register user', code: 'REGISTER_FAILED' })
      return
    }

    const userId = authData.user.id;

    // Fetch the profile (created by DB trigger)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!profile) {
      // If trigger hasn't finished yet or failed, create a temporary response
      // But usually it's atomic in the same transaction
      console.warn('Profile not found immediately after registration');
    }

    const token = authData.session?.access_token || '';

    // Set HttpOnly cookie if we have a token
    if (token) {
      res.cookie('token', token, authCookieOptions)
    }

    const response: AuthResponse = {
      token,
      user: {
        id: userId,
        email: authData.user.email!,
        name: profile?.nickname || profile?.full_name || normName,
        preferences: profile?.preferences || {},
        theme: profile?.theme || 'dark',
        created_at: profile?.created_at || new Date().toISOString(),
        updated_at: profile?.updated_at || new Date().toISOString()
      }
    }

    // Create default finance categories for new user (async, non-blocking)
    financeCategoryService.createDefaultCategories(userId).catch(err => {
      console.error('[Register] Failed to create default categories:', err)
    })

    await logAuth(logEmail, 'success', { code: 'REGISTER_OK' }, req)
    res.status(201).json(response)
  } catch (error) {
    console.error('[Register] CRITICAL ERROR:', error)
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

    // Login with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user || !authData.session) {
      await logAuth(logEmail, 'fail', { code: 'LOGIN_FAILED', reason: authError?.message || 'invalid_credentials' }, req)
      res.status(authError?.status || 401).json({ error: authError?.message || 'Invalid credentials', code: 'LOGIN_FAILED' })
      return
    }

    // Find profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    const token = authData.session.access_token

    // Set HttpOnly cookie
    res.cookie('token', token, authCookieOptions)

    const response: AuthResponse = {
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        name: profile?.nickname || profile?.full_name || authData.user.email!.split('@')[0],
        preferences: profile?.preferences || {},
        theme: profile?.theme || 'dark',
        created_at: profile?.created_at || authData.user.created_at,
        updated_at: profile?.updated_at || authData.user.updated_at
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
  await supabase.auth.signOut()
  res.clearCookie('token', authCookieOptions)
  res.json({ message: 'Logged out successfully' })
})

/**
 * Verify current session token
 * GET /api/auth/verify
 */
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      res.status(401).json({ error: 'Access token required' })
      return
    }

    // Use Supabase to verify the token
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !authUser) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, nickname, avatar_url, preferences, theme, created_at, updated_at')
      .eq('id', authUser.id)
      .single()

    // Map profile to expected user format
    const user = {
      id: authUser.id,
      email: authUser.email,
      name: profile?.nickname || profile?.full_name || authUser.email!.split('@')[0],
      avatar_url: profile?.avatar_url,
      preferences: profile?.preferences || {},
      theme: profile?.theme || 'dark',
      created_at: profile?.created_at || authUser.created_at,
      updated_at: profile?.updated_at || authUser.updated_at
    }

    res.json(user)
  } catch (error) {
    console.error('Verify error:', error)
    res.status(403).json({ error: 'Authentication failed' })
  }
})

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  
  if (error) {
    res.status(error.status || 500).json({ error: error.message })
    return
  }

  res.json({ message: 'If an account exists with that email, a reset link will be sent.' })
})

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    res.status(error.status || 500).json({ error: error.message })
    return
  }

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
      console.error('Profile update error:', error)
      res.status(500).json({ error: 'Failed to update profile' })
      return
    }

    res.json({
      id: profile.id,
      email: req.user!.email,
      name: profile.nickname || profile.full_name,
      avatar_url: profile.avatar_url,
      preferences: profile.preferences,
      theme: profile.theme,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    })
  } catch (error) {
    console.error('Profile patch error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
