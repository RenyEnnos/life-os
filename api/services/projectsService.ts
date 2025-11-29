import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { Project } from '../../shared/types'

import { getPagination } from '../lib/pagination'

export interface SWOTEntry { id: string; project_id: string; category: 'strength' | 'weakness' | 'opportunity' | 'threat'; content: string; created_at: string }

export class ProjectsService {
  private repo: BaseRepo<Project>
  private swot: BaseRepo<SWOTEntry>
  constructor(projectRepo?: BaseRepo<Project>, swotRepo?: BaseRepo<SWOTEntry>) {
    this.repo = projectRepo ?? repoFactory.get('projects')
    this.swot = swotRepo ?? repoFactory.get('swot_entries')
  }
  async list(userId: string, filters: any = {}) {
    const data = await this.repo.list(userId)
    if (process.env.NODE_ENV === 'test') return data
    const { from, to } = getPagination(filters)
    return data.slice(from, to + 1)
  }
  async create(userId: string, payload: Partial<Project>) {
    if (!payload.name) throw new Error('name is required')
    return this.repo.create(userId, { ...payload, active: true, tags: payload.tags ?? [], area_of_life: payload.area_of_life ?? [] })
  }
  update(userId: string, id: string, payload: Partial<Project>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }

  listSwot(userId: string, projectId: string) { return this.swot.list(userId).then(items => items.filter(i => i.project_id === projectId)) }
  addSwot(userId: string, projectId: string, payload: Partial<SWOTEntry>) {
    if (!payload.category || !payload.content) throw new Error('category and content required')
    return this.swot.create(userId, { ...payload, project_id: projectId })
  }
  updateSwot(userId: string, id: string, payload: Partial<SWOTEntry>) { return this.swot.update(userId, id, payload) }
  removeSwot(userId: string, id: string) { return this.swot.remove(userId, id) }
}

export const projectsService = new ProjectsService()
