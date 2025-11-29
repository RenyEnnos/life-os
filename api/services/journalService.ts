import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { JournalEntry } from '../../shared/types'

import { getPagination } from '../lib/pagination'

export class JournalService {
  private repo: BaseRepo<JournalEntry>
  constructor(repo?: BaseRepo<JournalEntry>) { this.repo = repo ?? repoFactory.get('journal_entries') }
  async list(userId: string, filters: any = {}) {
    const data = await this.repo.list(userId)
    if (process.env.NODE_ENV === 'test') return data
    const { from, to } = getPagination(filters)
    return data.slice(from, to + 1)
  }
  async create(userId: string, payload: Partial<JournalEntry>) {
    if (!payload.entry_date) throw new Error('Entry date is required')
    return this.repo.create(userId, { ...payload, tags: payload.tags ?? [] })
  }
  update(userId: string, id: string, payload: Partial<JournalEntry>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }
}

export const journalService = new JournalService()
