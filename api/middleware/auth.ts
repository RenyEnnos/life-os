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

    // Fetch additional user data from our 'users' table if needed
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('id', authUser.id)
      .single();

    if (userError || !user) {
      // If user exists in Auth but not in our table, we might need to create them or just return auth data
      req.user = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0]
      };
    } else {
      req.user = user;
    }

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(403).json({ error: 'Authentication failed' });
  }
};
