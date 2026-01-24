import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { universityService } from '../services/universityService'

const router = Router()

// ==================== COURSES ====================

/**
 * List all courses
 * GET /api/university/courses
 */
router.get('/courses', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const courses = await universityService.listCourses(req.user!.id)
        res.json(courses)
    } catch (err) {
        console.error('[University] List courses error:', err)
        res.status(500).json({ error: 'Failed to list courses' })
    }
})

/**
 * Create a course
 * POST /api/university/courses
 */
router.post('/courses', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { name, professor, schedule, color, semester, grade, credits } = req.body

        if (!name) {
            return res.status(400).json({ error: 'name is required' })
        }

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
    } catch (err) {
        console.error('[University] Create course error:', err)
        res.status(500).json({ error: 'Failed to create course' })
    }
})

/**
 * Update a course
 * PUT /api/university/courses/:id
 */
router.put('/courses/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const course = await universityService.updateCourse(req.user!.id, req.params.id, req.body)
        res.json(course)
    } catch (err) {
        console.error('[University] Update course error:', err)
        res.status(500).json({ error: 'Failed to update course' })
    }
})

/**
 * Delete a course
 * DELETE /api/university/courses/:id
 */
router.delete('/courses/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        await universityService.deleteCourse(req.user!.id, req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('[University] Delete course error:', err)
        res.status(500).json({ error: 'Failed to delete course' })
    }
})

// ==================== ASSIGNMENTS ====================

/**
 * List all assignments
 * GET /api/university/assignments
 * Query params: courseId (optional)
 */
router.get('/assignments', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const courseId = req.query.courseId as string | undefined
        const assignments = await universityService.listAssignments(req.user!.id, courseId)
        res.json(assignments)
    } catch (err) {
        console.error('[University] List assignments error:', err)
        res.status(500).json({ error: 'Failed to list assignments' })
    }
})

/**
 * Create an assignment
 * POST /api/university/assignments
 */
router.post('/assignments', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { course_id, title, description, type, due_date, status, weight, grade, completed } = req.body

        if (!course_id || !title) {
            return res.status(400).json({ error: 'course_id and title are required' })
        }

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
    } catch (err) {
        console.error('[University] Create assignment error:', err)
        res.status(500).json({ error: 'Failed to create assignment' })
    }
})

/**
 * Update an assignment
 * PUT /api/university/assignments/:id
 */
router.put('/assignments/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const assignment = await universityService.updateAssignment(req.user!.id, req.params.id, req.body)
        res.json(assignment)
    } catch (err) {
        console.error('[University] Update assignment error:', err)
        res.status(500).json({ error: 'Failed to update assignment' })
    }
})

/**
 * Toggle assignment completion
 * PATCH /api/university/assignments/:id/toggle
 */
router.patch('/assignments/:id/toggle', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const assignment = await universityService.toggleAssignmentComplete(req.user!.id, req.params.id)
        res.json(assignment)
    } catch (err) {
        console.error('[University] Toggle assignment error:', err)
        res.status(500).json({ error: 'Failed to toggle assignment' })
    }
})

/**
 * Delete an assignment
 * DELETE /api/university/assignments/:id
 */
router.delete('/assignments/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        await universityService.deleteAssignment(req.user!.id, req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('[University] Delete assignment error:', err)
        res.status(500).json({ error: 'Failed to delete assignment' })
    }
})

export default router
