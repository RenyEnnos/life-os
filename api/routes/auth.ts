/**
 * User authentication API routes
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase'
import { LoginRequest, RegisterRequest, AuthResponse } from '../../shared/types'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * User Registration
 * POST /api/auth/register
 */
router.post('/register', async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' })
      return
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' })
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
      res.status(500).json({ error: 'Failed to create user' })
      return
    }

    // Generate JWT token
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

    res.status(201).json(response)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Generate JWT token
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

    res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
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

    const decoded = jwt.verify(token, JWT_SECRET) as any

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
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' })
  }
})

export default router
