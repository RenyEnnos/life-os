import path from 'node:path';

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
import { resolveMvpRepositoryMode } from './mvpRepositoryMode';
import { PrismaBackedMvpRepository } from './prismaMvpRepository';
import {
  actionItemIdSchema,
  actionUpdateRequestSchema,
  dailyCheckInRequestSchema,
  emptyRequestSchema,
  feedbackRequestSchema,
  loginRequestSchema,
  onboardingRequestSchema,
  planIdSchema,
  profileRequestSchema,
  reflectionRequestSchema,
  registerRequestSchema,
  resetCommitRequestSchema,
  resetPreparationRequestSchema,
  weeklyReviewRequestSchema,
  workspaceRecoveryRequestSchema,
  personalDataExportRequestSchema,
  accountDeletionRequestSchema,
} from './requestSchemas';
import {
  digestWorkspaceExport,
} from './workspaceRecovery';

type AuthRepository = InstanceType<typeof FileBackedAuthRepository>;

export interface CreateAppOptions {
  staticDir?: string;
}

const SESSION_COOKIE = 'lifeos_session';
const SESSION_SECRET: string = process.env.LIFEOS_SESSION_SECRET || process.env.JWT_SECRET || '';
if (!SESSION_SECRET) {
  throw new Error('LIFEOS_SESSION_SECRET or JWT_SECRET environment variable must be set');
}
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

interface SessionClaims {
  sub: string;
  email: string;
  sv: number;
}

interface WorkspaceResetClaims {
  sub: string;
  kind: 'workspace-reset';
  digest: string;
}

interface AuthenticatedRequest extends express.Request {
  authUser?: StoredUser;
  authSource?: 'bearer' | 'cookie';
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
  return jwt.sign({ email: user.email, sv: user.sessionVersion }, SESSION_SECRET, {
    subject: user.id,
    expiresIn: SESSION_TTL_SECONDS,
  });
}

async function resolveAuthenticatedUser(req: express.Request, authRepository: AuthRepository) {
  const session = extractSession(req);
  if (!session) return null;

  const claims = jwt.verify(session.token, SESSION_SECRET) as jwt.JwtPayload & SessionClaims;
  const user = await authRepository.findUserById(claims.sub);
  if (!user || claims.sv !== user.sessionVersion) return null;
  return { user, source: session.source };
}

function extractSession(req: express.Request) {
  const authHeader = req.header('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return { token: authHeader.slice('Bearer '.length).trim(), source: 'bearer' as const };
  }

  const cookieToken = req.cookies?.[SESSION_COOKIE];
  return typeof cookieToken === 'string' ? { token: cookieToken, source: 'cookie' as const } : null;
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

function isConfiguredAdministrator(email: string) {
  const configuredEmails = (process.env.LIFEOS_ADMIN_EMAILS ?? '')
    .split(',')
    .map((candidate) => candidate.trim().toLowerCase())
    .filter((candidate) => z.string().email().safeParse(candidate).success);

  return configuredEmails.includes(email.trim().toLowerCase());
}

function parseRequest<T>(schema: z.ZodType<T>, value: unknown, res: express.Response): T | null {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    fail(res, 'Validation failed', 400);
    return null;
  }
  return parsed.data;
}

function parseEmptyRequest(req: express.Request, res: express.Response) {
  const declaresBody = req.header('transfer-encoding') !== undefined
    || Number(req.header('content-length') ?? '0') > 0;
  if (req.body === undefined && declaresBody) {
    fail(res, 'Validation failed', 400);
    return null;
  }
  return parseRequest(emptyRequestSchema, req.body ?? {}, res);
}

export function createApp(
  repository: MvpRepository = createDefaultMvpRepository(),
  authRepository: AuthRepository = new FileBackedAuthRepository(),
  options: CreateAppOptions = {}
) {
  const app = express();
  app.set('trust proxy', false);
  const reconcilePendingDeletions = async () => {
    const userIds = await authRepository.listPendingDeletionUserIds();
    await Promise.allSettled(userIds.map(async (userId) => {
      await repository.deleteUserData(userId);
      await authRepository.finalizeAccountDeletion(userId);
    }));
  };
  const schedulePendingDeletionReconciliation = () => {
    void reconcilePendingDeletions().catch(() => console.error('Pending account deletion inventory failed'));
  };
  schedulePendingDeletionReconciliation();

  const ALLOWED_ORIGINS = process.env.LIFEOS_OPERATING_MODE === 'controlled-demo'
    ? [process.env.ALLOWED_ORIGIN].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:3001', process.env.ALLOWED_ORIGIN].filter(Boolean);

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
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { upgradeInsecureRequests: null },
      },
    })
  );
  app.use(cookieParser());
  const ordinaryJsonParser = express.json({ limit: '32kb', strict: true });
  const portableWorkspaceJsonParser = express.json({ limit: '10mb', strict: true });
  app.use((req, res, next) => {
    const portableWorkspacePath = req.path === '/api/mvp/workspace/reset'
      || req.path === '/api/mvp/workspace/recovery';
    return portableWorkspacePath ? next() : ordinaryJsonParser(req, res, next);
  });

  app.get('/api/health', (_req, res) => {
    ok(res, { status: 'ok' });
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
  });

  const authenticatedWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    keyGenerator: (req) => (req as AuthenticatedRequest).authUser!.id,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => ['GET', 'HEAD', 'OPTIONS'].includes(req.method),
  });

  const planGenerationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    keyGenerator: (req) => (req as AuthenticatedRequest).authUser!.id,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const destructiveResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => (req as AuthenticatedRequest).authUser!.id,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const recoveryLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => (req as AuthenticatedRequest).authUser!.id,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const requireAuthentication = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    try {
      const session = await resolveAuthenticatedUser(req, authRepository);
      if (!session) return fail(res, 'Authentication required', 401);
      req.authUser = session.user;
      req.authSource = session.source;
      return next();
    } catch {
      return fail(res, 'Authentication required', 401);
    }
  };

  const requireCookieWriteOrigin = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || req.authSource === 'bearer') return next();
    const origin = req.header('origin');
    return origin && ALLOWED_ORIGINS.includes(origin)
      ? next()
      : fail(res, 'Origin verification failed', 403);
  };

  app.post('/api/auth/register', authLimiter, async (req, res, next) => {
    try {
      const parsed = parseRequest(registerRequestSchema, req.body, res);
      if (!parsed) return;
      const { email, password, name, inviteCode } = parsed;

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
      const parsed = parseRequest(loginRequestSchema, req.body, res);
      if (!parsed) return;
      const { email, password } = parsed;

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
      const session = await resolveAuthenticatedUser(req, authRepository);
      if (!session) {
        return fail(res, 'Authentication required', 401);
      }

      return res.json(serializeUser(session.user));
    } catch {
      return fail(res, 'Authentication required', 401);
    }
  });

  app.post('/api/auth/logout', requireAuthentication, requireCookieWriteOrigin, authenticatedWriteLimiter, async (req: AuthenticatedRequest, res, next) => {
    try {
      const body = parseEmptyRequest(req, res);
      if (!body) return;
      await authRepository.revokeSessions(req.authUser!.id);
      clearSessionCookie(res);
      return ok(res, { message: 'Logged out' });
    } catch (error) {
      return next(error);
    }
  });

  app.patch('/api/auth/profile', requireAuthentication, requireCookieWriteOrigin, authenticatedWriteLimiter, async (req: AuthenticatedRequest, res) => {
    try {
      const patch = parseRequest(profileRequestSchema, req.body, res);
      if (!patch) return;
      const user = await authRepository.updateUser(req.authUser!.id, {
        fullName: patch.name,
        theme: patch.theme,
      });

      return res.json({ user: serializeUser(user) });
    } catch {
      return fail(res, 'Authentication required', 401);
    }
  });

  app.post('/api/auth/data-export', requireAuthentication, requireCookieWriteOrigin, destructiveResetLimiter, async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(personalDataExportRequestSchema, req.body, res);
      if (!input) return;
      const user = req.authUser!;
      if (!(await bcrypt.compare(input.password, user.passwordHash))) {
        return fail(res, 'Password reauthentication failed', 401);
      }
      const [workspace, recoveries] = await Promise.all([
        repository.exportWorkspace(user.id),
        repository.listRecoveries(user.id),
      ]);
      return ok(res, {
        format: 'lifeos.account.export',
        version: 1,
        exportedAt: new Date().toISOString(),
        account: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          theme: user.theme,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        workspace,
        recoveries,
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/auth/delete-account', requireAuthentication, requireCookieWriteOrigin, destructiveResetLimiter, async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(accountDeletionRequestSchema, req.body, res);
      if (!input) return;
      const user = req.authUser!;
      if (!(await bcrypt.compare(input.password, user.passwordHash))) {
        return fail(res, 'Password reauthentication failed', 401);
      }
      await authRepository.beginAccountDeletion(user.id);
      try {
        await repository.deleteUserData(user.id);
      } catch (error) {
        await authRepository.cancelAccountDeletion(user.id);
        throw error;
      }
      clearSessionCookie(res);
      try {
        await authRepository.finalizeAccountDeletion(user.id);
        return ok(res, { deleted: true, status: 'completed', processors: 'disabled' });
      } catch {
        schedulePendingDeletionReconciliation();
        return res.status(202).json({
          success: true,
          data: { deleted: true, status: 'pending', processors: 'disabled' },
        });
      }
    } catch (error) {
      return next(error);
    }
  });

  app.use('/api/mvp', requireAuthentication, requireCookieWriteOrigin, authenticatedWriteLimiter);

  app.get('/api/mvp/workspace', async (req: AuthenticatedRequest, res, next) => {
    try {
      await repository.ensureUser(req.authUser!);
      ok(res, await repository.getWorkspace(req.authUser!.id));
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/mvp/admin/overview', async (req: AuthenticatedRequest, res, next) => {
    if (!isConfiguredAdministrator(req.authUser!.email)) {
      return fail(res, 'Administrator access required', 403);
    }

    try {
      await repository.ensureUser(req.authUser!);
      const workspace = await repository.getWorkspace(req.authUser!.id);
      const { analytics, events, feedback } = workspace;
      return ok(res, { analytics, events, feedback });
    } catch (error) {
      return next(error);
    }
  });

  app.put('/api/mvp/onboarding', async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(onboardingRequestSchema, req.body, res);
      if (!input) return;
      await repository.ensureUser(req.authUser!);
      const snapshot = await repository.saveOnboarding(req.authUser!.id, input);
      await authRepository.updateUser(req.authUser!.id, { onboardingCompleted: true });
      ok(res, snapshot);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/weekly-plans/generate', planGenerationLimiter, async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(weeklyReviewRequestSchema, req.body, res);
      if (!input) return;
      await repository.ensureUser(req.authUser!);
      ok(res, await repository.generatePlan(req.authUser!.id, input));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/weekly-plans/:planId/confirm', async (req: AuthenticatedRequest, res, next) => {
    try {
      const planId = parseRequest(planIdSchema, req.params.planId, res);
      const body = parseEmptyRequest(req, res);
      if (!planId || !body) return;
      await repository.ensureUser(req.authUser!);
      ok(res, await repository.confirmPlan(req.authUser!.id, planId));
    } catch (error) {
      next(error);
    }
  });

  app.patch('/api/mvp/action-items/:actionItemId', async (req: AuthenticatedRequest, res, next) => {
    try {
      const actionItemId = parseRequest(actionItemIdSchema, req.params.actionItemId, res);
      const patch = parseRequest(actionUpdateRequestSchema, req.body, res);
      if (!actionItemId || !patch) return;
      await repository.ensureUser(req.authUser!);
      ok(res, await repository.updateActionItem(req.authUser!.id, actionItemId, patch));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/daily-checkins', async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(dailyCheckInRequestSchema, req.body, res);
      if (!input) return;
      await repository.ensureUser(req.authUser!);
      ok(res, await repository.saveDailyCheckIn(req.authUser!.id, input));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/reflections', async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(reflectionRequestSchema, req.body, res);
      if (!input) return;
      await repository.ensureUser(req.authUser!);
      ok(res, await repository.addReflection(req.authUser!.id, input));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/feedback', async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(feedbackRequestSchema, req.body, res);
      if (!input) return;
      await repository.ensureUser(req.authUser!);
      ok(res, await repository.submitFeedback(req.authUser!.id, input));
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/mvp/workspace/reset/export', destructiveResetLimiter, async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(resetPreparationRequestSchema, req.body, res);
      if (!input) return;
      if (!(await bcrypt.compare(input.password, req.authUser!.passwordHash))) {
        return fail(res, 'Password reauthentication failed', 401);
      }
      await repository.ensureUser(req.authUser!);
      const portableExport = await repository.exportWorkspace(req.authUser!.id);
      const resetToken = jwt.sign({
        kind: 'workspace-reset',
        digest: digestWorkspaceExport(portableExport),
      }, SESSION_SECRET, { subject: req.authUser!.id, expiresIn: 10 * 60 });
      return ok(res, { export: portableExport, resetToken });
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/mvp/workspace/reset', destructiveResetLimiter, portableWorkspaceJsonParser, async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(resetCommitRequestSchema, req.body, res);
      if (!input) return;
      if (!(await bcrypt.compare(input.password, req.authUser!.passwordHash))) {
        return fail(res, 'Password reauthentication failed', 401);
      }
      const claims = jwt.verify(input.resetToken, SESSION_SECRET) as jwt.JwtPayload & WorkspaceResetClaims;
      if (claims.sub !== req.authUser!.id || claims.kind !== 'workspace-reset') {
        return fail(res, 'Invalid reset authorization', 401);
      }
      if (claims.digest !== digestWorkspaceExport(input.export)) {
        return fail(res, 'Invalid reset authorization', 401);
      }
      await repository.ensureUser(req.authUser!);
      return ok(res, await repository.resetWorkspace(req.authUser!.id, input.export));
    } catch (error) {
      if (error instanceof Error && error.message === 'Workspace changed after export') {
        return fail(res, error.message, 409);
      }
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        return fail(res, 'Invalid reset authorization', 401);
      }
      return next(error);
    }
  });

  app.get('/api/mvp/workspace/recovery/latest', async (req: AuthenticatedRequest, res, next) => {
    try {
      await repository.ensureUser(req.authUser!);
      const recovery = await repository.getLatestRecovery(req.authUser!.id);
      return recovery ? ok(res, recovery) : fail(res, 'No workspace recovery available', 404);
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/mvp/workspace/recovery', recoveryLimiter, portableWorkspaceJsonParser, async (req: AuthenticatedRequest, res, next) => {
    try {
      const input = parseRequest(workspaceRecoveryRequestSchema, req.body, res);
      if (!input) return;
      if (!(await bcrypt.compare(input.password, req.authUser!.passwordHash))) {
        return fail(res, 'Password reauthentication failed', 401);
      }
      await repository.ensureUser(req.authUser!);
      return ok(res, await repository.restoreWorkspace(req.authUser!.id, input.export));
    } catch (error) {
      return next(error);
    }
  });

  if (options.staticDir) {
    app.use(express.static(options.staticDir));
    app.get(/.*/, (req, res, next) => {
      let requestPath: string;
      try {
        requestPath = decodeURIComponent(req.path).toLowerCase();
      } catch {
        return next();
      }
      if (
        requestPath === '/api' ||
        requestPath.startsWith('/api/') ||
        path.extname(requestPath)
      ) {
        return next();
      }

      return res.sendFile(path.join(options.staticDir!, 'index.html'));
    });
  }

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const bodyError = error as { status?: number; type?: string };
    if (bodyError.status === 413 || bodyError.type === 'entity.too.large') {
      return fail(res, 'Payload too large', 413);
    }
    if (bodyError.status === 400 || bodyError.type === 'entity.parse.failed') {
      return fail(res, 'Malformed JSON', 400);
    }
    if (error instanceof Error && error.message === 'Not allowed by CORS') {
      return fail(res, 'Origin verification failed', 403);
    }
    console.error('MVP API request failed');
    const message = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (error instanceof Error ? error.message : 'Internal server error');
    fail(res, message, 500);
  });

  return app;
}

function createDefaultMvpRepository(): MvpRepository {
  return resolveMvpRepositoryMode(process.env) === 'prisma'
    ? new PrismaBackedMvpRepository()
    : new FileBackedMvpRepository();
}
