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
  http.get('/api/journal', ({ request }) => {
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

    const total = allEntries.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedEntries = allEntries.slice(startIndex, endIndex)

    // Return paginated response
    return HttpResponse.json({
      data: paginatedEntries,
      total,
      page,
      pageSize,
      totalPages
    })
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
