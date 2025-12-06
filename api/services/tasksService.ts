import { repoFactory } from '../repositories/factory'
import type { BaseRepo } from '../repositories/factory'
import { rewardsService } from './rewardsService'

type Task = { id: string; user_id: string; title: string; description?: string; due_date?: string; completed?: boolean; tags?: string[] }

class TasksServiceImpl {
  private repo: BaseRepo<Task>
  constructor() {
    this.repo = repoFactory.get<Task>('tasks')
  }
  async list(userId: string, query: unknown) { void query; return this.repo.list(userId) }
  async create(userId: string, payload: Partial<Task>) {
    if (!payload?.title) throw new Error('Title is required')
    return this.repo.create(userId, { ...payload, completed: false, tags: payload.tags ?? [] })
  }
  async update(userId: string, id: string, payload: Partial<Task>) {
    const updated = await this.repo.update(userId, id, payload)

    // Check if task was just completed
    if (payload.completed === true) {
      try {
        // Award XP for completing a task
        await rewardsService.addXp(userId, 50) // 50 XP per task

        // Check for "First Step" achievement
        await rewardsService.checkAndUnlockAchievement(userId, 'FIRST_STEP')
      } catch (error) {
        console.error('Failed to award rewards for task completion:', error)
        // Don't fail the task update if rewards fail
      }
    }

    return updated
  }
  async remove(userId: string, id: string) {
    // Soft delete implementation
    return this.repo.update(userId, id, { deleted_at: new Date().toISOString() } as any)
  }
}

export const tasksService = new TasksServiceImpl()
