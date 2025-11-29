import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { Transaction } from '../../shared/types'

export class FinanceService {
  private repo: BaseRepo<Transaction>
  constructor(repo?: BaseRepo<Transaction>) { this.repo = repo ?? repoFactory.get('transactions') }
  list(userId: string) { return this.repo.list(userId) }
  async create(userId: string, payload: Partial<Transaction>) {
    if (!payload.type || payload.amount == null || !payload.transaction_date || !payload.description) {
      throw new Error('type, amount, transaction_date, description are required')
    }
    return this.repo.create(userId, { ...payload, tags: payload.tags ?? [] })
  }
  update(userId: string, id: string, payload: Partial<Transaction>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }
  async summary(userId: string) {
    const list = await this.list(userId)
    let income = 0, expense = 0
    for (const t of list) {
      if (t.type === 'income') income += Number(t.amount)
      else expense += Number(t.amount)
    }
    return { income, expense, balance: income - expense }
  }
}

export const financeService = new FinanceService()
