import { Request, Response, NextFunction } from 'express'
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
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Use Supabase to verify the token and get the user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch additional user data from our 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, nickname')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      // If profile doesn't exist yet, fallback to auth data
      req.user = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0]
      };
    } else {
      req.user = {
        id: profile.id,
        email: authUser.email!,
        name: profile.nickname || profile.full_name || authUser.user_metadata?.full_name || authUser.email!.split('@')[0]
      };
    }

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(403).json({ error: 'Authentication failed' });
  }
};
