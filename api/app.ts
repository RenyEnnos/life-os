/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import habitsRoutes from './routes/habits.js'
import journalRoutes from './routes/journal.js'
import healthRoutes from './routes/health.js'
import financeRoutes from './routes/finance.js'
import projectsRoutes from './routes/projects.js'
import rewardsRoutes from './routes/rewards.js'
import aiRoutes from './routes/ai.js'
import calendarRoutes from './routes/calendar.js'
import exportRoutes from './routes/export.js'
import scoreRoutes from './routes/score.js'
import devRoutes from './routes/dev.js'
import logger from './lib/logger.js'
import tasksRoutes from './routes/tasks.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, 'request')
  next()
})

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api/journal', journalRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/rewards', rewardsRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/score', scoreRoutes)
app.use('/api/dev', devRoutes)
app.use('/api/tasks', tasksRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err: error, url: req.url }, 'server error')
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
