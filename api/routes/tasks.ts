/**
 * Tasks API routes
 * Handle task CRUD operations, filtering, and calendar integration
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { tasksService } from '../services/tasksService'
import { calendarService } from '../services/calendarService'
import { createTaskSchema, updateTaskSchema } from '@/shared/schemas/task'

const router = Router()

/**
 * List tasks for authenticated user
 * GET /api/tasks
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const data = await tasksService.list(userId, req.query)
    res.json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: msg, code: 'TASKS_FETCH_FAILED' })
  }
})

/**
 * Get task summary counts
 * GET /api/tasks/summary
 */
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const tasks = await tasksService.list(userId, req.query)
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const today = new Date().toISOString().split('T')[0]
    const dueToday = tasks.filter((t) => typeof t.due_date === 'string' && t.due_date.startsWith(today)).length
    res.json({ total, completed, dueToday })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: msg, code: 'TASKS_SUMMARY_FAILED' })
  }
})

/**
 * Create a new task
 * POST /api/tasks
 */
router.post('/', authenticateToken, validate(createTaskSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  try {
    const data = await tasksService.create(userId, req.body)
    // Calendar sync (best effort)
    try {
      if (data.due_date) {
        const client = await calendarService.getCalendarClient(userId)
        await client.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: data.title,
            description: data.description,
            start: { dateTime: data.due_date },
            end: { dateTime: data.due_date },
          }
        })
      }
    } catch {
      // noop: falha de sincronização de calendário não deve bloquear criação
    }
    res.status(201).json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: msg, code: 'TASK_CREATE_FAILED' })
  }
})

/**
 * Update an existing task
 * PUT /api/tasks/:id
 */
router.put('/:id', authenticateToken, validate(updateTaskSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { id } = req.params
  try {
    const data = await tasksService.update(userId, id, req.body)
    if (!data) {
      res.status(404).json({ error: 'Task not found or update failed', code: 'TASK_NOT_FOUND' })
      return
    }
    res.json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: msg, code: 'TASK_UPDATE_FAILED' })
  }
})

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id
  const { id } = req.params
  try {
    const ok = await tasksService.remove(userId, id)
    if (!ok) {
      res.status(404).json({ error: 'Task not found or delete failed', code: 'TASK_NOT_FOUND' })
      return
    }
    res.json({ success: true })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: msg, code: 'TASK_DELETE_FAILED' })
  }
})

export default router
