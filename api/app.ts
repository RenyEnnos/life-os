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
import calendarRoutes from './routes/calendar'
import symbiosisRoutes from './routes/symbiosis'
import synapseRoutes from './routes/synapse'

// for esm mode

import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

const app: express.Application = express()

if (process.env.NODE_ENV === 'production') {
  // Sentry SDK v8+ initialization
}

// trust first proxy (vercel/nginx) without allowing spoofed IP headers
app.set('trust proxy', 1)

// Security Headers
app.use(helmet())

const isProduction = process.env.NODE_ENV === 'production'

// CORS allowlist for common localhost/preview origins plus env overrides
const defaultOrigins = isProduction ? [] : [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173'
]
const loopbackOrigins = isProduction ? [] : [
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173'
]
const envOrigins = [
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean)
]
const allowedOrigins = new Set([
  ...defaultOrigins,
  ...loopbackOrigins,
  ...envOrigins
])

const isLocalhostLike = (origin?: string) => {
  if (!origin) return false
  try {
    const { hostname } = new URL(origin)
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true

    // Allow private network IPs for local dev (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    return (
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      (/^172\.(1[6-9]|2[0-9]|3[0-1])\./).test(hostname)
    )
  } catch {
    return false
  }
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin) || (!isProduction && isLocalhostLike(origin))) {
      return callback(null, true)
    }
    console.warn('Blocked CORS origin:', origin)
    callback(new Error('CORS_NOT_ALLOWED'))
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
app.use('/api/calendar', calendarRoutes)
app.use('/api/symbiosis', symbiosisRoutes)
app.use('/api/synapse', synapseRoutes)
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
  if (error?.message === 'CORS_NOT_ALLOWED' || error?.message === 'Not allowed by CORS') {
    res.status(403).json({
      success: false,
      error: 'CORS origin not allowed',
    })
    return
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
