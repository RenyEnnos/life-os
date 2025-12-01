import 'dotenv/config'
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import habitsRoutes from './routes/habits'
import tasksRoutes from './routes/tasks'
import financesRoutes from './routes/finances'
import healthRoutes from './routes/health'
import aiRoutes from './routes/ai'
import rewardsRoutes from './routes/rewards'
import exportRoutes from './routes/export'
import journalRoutes from './routes/journal'
import devRoutes from './routes/dev'
import dbRoutes from './routes/db'
import realtimeRoutes from './routes/realtime'
import projectsRoutes from './routes/projects'

// for esm mode

const app: express.Application = express()

// trust proxy to capture correct client IP behind reverse proxies
app.set('trust proxy', true)
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/finances', financesRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/rewards', rewardsRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/journal', journalRoutes)
app.use('/api/dev', devRoutes)
app.use('/api/db', dbRoutes)
app.use('/api/realtime', realtimeRoutes)
app.use('/api/projects', projectsRoutes)



/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  void next
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
