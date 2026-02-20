/**
 * Projects API routes
 * Handle project CRUD operations and SWOT analysis entries
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { projectsService } from '../services/projectsService'
import { createProjectSchema, updateProjectSchema, swotCreateSchema, swotUpdateSchema } from '@/shared/schemas/project'

const router = Router()

/**
 * Helper function to determine error status code and message
 */
function handleError(error: unknown, defaultCode: string, defaultMessage: string): { status: number; response: { error: string; code: string; details?: string } } {
  // Handle custom Error objects from service layer
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // Not found errors
    if (message.includes('not found') || message.includes('access denied')) {
      return {
        status: 404,
        response: { error: error.message || 'Resource not found', code: 'NOT_FOUND' }
      }
    }

    // Validation/business logic errors
    if (message.includes('invalid') || message.includes('required') || message.includes('must')) {
      return {
        status: 400,
        response: { error: error.message || 'Invalid request', code: 'VALIDATION_ERROR' }
      }
    }

    // Log unexpected errors for debugging
    console.error('[Projects] Unexpected error:', error)
    if (error.stack) console.error(error.stack)

    return {
      status: 500,
      response: { error: defaultMessage, code: defaultCode }
    }
  }

  // Unknown error types
  console.error('[Projects] Unknown error type:', error)
  return {
    status: 500,
    response: { error: defaultMessage, code: defaultCode }
  }
}

/**
 * List all projects for the authenticated user
 * GET /api/projects
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await projectsService.list(req.user!.id, req.query)
    res.json(data)
  } catch (error) {
    const { status, response } = handleError(error, 'PROJECTS_FETCH_FAILED', 'Failed to fetch projects')
    res.status(status).json(response)
  }
})

/**
 * Create a new project
 * POST /api/projects
 */
router.post('/', validate(createProjectSchema), authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await projectsService.create(req.user!.id, req.body)
    res.status(201).json(data)
  } catch (error) {
    const { status, response } = handleError(error, 'PROJECT_CREATE_FAILED', 'Failed to create project')
    res.status(status).json(response)
  }
})

/**
 * Update an existing project
 * PUT /api/projects/:id
 */
router.put('/:id', validate(updateProjectSchema), authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await projectsService.update(req.user!.id, req.params.id, req.body)
    if (!data) {
      res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' })
      return
    }
    res.json(data)
  } catch (error) {
    const { status, response } = handleError(error, 'PROJECT_UPDATE_FAILED', 'Failed to update project')
    res.status(status).json(response)
  }
})

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ok = await projectsService.remove(req.user!.id, req.params.id)
    if (!ok) {
      res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' })
      return
    }
    res.json({ success: true })
  } catch (error) {
    const { status, response } = handleError(error, 'PROJECT_DELETE_FAILED', 'Failed to delete project')
    res.status(status).json(response)
  }
})

/**
 * List SWOT entries for a project
 * GET /api/projects/:id/swot
 */
router.get('/:id/swot', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await projectsService.listSwot(req.user!.id, req.params.id)
    res.json(data)
  } catch (error) {
    const { status, response } = handleError(error, 'SWOT_FETCH_FAILED', 'Failed to fetch SWOT entries')
    res.status(status).json(response)
  }
})

/**
 * Add a SWOT entry to a project
 * POST /api/projects/:id/swot
 */
router.post('/:id/swot', validate(swotCreateSchema), authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await projectsService.addSwot(req.user!.id, req.params.id, req.body)
    res.status(201).json(data)
  } catch (error) {
    const { status, response } = handleError(error, 'SWOT_CREATE_FAILED', 'Failed to add SWOT entry')
    res.status(status).json(response)
  }
})

/**
 * Update a SWOT entry
 * PUT /api/projects/swot/:swotId
 */
router.put('/swot/:swotId', validate(swotUpdateSchema), authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await projectsService.updateSwot(req.user!.id, req.params.swotId, req.body)
    if (!data) {
      res.status(404).json({ error: 'SWOT entry not found', code: 'SWOT_NOT_FOUND' })
      return
    }
    res.json(data)
  } catch (error) {
    const { status, response } = handleError(error, 'SWOT_UPDATE_FAILED', 'Failed to update SWOT entry')
    res.status(status).json(response)
  }
})

/**
 * Delete a SWOT entry
 * DELETE /api/projects/swot/:swotId
 */
router.delete('/swot/:swotId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ok = await projectsService.removeSwot(req.user!.id, req.params.swotId)
    if (!ok) {
      res.status(404).json({ error: 'SWOT entry not found', code: 'SWOT_NOT_FOUND' })
      return
    }
    res.json({ success: true })
  } catch (error) {
    const { status, response } = handleError(error, 'SWOT_DELETE_FAILED', 'Failed to delete SWOT entry')
    res.status(status).json(response)
  }
})

export default router
