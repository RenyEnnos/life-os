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
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'JWT_SECRET not configured' })

    const decoded = jwt.verify(token, secret) as JwtPayload & { userId: string }

    // Bypass DB check in test environment if we have a mock user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((process.env.NODE_ENV === 'test' || process.env.VITEST) && (global as any).mockUser) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.user = (global as any).mockUser;
        return next();
    }

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
