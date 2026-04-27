import { http, HttpResponse } from 'msw'

import { generateWeeklyPlan } from '@/features/mvp/lib/plan'
import { createEmptyWorkspace, makeMvpId, pushMvpEvent, withComputedAnalytics } from '@/features/mvp/lib/state'
import type { MvpDailyCheckIn, MvpOnboardingDraft, MvpReviewDraft } from '@/features/mvp/types'

let mvpWorkspace = createEmptyWorkspace()

export function resetMockMvpWorkspace() {
  mvpWorkspace = createEmptyWorkspace()
}

function respondWithWorkspace() {
  mvpWorkspace = withComputedAnalytics({
    onboarding: mvpWorkspace.onboarding,
    review: mvpWorkspace.review,
    plan: mvpWorkspace.plan,
    dailyCheckIns: mvpWorkspace.dailyCheckIns,
    reflections: mvpWorkspace.reflections,
    feedback: mvpWorkspace.feedback,
    events: mvpWorkspace.events,
  })
  return HttpResponse.json({ success: true, data: mvpWorkspace })
}

export const handlers = [
  http.get('*/api/mvp/workspace', () => respondWithWorkspace()),
  http.put('*/api/mvp/onboarding', async ({ request }) => {
    const input = (await request.json()) as Omit<MvpOnboardingDraft, 'completedAt'>
    const completedAt = new Date().toISOString()
    if (!mvpWorkspace.onboarding.completedAt) {
      mvpWorkspace.events = pushMvpEvent(mvpWorkspace.events, 'onboarding_started', completedAt)
    }
    mvpWorkspace.events = pushMvpEvent(mvpWorkspace.events, 'onboarding_completed', completedAt)
    mvpWorkspace.onboarding = { ...input, completedAt }
    return respondWithWorkspace()
  }),
  http.post('*/api/mvp/weekly-plans/generate', async ({ request }) => {
    const input = (await request.json()) as Omit<MvpReviewDraft, 'generatedAt' | 'id'>
    const generatedAt = new Date().toISOString()
    const review: MvpReviewDraft = { ...input, id: makeMvpId('review'), generatedAt }
    mvpWorkspace.review = review
    mvpWorkspace.plan = {
      ...generateWeeklyPlan(mvpWorkspace.onboarding, review, new Date(generatedAt)),
      id: makeMvpId('plan'),
    }
    mvpWorkspace.events = pushMvpEvent(
      pushMvpEvent(
        pushMvpEvent(mvpWorkspace.events, 'weekly_review_started', generatedAt),
        'weekly_review_completed',
        generatedAt,
      ),
      'weekly_plan_generated',
      generatedAt,
    )
    return respondWithWorkspace()
  }),
  http.post('*/api/mvp/weekly-plans/:planId/confirm', ({ params }) => {
    if (mvpWorkspace.plan.id === params.planId) {
      const confirmedAt = new Date().toISOString()
      mvpWorkspace.plan = { ...mvpWorkspace.plan, confirmedAt }
      mvpWorkspace.events = pushMvpEvent(mvpWorkspace.events, 'weekly_plan_confirmed', confirmedAt)
    }
    return respondWithWorkspace()
  }),
  http.patch('*/api/mvp/action-items/:actionItemId', async ({ params, request }) => {
    const patch = (await request.json()) as { status?: 'todo' | 'done' | 'deferred'; note?: string }
    mvpWorkspace.plan = {
      ...mvpWorkspace.plan,
      priorities: mvpWorkspace.plan.priorities.map((priority) => ({
        ...priority,
        actions: priority.actions.map((action) =>
          action.id === params.actionItemId
            ? { ...action, status: patch.status ?? action.status, note: patch.note ?? action.note }
            : action,
        ),
      })),
    }
    return respondWithWorkspace()
  }),
  http.post('*/api/mvp/daily-checkins', async ({ request }) => {
    const input = (await request.json()) as Omit<MvpDailyCheckIn, 'createdAt'>
    const createdAt = new Date().toISOString()
    const nextEntry = { ...input, createdAt }
    const existingIndex = mvpWorkspace.dailyCheckIns.findIndex((entry) => entry.date === input.date)
    mvpWorkspace.dailyCheckIns =
      existingIndex >= 0
        ? mvpWorkspace.dailyCheckIns.map((entry, index) => (index === existingIndex ? nextEntry : entry))
        : [...mvpWorkspace.dailyCheckIns, nextEntry]
    mvpWorkspace.events = pushMvpEvent(mvpWorkspace.events, 'daily_checkin_completed', createdAt)
    return respondWithWorkspace()
  }),
  http.post('*/api/mvp/reflections', async ({ request }) => {
    const input = (await request.json()) as { period: 'daily' | 'weekly'; body: string }
    mvpWorkspace.reflections = [
      { id: makeMvpId('reflection'), createdAt: new Date().toISOString(), ...input },
      ...mvpWorkspace.reflections,
    ]
    mvpWorkspace.events = pushMvpEvent(mvpWorkspace.events, 'reflection_completed')
    return respondWithWorkspace()
  }),
  http.post('*/api/mvp/feedback', async ({ request }) => {
    const input = (await request.json()) as { rating: number; message: string }
    mvpWorkspace.feedback = [
      { id: makeMvpId('feedback'), createdAt: new Date().toISOString(), ...input },
      ...mvpWorkspace.feedback,
    ]
    mvpWorkspace.events = pushMvpEvent(mvpWorkspace.events, 'user_feedback_submitted')
    return respondWithWorkspace()
  }),
  http.delete('*/api/mvp/workspace', () => {
    mvpWorkspace = createEmptyWorkspace()
    return respondWithWorkspace()
  }),
  http.get('*/api/rewards/score', () => {
    return HttpResponse.json({ life_score: 120, level: 3, current_xp: 2500 })
  }),
  http.get('*/api/rewards/achievements', () => {
    return HttpResponse.json([{ id: 'a1', title: 'Starter', description: 'Primeira conquista', xp_reward: 50, icon: 'default' }])
  }),
  http.get('*/api/rewards/achievements/full', () => {
    return HttpResponse.json([
      {
        id: 'a1',
        title: 'Starter',
        description: 'Primeira conquista',
        xp_reward: 50,
        icon: 'default',
        unlocked: true,
        unlockedAt: '2025-01-01T12:00:00Z',
      },
      {
        id: 'a2',
        title: 'Consistent',
        description: 'Mantenha ritmo por 7 dias',
        xp_reward: 120,
        icon: 'default',
        unlocked: false,
        unlockedAt: null,
      },
    ])
  }),
  http.get('*/api/resonance/insights', () => {
    return HttpResponse.json([])
  }),
  http.get('/' + 'api/calendar/events', () => {
    return HttpResponse.json([
      { id: 'e1', summary: 'Meeting', start: { dateTime: '2025-01-01T10:00:00Z' }, location: 'Online' }
    ])
  }),
  http.get('/' + 'api/finances/summary', () => {
    return HttpResponse.json({ income: 1000, expenses: 400, balance: 600, byCategory: { Food: 200 } })
  }),
  http.get('/' + 'api/finances/transactions', () => {
    return HttpResponse.json([
      { id: 't1', description: 'Groceries', amount: 100, type: 'expense', category: 'Food', date: '2025-01-02' }
    ])
  }),
  http.get('/' + 'api/tasks', () => {
    return HttpResponse.json([])
  }),
  http.get('*/api/journal', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)

    // Mock journal entries for pagination testing
    const allEntries = [
      { id: 'j1', user_id: 'u1', entry_date: '2025-01-15', title: 'Morning Reflection', content: 'Starting the day with gratitude', tags: ['mindfulness'], created_at: '2025-01-15T08:00:00Z' },
      { id: 'j2', user_id: 'u1', entry_date: '2025-01-14', title: 'Project Ideas', content: 'Brainstorming new features', tags: ['work', 'ideas'], created_at: '2025-01-14T14:30:00Z' },
      { id: 'j3', user_id: 'u1', entry_date: '2025-01-13', title: 'Evening Walk', content: 'Peaceful sunset today', tags: ['personal'], created_at: '2025-01-13T18:00:00Z' },
      { id: 'j4', user_id: 'u1', entry_date: '2025-01-12', title: 'Team Meeting', content: 'Great progress on the sprint', tags: ['work'], created_at: '2025-01-12T10:00:00Z' },
      { id: 'j5', user_id: 'u1', entry_date: '2025-01-11', title: 'Reading Notes', content: 'Learned about React patterns', tags: ['learning'], created_at: '2025-01-11T20:00:00Z' },
      { id: 'j6', user_id: 'u1', entry_date: '2025-01-10', title: 'Gym Session', content: 'Personal best on deadlifts', tags: ['fitness'], created_at: '2025-01-10T07:00:00Z' },
      { id: 'j7', user_id: 'u1', entry_date: '2025-01-09', title: 'Code Review', content: 'Helped team with PR', tags: ['work'], created_at: '2025-01-09T15:00:00Z' },
      { id: 'j8', user_id: 'u1', entry_date: '2025-01-08', title: 'Meditation', content: '20 minutes of calm', tags: ['mindfulness'], created_at: '2025-01-08T06:30:00Z' },
      { id: 'j9', user_id: 'u1', entry_date: '2025-01-07', title: 'Weekend Planning', content: 'Organizing tasks for next week', tags: ['productivity'], created_at: '2025-01-07T19:00:00Z' },
      { id: 'j10', user_id: 'u1', entry_date: '2025-01-06', title: 'Morning Note', content: 'Feeling focused', tags: ['focus'], created_at: '2025-01-06T08:00:00Z' },
      { id: 'j11', user_id: 'u1', entry_date: '2025-01-05', title: 'Client Call', content: 'Requirements discussion', tags: ['work'], created_at: '2025-01-05T11:00:00Z' },
      { id: 'j12', user_id: 'u1', entry_date: '2025-01-04', title: 'Evening Reflection', content: 'Day went well', tags: ['personal'], created_at: '2025-01-04T21:00:00Z' },
      { id: 'j13', user_id: 'u1', entry_date: '2025-01-03', title: 'Lunch Break', content: 'Tried new restaurant', tags: ['food'], created_at: '2025-01-03T12:30:00Z' },
      { id: 'j14', user_id: 'u1', entry_date: '2025-01-02', title: 'New Year Goals', content: 'Setting intentions', tags: ['goals'], created_at: '2025-01-02T09:00:00Z' },
      { id: 'j15', user_id: 'u1', entry_date: '2025-01-01', title: 'Fresh Start', content: 'Ready for new beginnings', tags: ['motivation'], created_at: '2025-01-01T08:00:00Z' },
    ]

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedEntries = allEntries.slice(startIndex, endIndex)

    return HttpResponse.json(paginatedEntries)
  }),
  http.get('/' + 'api/habits', () => {
    return HttpResponse.json([
      { id: 'h1', name: 'Meditation', title: 'Meditation', user_id: 'u1', streak: 3 }
    ])
  }),
  http.get('/' + 'api/habits/logs', () => {
    const today = new Date().toISOString().split('T')[0]
    return HttpResponse.json([{ habit_id: 'h1', date: today, value: 1 }])
  }),
  http.get('/' + 'api/health', () => {
    return HttpResponse.json([{ id: 'm1', metric_type: 'sleep', value: 7.5 }])
  }),
  http.get('/' + 'api/health/medications', () => {
    return HttpResponse.json([{ id: 'm1', name: 'Omega-3', dosage: '1g', times: ['08:00'], active: true }])
  }),
  http.patch('/' + 'api/auth/profile', () => {
    return HttpResponse.json({ success: true })
  }),
]
