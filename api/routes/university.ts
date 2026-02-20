/**
 * University API routes
 * Handle courses and assignments for university tracking
 */
import { Router, type Response } from 'express'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { universityService } from '../services/universityService'

const router = Router()

// ==================== COURSES ====================

/**
 * List all courses
 * GET /api/university/courses
 */
router.get('/courses', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courses = await universityService.listCourses(req.user!.id)
    res.json(courses)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to list courses'
    res.status(500).json({ error: msg, code: 'COURSES_LIST_ERROR' })
  }
})

/**
 * Create a course
 * POST /api/university/courses
 */
router.post('/courses', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, professor, schedule, color, semester, grade, credits } = req.body

  if (!name) {
    res.status(400).json({ error: 'name is required', code: 'MISSING_COURSE_NAME' })
    return
  }

  try {
    const course = await universityService.createCourse(req.user!.id, {
      name,
      professor,
      schedule,
      color,
      semester,
      grade,
      credits
    })
    res.status(201).json(course)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create course'
    res.status(500).json({ error: msg, code: 'COURSE_CREATE_ERROR' })
  }
})

/**
 * Update a course
 * PUT /api/university/courses/:id
 */
router.put('/courses/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await universityService.updateCourse(req.user!.id, req.params.id, req.body)
    res.json(course)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update course'
    res.status(500).json({ error: msg, code: 'COURSE_UPDATE_ERROR' })
  }
})

/**
 * Delete a course
 * DELETE /api/university/courses/:id
 */
router.delete('/courses/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await universityService.deleteCourse(req.user!.id, req.params.id)
    res.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete course'
    res.status(500).json({ error: msg, code: 'COURSE_DELETE_ERROR' })
  }
})

// ==================== ASSIGNMENTS ====================

/**
 * List all assignments
 * GET /api/university/assignments
 * Query params: courseId (optional)
 */
router.get('/assignments', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courseId = req.query.courseId as string | undefined
    const assignments = await universityService.listAssignments(req.user!.id, courseId)
    res.json(assignments)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to list assignments'
    res.status(500).json({ error: msg, code: 'ASSIGNMENTS_LIST_ERROR' })
  }
})

/**
 * Create an assignment
 * POST /api/university/assignments
 */
router.post('/assignments', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { course_id, title, description, type, due_date, status, weight, grade, completed } = req.body

  if (!course_id || !title) {
    res.status(400).json({ error: 'course_id and title are required', code: 'MISSING_ASSIGNMENT_FIELDS' })
    return
  }

  try {
    const assignment = await universityService.createAssignment(req.user!.id, {
      course_id,
      title,
      description,
      type: type || 'homework',
      due_date,
      status: status || 'todo',
      weight,
      grade,
      completed: completed || false
    })
    res.status(201).json(assignment)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create assignment'
    res.status(500).json({ error: msg, code: 'ASSIGNMENT_CREATE_ERROR' })
  }
})

/**
 * Update an assignment
 * PUT /api/university/assignments/:id
 */
router.put('/assignments/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignment = await universityService.updateAssignment(req.user!.id, req.params.id, req.body)
    res.json(assignment)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update assignment'
    res.status(500).json({ error: msg, code: 'ASSIGNMENT_UPDATE_ERROR' })
  }
})

/**
 * Toggle assignment completion
 * PATCH /api/university/assignments/:id/toggle
 */
router.patch('/assignments/:id/toggle', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignment = await universityService.toggleAssignmentComplete(req.user!.id, req.params.id)
    res.json(assignment)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to toggle assignment'
    res.status(500).json({ error: msg, code: 'ASSIGNMENT_TOGGLE_ERROR' })
  }
})

/**
 * Delete an assignment
 * DELETE /api/university/assignments/:id
 */
router.delete('/assignments/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await universityService.deleteAssignment(req.user!.id, req.params.id)
    res.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to delete assignment'
    res.status(500).json({ error: msg, code: 'ASSIGNMENT_DELETE_ERROR' })
  }
})

export default router
