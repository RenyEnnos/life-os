import { repoFactory, type BaseRepo } from '../repositories/factory'
import type { HealthMetric } from '../../shared/types'

export class HealthService {
  private repo: BaseRepo<HealthMetric>
  constructor(repo?: BaseRepo<HealthMetric>) { this.repo = repo ?? repoFactory.get('health_metrics') }
  list(userId: string) { return this.repo.list(userId) }
  async create(userId: string, payload: Partial<HealthMetric>) {
    if (!payload.metric_type || payload.value == null || !payload.recorded_date) throw new Error('metric_type, value and recorded_date are required')
    return this.repo.create(userId, payload)
  }
  update(userId: string, id: string, payload: Partial<HealthMetric>) { return this.repo.update(userId, id, payload) }
  remove(userId: string, id: string) { return this.repo.remove(userId, id) }
}

export const healthService = new HealthService()
