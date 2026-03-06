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
      .order('transaction_date', { ascending: false })

    if (query.startDate) q = q.gte('transaction_date', query.startDate)
    if (query.endDate) q = q.lte('transaction_date', query.endDate)
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
    // Get income total
    const { data: incomeData, error: incomeError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'income')

    if (incomeError) throw incomeError

    // Get expenses total
    const { data: expenseData, error: expenseError } = await supabase
      .from('transactions')
      .select('amount, category')
      .eq('user_id', userId)
      .eq('type', 'expense')

    if (expenseError) throw expenseError

    const income = (incomeData || []).reduce((s, t) => s + Number(t.amount), 0)
    const expenses = (expenseData || []).reduce((s, t) => s + Number(t.amount), 0)

    const byCategory = (expenseData || []).reduce((acc: Record<string, number>, t) => {
      const cat = t.category || 'Outros'
      acc[cat] = (acc[cat] || 0) + Number(t.amount)
      return acc
    }, {})

    return { income, expenses, balance: income - expenses, byCategory }
  }
}

export const financeService = new FinanceServiceImpl()
