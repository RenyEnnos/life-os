import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ok, fail } from '../response';
import { getAILogs } from './cache';
import * as aiService from './service';

interface AuthenticatedRequest extends Request {
  authUserId?: string;
}

const SESSION_SECRET = process.env.LIFEOS_SESSION_SECRET || process.env.JWT_SECRET || '';

function authenticate(req: AuthenticatedRequest, res: Response): boolean {
  const authHeader = req.header('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : req.cookies?.lifeos_session;

  if (!token) {
    fail(res, 'Authentication required', 401);
    return false;
  }

  try {
    const claims = jwt.verify(token, SESSION_SECRET) as jwt.JwtPayload & { sub: string };
    req.authUserId = claims.sub;
    return true;
  } catch {
    fail(res, 'Authentication required', 401);
    return false;
  }
}

export function createAiRouter(): Router {
  const router = Router();

  // POST /api/ai/chat
  const chatSchema = z.object({
    message: z.string().min(1),
    context: z.string().optional(),
  });

  router.post('/chat', async (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    try {
      const result = await aiService.chat(req.authUserId!, parsed.data.message, parsed.data.context);
      ok(res, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'AI chat failed';
      fail(res, msg, 500);
    }
  });

  // POST /api/ai/tags
  const tagsSchema = z.object({
    context: z.string().min(1),
    type: z.enum(['habit', 'task', 'journal', 'finance']),
  });

  router.post('/tags', async (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = tagsSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    try {
      const result = await aiService.generateTags(req.authUserId!, parsed.data.context, parsed.data.type);
      ok(res, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Tag generation failed';
      fail(res, msg, 500);
    }
  });

  // POST /api/ai/swot
  const swotSchema = z.object({ context: z.string().min(1) });

  router.post('/swot', async (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = swotSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    try {
      const result = await aiService.generateSwot(req.authUserId!, parsed.data.context);
      ok(res, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'SWOT generation failed';
      fail(res, msg, 500);
    }
  });

  // POST /api/ai/plan
  const planSchema = z.object({ context: z.string().min(1) });

  router.post('/plan', async (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = planSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    try {
      const result = await aiService.generatePlan(req.authUserId!, parsed.data.context);
      ok(res, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Plan generation failed';
      fail(res, msg, 500);
    }
  });

  // POST /api/ai/summary
  const summarySchema = z.object({ context: z.string().min(1) });

  router.post('/summary', async (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = summarySchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    try {
      const result = await aiService.generateSummary(req.authUserId!, parsed.data.context);
      ok(res, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Summary generation failed';
      fail(res, msg, 500);
    }
  });

  // GET /api/ai/logs
  router.get('/logs', (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const logs = getAILogs(req.authUserId!);
    ok(res, logs);
  });

  // POST /api/ai/parse-task
  const parseTaskSchema = z.object({ input: z.string().min(1) });

  router.post('/parse-task', async (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = parseTaskSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    try {
      const result = await aiService.parseTask(req.authUserId!, parsed.data.input);
      ok(res, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Task parsing failed';
      fail(res, msg, 500);
    }
  });

  // POST /api/ai/parse-entity
  const parseEntitySchema = z.object({ input: z.string().min(1) });

  router.post('/parse-entity', async (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = parseEntitySchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    try {
      const result = await aiService.parseEntity(req.authUserId!, parsed.data.input);
      ok(res, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Entity parsing failed';
      fail(res, msg, 500);
    }
  });

  return router;
}
