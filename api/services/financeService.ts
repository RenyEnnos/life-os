import { repoFactory } from '../repositories/factory'
import type { BaseRepo } from '../repositories/factory'

type Transaction = { id: string; user_id: string; type: 'income' | 'expense'; amount: number; description: string; transaction_date: string; tags?: string[]; category?: string }

class FinanceServiceImpl {
  private repo: BaseRepo<Transaction>
  constructor() { this.repo = repoFactory.get<Transaction>('transactions') }
  async list(userId: string, query: unknown) { void query; return this.repo.list(userId) }
  async create(userId: string, payload: Partial<Transaction>) { return this.repo.create(userId, payload) }
  async update(userId: string, id: string, payload: Partial<Transaction>) { return this.repo.update(userId, id, payload) }
  async remove(userId: string, id: string) { return this.repo.update(userId, id, { deleted_at: new Date().toISOString() } as any) }
  async summary(userId: string) {
    const list = await this.list(userId, {})
    const income = list.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expenses = list.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    const byCategory = list
      .filter(t => t.type === 'expense')
      .reduce((acc: Record<string, number>, t) => { const cat = t.category || 'Outros'; acc[cat] = (acc[cat] || 0) + Number(t.amount); return acc }, {})
    return { income, expenses, balance: income - expenses, byCategory }
  }
}

export const financeService = new FinanceServiceImpl()
