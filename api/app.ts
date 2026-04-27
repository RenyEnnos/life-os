import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

import { ok, fail } from './response';

import { FileBackedAuthRepository, type StoredUser } from './authRepository';
import { FileBackedMvpRepository } from './mvpRepository';
import type { MvpRepository } from './mvpRepository.types';
import { PrismaBackedMvpRepository } from './prismaMvpRepository';

type AuthRepository = InstanceType<typeof FileBackedAuthRepository>;

const SESSION_COOKIE = 'lifeos_session';
const SESSION_SECRET: string = process.env.LIFEOS_SESSION_SECRET || process.env.JWT_SECRET || '';
if (!SESSION_SECRET) {
  throw new Error('LIFEOS_SESSION_SECRET or JWT_SECRET environment variable must be set');
}
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

interface SessionClaims {
  sub: string;
  email: string;
}

interface AuthenticatedRequest extends express.Request {
  authUser?: StoredUser;
}

function serializeUser(user: StoredUser) {
  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.fullName,
      nickname: user.fullName,
      invite_code: user.inviteCode,
      is_invited_partner: true,
      theme: user.theme,
      onboarding_completed: user.onboardingCompleted,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    },
  };
}

function issueSessionToken(user: StoredUser) {
  return jwt.sign({ email: user.email }, SESSION_SECRET, {
    subject: user.id,
    expiresIn: SESSION_TTL_SECONDS,
  });
}

function extractSessionToken(req: express.Request) {
  const authHeader = req.header('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  const cookieToken = req.cookies?.[SESSION_COOKIE];
  return typeof cookieToken === 'string' ? cookieToken : null;
}

function setSessionCookie(res: express.Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS * 1000,
  });
}

function clearSessionCookie(res: express.Response) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export function createApp(
  repository: MvpRepository = createDefaultMvpRepository(),
  authRepository: AuthRepository = new FileBackedAuthRepository()
) {
  const app = express();

  const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3001',
    process.env.ALLOWED_ORIGIN,
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    ok(res, { status: 'ok' });
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    inviteCode: z.string().min(1),
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  app.post('/api/auth/register', authLimiter, async (req, res, next) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, 'Validation failed');
      }
      const { email, password, name, inviteCode } = parsed.data;

      const user = await authRepository.registerWithInvite({
        email,
        passwordHash: await bcrypt.hash(password, 10),
        fullName: name,
        inviteCode,
      });
      const token = issueSessionToken(user);
      setSessionCookie(res, token);
      return res.status(201).json({ token, user: serializeUser(user) });
    } catch (error) {
      if (error instanceof Error && /Invite|registered/i.test(error.message)) {
        return fail(res, error.message);
      }
      next(error);
    }
  });

  app.post('/api/auth/login', authLimiter, async (req, res, next) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return fail(res, 'Validation failed');
      }
      const { email, password } = parsed.data;

      const user = await authRepository.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return fail(res, 'Invalid login credentials', 401);
      }

      const token = issueSessionToken(user);
      setSessionCookie(res, token);
      return res.json({ token, user: serializeUser(user) });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/auth/verify', async (req, res) => {
    try {
      const token = extractSessionToken(req);
      if (!token) {
        return fail(res, 'Authentication required', 401);
      }

      const claims = jwt.verify(token, SESSION_SECRET) as jwt.JwtPayload & SessionClaims;
      const user = await authRepository.findUserById(claims.sub);
      if (!user) {
        return fail(res, 'Authentication required', 401);
      }

      return res.json(serializeUser(user));
    } catch {
      return fail(res, 'Authentication required', 401);
    }
  });

  app.post('/api/auth/logout', (_req, res) => {
    clearSessionCookie(res);
    return ok(res, { message: 'Logged out' });
  });

  app.patch('/api/auth/profile', async (req, res) => {
    try {
      const token = extractSessionToken(req);
      if (!token) {
        return fail(res, 'Authentication required', 401);
      }

      const claims = jwt.verify(token, SESSION_SECRET) as jwt.JwtPayload & SessionClaims;
      const user = await authRepository.updateUser(claims.sub, {
        fullName: typeof req.body?.name === 'string' ? req.body.name : undefined,
        theme: req.body?.theme === 'light' || req.body?.theme === 'dark' ? req.body.theme : undefined,
      });

      return res.json({ user: serializeUser(user) });
    } catch {
      return fail(res, 'Authentication required', 401);
    }
  });

  app.use('/api/mvp', async (req: AuthenticatedRequest, res, next) => {
    try {
      const token = extractSessionToken(req);
      if (!token) {
        return fail(res, 'Authentication required', 401);
      }

      const claims = jwt.verify(token, SESSION_SECRET) as jwt.JwtPayload & SessionClaims;
      const user = await authRepository.findUserById(claims.sub);
      if (!user) {
        return fail(res, 'Authentication required', 401);
      }

      await repository.ensureUser(user);
      req.authUser = user;
      return next();
    } catch {
      return fail(res, 'Authentication required', 401);
    }
  });

  app.get('/api/mvp/workspace', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.getWorkspace(req.authUser!.id));
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/mvp/onboarding', async (req: AuthenticatedRequest, res, next) => {
    try {
      const snapshot = await repository.saveOnboarding(req.authUser!.id, req.body);
      await authRepository.updateUser(req.authUser!.id, { onboardingCompleted: true });
      ok(res, snapshot);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/weekly-plans/generate', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.generatePlan(req.authUser!.id, req.body));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/weekly-plans/:planId/confirm', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.confirmPlan(req.authUser!.id, String(req.params.planId)));
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/mvp/action-items/:actionItemId', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.updateActionItem(req.authUser!.id, String(req.params.actionItemId), req.body));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/daily-checkins', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.saveDailyCheckIn(req.authUser!.id, req.body));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/reflections', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.addReflection(req.authUser!.id, req.body));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/feedback', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.submitFeedback(req.authUser!.id, req.body));
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/mvp/workspace', async (req: AuthenticatedRequest, res, next) => {
    try {
      ok(res, await repository.resetWorkspace(req.authUser!.id));
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('MVP API error:', error);
    const message = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (error instanceof Error ? error.message : 'Internal server error');
    fail(res, message, 500);
  });

  return app;
}

function createDefaultMvpRepository(): MvpRepository {
  const wantsPrisma =
    process.env.LIFEOS_MVP_REPOSITORY === 'prisma' ||
    (typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim().length > 0);

  return wantsPrisma ? new PrismaBackedMvpRepository() : new FileBackedMvpRepository();
}
