import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { Habit } from '../../shared/types'

export class HabitsService {
  private repo: BaseRepo<Habit>
  constructor(repo?: BaseRepo<Habit>) {
    this.repo = repo ?? repoFactory.get('habits')
  }
  list(userId: string) { return this.repo.list(userId) }
  async create(userId: string, payload: Partial<Habit>) {
    if (!payload.title) throw new Error('Title is required')
    const schedule = payload.schedule ?? { frequency: 'daily' }
    const type = payload.type ?? 'binary'
    const goal = payload.goal ?? 1
    return this.repo.create(userId, { ...payload, schedule, type, goal, active: true })
  }
  update(userId: string, id: string, payload: Partial<Habit>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }
}

export const habitsService = new HabitsService()
