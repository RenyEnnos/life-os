import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ok, fail } from '../response';

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

// In-memory feedback store
const feedbackStore: Array<{
  id: string;
  userId: string;
  suggestionId: string;
  action: 'accepted' | 'dismissed';
  source?: string;
  createdAt: string;
}> = [];

export function createSynapseRouter(): Router {
  const router = Router();

  // GET /api/synapse/suggestions
  router.get('/suggestions', (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;

    // Heuristic-based suggestions (no AI call needed for MVP)
    const suggestions = [
      {
        id: 'sug-1',
        title: 'Review your weekly goals',
        rationale: 'You have not reviewed your goals this week yet.',
        action_label: 'Start Review',
        source: 'heuristic' as const,
      },
      {
        id: 'sug-2',
        title: 'Check your habit streaks',
        rationale: 'Consistency is key to building lasting habits.',
        action_label: 'View Habits',
        source: 'heuristic' as const,
      },
      {
        id: 'sug-3',
        title: 'Log today\'s energy level',
        rationale: 'Tracking energy helps optimize your schedule.',
        action_label: 'Log Now',
        source: 'heuristic' as const,
      },
    ];

    ok(res, { suggestions });
  });

  // POST /api/synapse/feedback
  const feedbackSchema = z.object({
    suggestionId: z.string().min(1),
    action: z.enum(['accepted', 'dismissed']),
    source: z.string().optional(),
  });

  router.post('/feedback', (req: AuthenticatedRequest, res: Response) => {
    if (!authenticate(req, res)) return;
    const parsed = feedbackSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 'Validation failed');

    feedbackStore.push({
      id: crypto.randomUUID(),
      userId: req.authUserId!,
      suggestionId: parsed.data.suggestionId,
      action: parsed.data.action,
      source: parsed.data.source,
      createdAt: new Date().toISOString(),
    });

    ok(res, { success: true });
  });

  return router;
}
