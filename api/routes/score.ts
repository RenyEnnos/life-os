import { Router, type Response } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { scoreService } from '../services/scoreService'

const router = Router()

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const data = await scoreService.compute(req.user!.id)
  res.json(data)
})

export default router
