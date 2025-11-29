import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { supabase } from '../lib/supabase'

const router = Router()

router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase.from('users').select('id, email, name, preferences, theme, created_at, updated_at').eq('id', req.user!.id).single()
  if (error || !data) return res.status(404).json({ error: 'User not found' })
  res.json(data)
})

router.put('/preferences', authenticateToken, async (req: AuthRequest, res: Response) => {
  const preferences = req.body || {}
  const { data, error } = await supabase.from('users').update({ preferences }).eq('id', req.user!.id).select('id, email, name, preferences, theme, created_at, updated_at').single()
  if (error || !data) return res.status(500).json({ error: 'Failed to update preferences' })
  res.json(data)
})

export default router
