import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import * as Sentry from "@sentry/node";
import authRoutes from './routes/auth'
import dashboardRoutes from './routes/dashboard'

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
import budgetRoutes from './routes/budgets'
import onboardingRoutes from './routes/onboarding'
import contextRoutes from './routes/context'
import mediaRoutes from './routes/media'
import financeCategoriesRoutes from './routes/financeCategories'
import universityRoutes from './routes/university'

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
const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

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

// --- Rate Limiting Configuration ---

// Global limiter: 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 10000 : 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth limiter: 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 10000 : 5,
  message: { error: 'Too many authentication attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Password reset limiter: 5 requests per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDevOrTest ? 10000 : 5,
  message: { error: 'Too many password reset attempts, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
})

// AI limiter: 50 requests per hour
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDevOrTest ? 10000 : 50,
  message: { error: 'Daily AI usage limit reached (IP-based). Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply global rate limiting to all requests
app.use(globalLimiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */

// Apply strict limiters to sensitive auth routes BEFORE the general auth routes
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth/forgot-password', passwordResetLimiter)
app.use('/api/auth/reset-password', passwordResetLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/finances', financesRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/ai', aiLimiter, aiRoutes)
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
app.use('/api/context', contextRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/finance-categories', financeCategoriesRoutes)
app.use('/api/university', universityRoutes)
app.use('/api/onboarding', onboardingRoutes)

/**
 * error handler middleware
 */
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

// Error handler (must be after all routes)
app.use(errorHandler)

// 404 handler (must be last)
app.use(notFoundHandler)

// Initialize Active Intelligence
import { activeSymbiosis } from './services/activeSymbiosis'
activeSymbiosis.init()

export default app
