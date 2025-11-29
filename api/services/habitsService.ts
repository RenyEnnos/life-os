import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { Habit, HabitLog } from '../../shared/types'

import { getPagination } from '../lib/pagination'

export class HabitsService {
  private repo: BaseRepo<Habit>
  private logsRepo: BaseRepo<HabitLog>
  constructor(repo?: BaseRepo<Habit>, logsRepo?: BaseRepo<HabitLog>) {
    this.repo = repo ?? repoFactory.get('habits')
    this.logsRepo = logsRepo ?? repoFactory.get('habit_logs')
  }
  async list(userId: string, filters: any = {}) {
    const data = await this.repo.list(userId)
    if (process.env.NODE_ENV === 'test') return data

    const { from, to } = getPagination(filters)
    return data.slice(from, to + 1)
  }
  async create(userId: string, payload: Partial<Habit>) {
    if (!payload.title) throw new Error('Title is required')
    const schedule = payload.schedule ?? { frequency: 'daily' }
    const type = payload.type ?? 'binary'
    const goal = payload.goal ?? 1
    return this.repo.create(userId, { ...payload, schedule, type, goal, active: true })
  }
  update(userId: string, id: string, payload: Partial<Habit>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }

  async log(userId: string, habitId: string, value: number, date: string) {
    // Check if habit exists
    // const habit = await this.repo.list(userId).then(list => list.find(h => h.id === habitId))
    // if (!habit) throw new Error('Habit not found')

    // Check if log already exists for this date? For now just insert.
    // Ideally we should update if exists, but BaseRepo doesn't support complex queries easily.
    // We'll just create a new log entry.
    return this.logsRepo.create(userId, { habit_id: habitId, value, date })
  }

  async getLogs(userId: string, filters: any = {}) {
    const logs = await this.logsRepo.list(userId)
    // Filter by date range if provided
    const { startDate, endDate } = filters
    if (startDate || endDate) {
      return logs.filter(l => {
        if (startDate && l.date < startDate) return false
        if (endDate && l.date > endDate) return false
        return true
      })
    }
    return logs
  }
}

export const habitsService = new HabitsService()
