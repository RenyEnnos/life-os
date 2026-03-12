import { beforeEach, describe, expect, it, vi } from 'vitest'
import { financesApi } from '../finances.api'
import { useAuthStore } from '@/shared/stores/authStore'

const invokeResource = vi.fn(async (resource: string, action: string, ...args: unknown[]) => {
  if (resource !== 'finances') {
    throw new Error(`Unexpected resource: ${resource}`)
  }

  if (action === 'getAll') {
    return [
      { id: '1', user_id: 'user-1', description: 'Salary', amount: 1000, type: 'income', category: 'Income', transaction_date: '2025-01-01' },
      { id: '2', user_id: 'user-2', description: 'Groceries', amount: 100, type: 'expense', category: 'Food', transaction_date: '2025-01-02' },
    ]
  }

  if (action === 'create') {
    return { id: '3', ...(args[0] as Record<string, unknown>) }
  }

  if (action === 'update') {
    return { id: args[0], ...(args[1] as Record<string, unknown>) }
  }

  if (action === 'delete') {
    return true
  }

  throw new Error(`Unexpected action: ${action}`)
})

vi.mock('@/shared/stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({ user: { id: 'user-1' } })),
  },
}))

const mockGetAuthState = (useAuthStore.getState as unknown as ReturnType<typeof vi.fn>)

beforeEach(() => {
  invokeResource.mockClear()
  mockGetAuthState.mockReturnValue({ user: { id: 'user-1' } })
  vi.stubGlobal('window', {
    api: {
      invokeResource,
    },
  })
})

describe('finances.api', () => {
  it('list returns transactions from IPC and applies filters', async () => {
    const txs = await financesApi.list('user-1', { category: 'Income' })
    expect(txs).toHaveLength(1)
    expect(invokeResource).toHaveBeenCalledWith('finances', 'getAll')
    expect(txs[0]?.id).toBe('1')
  })

  describe('create', () => {
    it('uses IPC transaction create and applies authenticated user id', async () => {
      const created = await financesApi.create({ description: 'Test', amount: 50, type: 'expense' })
      expect(created.id).toBeDefined()
      expect(created.amount).toBe(50)
      expect(invokeResource).toHaveBeenCalledWith('finances', 'create', { description: 'Test', amount: 50, type: 'expense', user_id: 'user-1' })
    })

    it('preserves explicit payload user_id over derived user id', async () => {
      await financesApi.create({ description: 'Test', amount: 50, type: 'expense', user_id: 'user-2' })
      expect(invokeResource).toHaveBeenCalledWith('finances', 'create', { description: 'Test', amount: 50, type: 'expense', user_id: 'user-2' })
    })

    it('prefers explicit userId argument for create', async () => {
      await financesApi.create({ description: 'Test', amount: 50, type: 'expense' }, 'user-3')
      expect(invokeResource).toHaveBeenCalledWith('finances', 'create', { description: 'Test', amount: 50, type: 'expense', user_id: 'user-3' })
    })

    it('does not inject user_id when auth user is unavailable', async () => {
      mockGetAuthState.mockReturnValue({ user: null })
      await financesApi.create({ description: 'Test', amount: 50, type: 'expense' })
      expect(invokeResource).toHaveBeenCalledWith('finances', 'create', { description: 'Test', amount: 50, type: 'expense' })
    })
  })

  it('update uses IPC transaction update', async () => {
    const updated = await financesApi.update('1', { amount: 200 })
    expect(updated.amount).toBe(200)
    expect(invokeResource).toHaveBeenCalledWith('finances', 'update', '1', { amount: 200 })
  })

  it('delete uses IPC transaction delete', async () => {
    await expect(financesApi.delete('1')).resolves.toBeUndefined()
    expect(invokeResource).toHaveBeenCalledWith('finances', 'delete', '1')
  })

  describe('getSummary', () => {
    it('computes summary from local transactions', async () => {
      const summary = await financesApi.getSummary('user-1')
      expect(summary.income).toBe(1000)
      expect(summary.expenses).toBe(0)
      expect(summary.balance).toBe(1000)
      expect(summary.byCategory?.Food).toBeUndefined()
      expect(invokeResource).toHaveBeenCalledWith('finances', 'getAll')
    })

    it('includes other users only when no user filter is provided', async () => {
      const summary = await financesApi.getSummary()
      expect(summary.income).toBe(1000)
      expect(summary.expenses).toBe(100)
      expect(summary.balance).toBe(900)
      expect(summary.byCategory?.Food).toBe(100)
    })
  })
})
