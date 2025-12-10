import 'dotenv/config'
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import * as Sentry from "@sentry/node";
import authRoutes from './routes/auth'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}
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
import resonanceRoutes from './routes/resonance'

// for esm mode

import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

const app: express.Application = express()

if (process.env.NODE_ENV === 'production') {
  // Sentry SDK v8+ initialization
}

// trust proxy to capture correct client IP behind reverse proxies
app.set('trust proxy', true)

// Security Headers
app.use(helmet())

// trust proxy to capture correct client IP behind reverse proxies
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000').split(',')
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(cookieParser())

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply rate limiting to all requests
app.use(limiter)

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
app.use('/api/resonance', resonanceRoutes)
import contextRoutes from './routes/context'
app.use('/api/context', contextRoutes)
import mediaRoutes from './routes/media'
app.use('/api/media', mediaRoutes)



/**
 * error handler middleware
 */
if (process.env.NODE_ENV === 'production') {
  // Sentry.setupExpressErrorHandler(app); // specific setup if needed
}
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error);
  }
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
