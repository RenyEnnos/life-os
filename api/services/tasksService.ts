import { supabase } from '../lib/supabase'
import { repoFactory } from '../repositories/factory'
import type { BaseRepo } from '../repositories/factory'
import { rewardsService } from './rewardsService'
import { invalidate } from './aiCache'

type Task = { id: string; user_id: string; title: string; description?: string; due_date?: string; completed?: boolean; tags?: string[]; position?: string }

class TasksServiceImpl {
  private repo: BaseRepo<Task>
  constructor() {
    this.repo = repoFactory.get<Task>('tasks')
  }
  async list(userId: string, query: { page?: string; pageSize?: string; completed?: string; due_today?: string } & Record<string, unknown>) {
    const { page, pageSize, completed, due_today } = query

    // If pagination is requested, use paginated query
    if (page !== undefined || pageSize !== undefined) {
      const pageNum = Math.max(1, parseInt(page as string) || 1)
      const size = Math.max(1, Math.min(100, parseInt(pageSize as string) || 50))
      const from = (pageNum - 1) * size
      const to = from + size - 1

      let queryBuilder = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('position', { ascending: true })
        .range(from, to)

      // Apply completed filter if provided
      if (completed !== undefined) {
        const isCompleted = completed === 'true'
        queryBuilder = queryBuilder.eq('completed', isCompleted)
      }

      const { data, error } = await queryBuilder

      if (error) throw error

      return data
    }

    // For non-paginated requests, check if special filters are needed
    if (due_today === 'true') {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .gte('due_date', today)
        .lt('due_date', today + 'T23:59:59')
        .order('position', { ascending: true })

      if (error) throw error

      return data
    }

    // Default: return all tasks ordered by position
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('position', { ascending: true })

    if (error) throw error
    return data
  }
  async create(userId: string, payload: Partial<Task>) {
    if (!payload?.title) throw new Error('Title is required')
    const result = await this.repo.create(userId, { ...payload, completed: false, tags: payload.tags ?? [] })
    await invalidate(userId, 'tasks')
    return result
  }
  async update(userId: string, id: string, payload: Partial<Task>) {
    const updated = await this.repo.update(userId, id, payload)

    // Invalidate cache
    await invalidate(userId, 'tasks')

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
    const result = await this.repo.remove(userId, id)
    await invalidate(userId, 'tasks')
    return result
  }

  async getSummary(userId: string) {
    const today = new Date().toISOString().split('T')[0]

    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (totalError) throw totalError

    // Get completed count
    const { count: completed, error: completedError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)
      .is('deleted_at', null)

    if (completedError) throw completedError

    // Get due today count
    const { count: dueToday, error: dueTodayError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('deleted_at', null)
      .gte('due_date', today)
      .lt('due_date', today + 'T23:59:59')

    if (dueTodayError) throw dueTodayError

    return {
      total: total || 0,
      completed: completed || 0,
      dueToday: dueToday || 0
    }
  }
}

export const tasksService = new TasksServiceImpl()
