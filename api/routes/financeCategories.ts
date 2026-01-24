import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { financeCategoryService } from '../services/financeCategoryService'

const router = Router()

/**
 * List all finance categories for the authenticated user
 * GET /api/finance-categories
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const categories = await financeCategoryService.list(req.user!.id)
        res.json(categories)
    } catch (err) {
        console.error('[FinanceCategories] List error:', err)
        res.status(500).json({ error: 'Failed to list categories' })
    }
})

/**
 * Create a new finance category
 * POST /api/finance-categories
 */
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { name, type, icon } = req.body

        if (!name || !type) {
            return res.status(400).json({ error: 'name and type are required' })
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'type must be income or expense' })
        }

        const category = await financeCategoryService.create(req.user!.id, { name, type, icon })
        res.status(201).json(category)
    } catch (err) {
        console.error('[FinanceCategories] Create error:', err)
        res.status(500).json({ error: 'Failed to create category' })
    }
})

/**
 * Delete a finance category
 * DELETE /api/finance-categories/:id
 */
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        await financeCategoryService.delete(req.user!.id, req.params.id)
        res.json({ success: true })
    } catch (err) {
        console.error('[FinanceCategories] Delete error:', err)
        res.status(500).json({ error: 'Failed to delete category' })
    }
})

export default router
