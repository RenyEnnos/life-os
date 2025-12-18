import { repoFactory, type BaseRepo } from '../repositories/factory'

export type SymbiosisLink = {
  id: string
  user_id: string
  task_id: string
  habit_id: string
  impact_vital: number
  custo_financeiro?: number
  notes?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

class SymbiosisServiceImpl {
  private repo: BaseRepo<SymbiosisLink>

  constructor() {
    this.repo = repoFactory.get<SymbiosisLink>('task_habit_links')
  }

  async list(userId: string) {
    return this.repo.list(userId)
  }

  async create(userId: string, payload: Partial<SymbiosisLink>) {
    this.validateImpact(payload.impact_vital)
    return this.repo.create(userId, payload)
  }

  async update(userId: string, id: string, payload: Partial<SymbiosisLink>) {
    if (payload.impact_vital !== undefined) {
      this.validateImpact(payload.impact_vital)
    }
    return this.repo.update(userId, id, payload)
  }

  async remove(userId: string, id: string) {
    return this.repo.remove(userId, id)
  }

  private validateImpact(value?: number) {
    if (value === undefined) return
    if (Number.isNaN(value) || value < -5 || value > 5) {
      throw new Error('impact_vital must be between -5 and 5')
    }
  }
}

export const symbiosisService = new SymbiosisServiceImpl()
