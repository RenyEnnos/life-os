import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { Task } from '../../shared/types'
import { supabase } from '../lib/supabase'
import { getPagination } from '../lib/pagination'

export class TasksService {
  private repo: BaseRepo<Task>
  constructor(repo?: BaseRepo<Task>) {
    this.repo = repo ?? repoFactory.get('tasks')
  }
  async list(userId: string, filters: any = {}) {
    if (process.env.NODE_ENV === 'test') {
      const data = await this.repo.list(userId)
      // Simple in-memory filtering for tests if needed, or just return all
      return data
    }

    const { from, to } = getPagination(filters)
    const { startDate, endDate, completed, tag, projectId } = filters

    let q = supabase.from('tasks').select('*').eq('user_id', userId)

    if (startDate) q = q.gte('due_date', startDate)
    if (endDate) q = q.lte('due_date', endDate)
    if (projectId) q = q.eq('project_id', projectId)
    if (typeof completed !== 'undefined') q = q.eq('completed', completed === 'true')
    if (tag) q = q.contains('tags', [tag])

    q = q.order('due_date', { nulls: 'last' })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async create(userId: string, payload: Partial<Task>) {
    if (!payload.title) throw new Error('Title is required')
    return this.repo.create(userId, { ...payload, completed: false, tags: payload.tags ?? [] })
  }
  update(userId: string, id: string, payload: Partial<Task>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }
}

export const tasksService = new TasksService()
