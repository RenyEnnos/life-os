import { repoFactory, type BaseRepo } from '../repositories/factory'

export interface Reward {
  id: string
  user_id: string
  title: string
  description?: string
  criteria: Record<string, any>
  points_required: number
  achieved: boolean
  achieved_at?: string
  created_at: string
}

export class RewardsService {
  private repo: BaseRepo<Reward>
  constructor(repo?: BaseRepo<Reward>) { this.repo = repo ?? repoFactory.get('rewards') }
  list(userId: string) { return this.repo.list(userId) }
  async create(userId: string, payload: Partial<Reward>) {
    if (!payload.title || payload.points_required == null) throw new Error('title and points_required are required')
    return this.repo.create(userId, { ...payload, criteria: payload.criteria ?? {}, achieved: false })
  }
  update(userId: string, id: string, payload: Partial<Reward>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }
}

export const rewardsService = new RewardsService()
