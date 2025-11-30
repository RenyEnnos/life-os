import { repoFactory } from '../repositories/factory'
import type { BaseRepo } from '../repositories/factory'

type Task = { id: string; user_id: string; title: string; description?: string; due_date?: string; completed?: boolean; tags?: string[] }

class TasksServiceImpl {
  private repo: BaseRepo<Task>
  constructor() {
    this.repo = repoFactory.get('tasks')
  }
  async list(userId: string, query: any) { return this.repo.list(userId) }
  async create(userId: string, payload: any) {
    if (!payload?.title) throw new Error('Title is required')
    return this.repo.create(userId, { ...payload, completed: false, tags: payload.tags ?? [] })
  }
  async update(userId: string, id: string, payload: any) { return this.repo.update(userId, id, payload) }
  async remove(userId: string, id: string) { return this.repo.remove(userId, id) }
}

export const tasksService = new TasksServiceImpl()
