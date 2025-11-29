import { Router, type Request, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { tasksService } from '../services/tasksService'
import { supabase } from '../lib/supabase'
import { getPagination } from '../lib/pagination'
import { calendarService } from '../services/calendarService'

const router = Router()

// List tasks for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { from, to } = getPagination(req.query)
  const { startDate, endDate, completed, tag, projectId } = req.query as any
  if (process.env.NODE_ENV === 'test') {
    const data = await tasksService.list(userId)
    res.json(data.slice(from, to + 1))
  } else {
    let q = supabase.from('tasks').select('*').eq('user_id', userId)
    if (startDate) q = q.gte('due_date', startDate)
    if (endDate) q = q.lte('due_date', endDate)
    if (projectId) q = q.eq('project_id', projectId)
    if (typeof completed !== 'undefined') q = q.eq('completed', completed === 'true')
    if (tag) q = q.contains('tags', [tag])
    q = q.order('due_date', { nulls: 'last' }).order('created_at', { ascending: false }).range(from, to)
    const { data, error } = await q
    if (error) { res.status(400).json({ error: error.message }); return }
    res.json(data ?? [])
  }
})

// Create task
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const data = await tasksService.create(userId, req.body || {})
    // Calendar sync (best effort)
    try {
      if (data.due_date) {
        const client = await calendarService.getCalendarClient(userId)
        await client.events.insert({ calendarId: 'primary', requestBody: { summary: data.title, description: data.description, start: { dateTime: data.due_date }, end: { dateTime: data.due_date }, } })
      }
    } catch {}
    res.status(201).json(data)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

// Update task
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { id } = req.params
  const payload = req.body || {}
  const data = await tasksService.update(userId, id, payload)
  if (!data) {
    res.status(404).json({ error: 'Task not found or update failed' })
    return
  }
  res.json(data)
})

// Delete task
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { id } = req.params
  const ok = await tasksService.remove(userId, id)
  if (!ok) {
    res.status(404).json({ error: 'Task not found or delete failed' })
    return
  }
  res.json({ success: true })
})

export default router
