import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { supabase } from '../lib/supabase'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for mock mode first
    if (process.env.AI_TEST_MODE === 'mock') {
        req.user = {
            id: 'test-user',
            email: 'test@example.com',
            name: 'Test User'
        }
        return next()
    }

    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'JWT_SECRET not configured' })

    const decoded = jwt.verify(token, secret) as JwtPayload & { userId: string }
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid token' })
  }
}
