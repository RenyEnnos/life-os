import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/rewards/score', () => {
    return HttpResponse.json({ life_score: 120, level: 3, current_xp: 2500 })
  }),
  http.get('/api/rewards/achievements', () => {
    return HttpResponse.json([{ id: 'a1', title: 'Starter', description: 'Primeira conquista', xp_reward: 50, icon: 'default' }])
  }),
  http.get('/api/calendar/events', () => {
    return HttpResponse.json([
      { id: 'e1', summary: 'Meeting', start: { dateTime: '2025-01-01T10:00:00Z' }, location: 'Online' }
    ])
  }),
  http.get('/api/finances/summary', () => {
    return HttpResponse.json({ income: 1000, expenses: 400, balance: 600, byCategory: { Food: 200 } })
  }),
  http.get('/api/finances/transactions', () => {
    return HttpResponse.json([
      { id: 't1', description: 'Groceries', amount: 100, type: 'expense', category: 'Food', date: '2025-01-02' }
    ])
  }),
  http.get('/api/tasks', () => {
    return HttpResponse.json([])
  }),
  http.get('/api/journal', () => {
    const today = new Date().toISOString().split('T')[0]
    return HttpResponse.json([
      { id: 'j1', entry_date: today, title: 'Morning Note', content: 'Feeling focused', tags: ['focus'] }
    ])
  }),
  http.get('/api/habits', () => {
    return HttpResponse.json([
      { id: 'h1', name: 'Meditation', title: 'Meditation', user_id: 'u1', streak: 3 }
    ])
  }),
  http.get('/api/habits/logs', () => {
    const today = new Date().toISOString().split('T')[0]
    return HttpResponse.json([{ habit_id: 'h1', date: today, value: 1 }])
  }),
  http.get('/api/health', () => {
    return HttpResponse.json([{ id: 'm1', metric_type: 'sleep', value: 7.5 }])
  }),
  http.get('/api/health/medications', () => {
    return HttpResponse.json([{ id: 'm1', name: 'Omega-3', dosage: '1g', times: ['08:00'], active: true }])
  }),
  http.patch('/api/auth/profile', () => {
    return HttpResponse.json({ success: true })
  }),
]
