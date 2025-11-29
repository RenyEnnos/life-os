import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { Task } from '../../shared/types'

export class TasksService {
  private repo: BaseRepo<Task>
  constructor(repo?: BaseRepo<Task>) {
    this.repo = repo ?? repoFactory.get('tasks')
  }
  list(userId: string) { return this.repo.list(userId) }
  async create(userId: string, payload: Partial<Task>) {
    if (!payload.title) throw new Error('Title is required')
    return this.repo.create(userId, { ...payload, completed: false, tags: payload.tags ?? [] })
  }
  update(userId: string, id: string, payload: Partial<Task>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }
}

export const tasksService = new TasksService()
