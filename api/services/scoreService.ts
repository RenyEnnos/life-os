import { supabase } from '../lib/supabase'

export class ScoreService {
  async compute(userId: string) {
    const [tasks, habits, metrics, txs] = await Promise.all([
      supabase.from('tasks').select('completed, due_date').eq('user_id', userId),
      supabase.from('habits').select('id').eq('user_id', userId),
      supabase.from('health_metrics').select('metric_type, value, recorded_date').eq('user_id', userId),
      supabase.from('transactions').select('id').eq('user_id', userId)
    ])
    const t = tasks.data ?? []
    const h = habits.data ?? []
    const m = metrics.data ?? []
    const f = txs.data ?? []
    const today = new Date().toISOString().slice(0, 10)
    const completedToday = t.filter((x: any) => x.completed && (x.due_date?.slice(0, 10) === today)).length
    const overdue = t.filter((x: any) => !x.completed && x.due_date && x.due_date < new Date().toISOString()).length
    const taskScore = Math.max(0, Math.min(100, 70 + completedToday * 5 - overdue * 10))
    const habitScore = Math.min(100, h.length * 5)
    const stepsAvg = avgMetric(m, 'steps', 7)
    const healthScore = Math.min(100, Math.round((stepsAvg / 8000) * 100))
    const financeScore = Math.min(100, f.length ? 80 : 40)
    const total = Math.round((taskScore * 0.35 + habitScore * 0.25 + healthScore * 0.2 + financeScore * 0.2))
    const trend = total > 66 ? 'up' : total < 33 ? 'down' : 'stable'
    const statusText = trend === 'up' ? 'Melhorando' : trend === 'down' ? 'Piorando' : 'Estável'
    return { score: total, trend, statusText }
  }
}

function avgMetric(metrics: any[], type: string, days: number) {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days)
  const arr = metrics.filter(x => x.metric_type === type && new Date(x.recorded_date) >= cutoff).map(x => Number(x.value) || 0)
  if (!arr.length) return 0
  return arr.reduce((a: number, b: number) => a + b, 0) / arr.length
}

export const scoreService = new ScoreService()
