import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/rewards/score', () => {
    return HttpResponse.json({ life_score: 120, level: 3, current_xp: 2500 })
  }),
  http.get('/api/rewards/achievements', () => {
    return HttpResponse.json([{ id: 'a1', title: 'Starter', description: 'Primeira conquista', xp_reward: 50, icon: 'default' }])
  }),
]
