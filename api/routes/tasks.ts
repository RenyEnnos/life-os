import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { tasksService } from '../services/tasksService'
import { calendarService } from '../services/calendarService'

const router = Router()

// List tasks for authenticated user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const data = await tasksService.list(userId, req.query)
    res.json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(400).json({ error: msg })
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
