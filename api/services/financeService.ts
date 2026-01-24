import { supabase } from '../lib/supabase'
import { eventBus, Events } from '../lib/events'

export type Transaction = {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  tags?: string[]
  category?: string // legacy
  category_id?: string // new
  created_at?: string
}

class FinanceServiceImpl {
  async list(userId: string, query: { from?: number; to?: number; startDate?: string; endDate?: string } = {}) {
    let q = supabase
      .from('transactions')
      .select('*, finance_categories(name, icon)')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (query.startDate) q = q.gte('date', query.startDate)
    if (query.endDate) q = q.lte('date', query.endDate)
    if (query.from !== undefined && query.to !== undefined) q = q.range(query.from, query.to)

    const { data, error } = await q
    if (error) throw error
    return data
  }

  async create(userId: string, payload: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...payload, user_id: userId })
      .select()
      .single()
    if (error) throw error

    // Emit Symbiosis Event
    eventBus.emit(Events.TRANSACTION_CREATED, { userId, transaction: data })

    return data
  }

  async update(userId: string, id: string, payload: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(payload)
      .eq('user_id', userId)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async remove(userId: string, id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId)
      .eq('id', id)
    if (error) throw error
    return true
  }

  async summary(userId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // Get all transactions for summary (can optimize to use DB aggregation later)
    // For now, fetch current month for specific summary, or all? 
    // The previous implementation fetched simple list.
    // Let's stick to Month view for Summary context or global? 
    // Previous was GLOBAL. Let's keep it global but maybe filtered by range if provided.

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)

    const list = transactions || []

    const income = list.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expenses = list.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

    const byCategory = list
      .filter(t => t.type === 'expense')
      .reduce((acc: Record<string, number>, t) => {
        // Use normalized category logic: category match OR category_id lookup?
        // Since we didn't fetch category join here, use 'category' string field or fallback
        const cat = t.category || 'Outros';
        acc[cat] = (acc[cat] || 0) + Number(t.amount);
        return acc
      }, {})

    return { income, expenses, balance: income - expenses, byCategory }
  }
}

export const financeService = new FinanceServiceImpl()
