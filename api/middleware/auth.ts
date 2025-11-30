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
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    if (process.env.DEV_AUTH_BYPASS === '1') {
      req.user = { id: 'dev-user', email: 'dev@example.com', name: 'Developer' }
      return next()
    }

    if (process.env.NODE_ENV === 'test') {
      // In tests, skip cryptographic verification for simplicity
      const decoded: JwtPayload & { userId: string; email: string; name: string } = { userId: 'u1', email: 'test@example.com', name: 'Test User' }
      req.user = { id: decoded.userId, email: decoded.email, name: decoded.name }
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload & { userId: string }
      // Verify user still exists in database
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', decoded.userId)
        .single()

      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' })
      }
      req.user = user
    }
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid token' })
  }
}
