import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { tasksService } from '../services/tasksService'
import { calendarService } from '../services/calendarService'
import { z } from 'zod'

const router = Router()

// List tasks for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const data = await tasksService.list(userId, req.query)
    const { due_today } = req.query as Record<string, string>
    if (due_today === 'true') {
      const today = new Date().toISOString().split('T')[0]
      const filtered = data.filter((t: any) => typeof t.due_date === 'string' && t.due_date.startsWith(today))
      res.json(filtered)
      return
    }
    res.json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

// Summary (counts)
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const tasks = await tasksService.list(userId, req.query)
  const total = tasks.length
  const completed = tasks.filter((t: any) => t.completed).length
  const today = new Date().toISOString().split('T')[0]
  const dueToday = tasks.filter((t: any) => typeof t.due_date === 'string' && t.due_date.startsWith(today)).length
  res.json({ total, completed, dueToday })
})

// Create task
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const schema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      due_date: z.string().datetime().optional(),
      tags: z.array(z.string()).optional()
    })
    const parsed = schema.safeParse(req.body || {})
    if (!parsed.success) { res.status(400).json({ error: 'Invalid task payload' }); return }
    const data = await tasksService.create(userId, parsed.data)
    // Calendar sync (best effort)
    try {
      if (data.due_date) {
        const client = await calendarService.getCalendarClient(userId)
        await client.events.insert({ calendarId: 'primary', requestBody: { summary: data.title, description: data.description, start: { dateTime: data.due_date }, end: { dateTime: data.due_date }, } })
      }
    } catch {
      // noop: falha de sincronização de calendário não deve bloquear criação
    }
    res.status(201).json(data)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    res.status(400).json({ error: msg })
  }
})

// Update task
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { id } = req.params
  const schema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    due_date: z.string().datetime().optional(),
    completed: z.boolean().optional(),
    tags: z.array(z.string()).optional()
  })
  const parsed = schema.safeParse(req.body || {})
  if (!parsed.success) { res.status(400).json({ error: 'Invalid task payload' }); return }
  const payload = parsed.data
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
