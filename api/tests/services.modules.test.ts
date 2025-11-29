import { describe, it, expect, beforeEach } from 'vitest'
import { HabitsService } from '../services/habitsService'
import { JournalService } from '../services/journalService'
import { HealthService } from '../services/healthService'
import { FinanceService } from '../services/financeService'
import { ProjectsService } from '../services/projectsService'
import { RewardsService } from '../services/rewardsService'
import { repoFactory } from '../repositories/factory'

const userId = 'u1'

describe('Module services basic flows', () => {
  beforeEach(() => { process.env.NODE_ENV = 'test' })

  it('Habits create/list', async () => {
    const s = new HabitsService(repoFactory.get('habits'))
    const h = await s.create(userId, { title: 'Drink water' })
    expect(h.title).toBe('Drink water')
    const list = await s.list(userId)
    expect(list.length).toBe(1)
  })

  it('Journal create/list', async () => {
    const s = new JournalService(repoFactory.get('journal_entries'))
    const e = await s.create(userId, { entry_date: '2025-01-01', content: 'note' })
    expect(e.content).toBe('note')
  })

  it('Health create/list', async () => {
    const s = new HealthService(repoFactory.get('health_metrics'))
    const m = await s.create(userId, { metric_type: 'steps', value: 5000, recorded_date: '2025-01-02' })
    expect(m.metric_type).toBe('steps')
  })

  it('Finance create/summary', async () => {
    const s = new FinanceService(repoFactory.get('transactions'))
    await s.create(userId, { type: 'income', amount: 100, description: 'Salary', transaction_date: '2025-01-03' })
    await s.create(userId, { type: 'expense', amount: 40, description: 'Food', transaction_date: '2025-01-03' })
    const summary = await s.summary(userId)
    expect(summary.balance).toBe(60)
  })

  it('Projects and SWOT', async () => {
    const s = new ProjectsService(repoFactory.get('projects'), repoFactory.get('swot_entries'))
    const p = await s.create(userId, { name: 'Project X' })
    expect(p.name).toBe('Project X')
    const sw = await s.addSwot(userId, p.id, { category: 'strength', content: 'Fast' })
    expect(sw.content).toBe('Fast')
  })

  it('Rewards create/list', async () => {
    const s = new RewardsService(repoFactory.get('rewards'))
    const r = await s.create(userId, { title: '30-day streak', points_required: 30 })
    expect(r.title).toBe('30-day streak')
  })
})
