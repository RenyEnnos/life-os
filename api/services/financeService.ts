import { supabase } from '../lib/supabase'

export const financeService = {
  async list(userId: string, query: any) {
    const { startDate, endDate, type, category, limit } = query
    let q = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })

    if (startDate) q = q.gte('transaction_date', startDate)
    if (endDate) q = q.lte('transaction_date', endDate)
    if (type) q = q.eq('type', type)
    if (category) q = q.eq('category', category)
    if (limit) q = q.limit(Number(limit))

    const { data, error } = await q
    if (error) throw error
    return data
  },

  async create(userId: string, payload: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...payload, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(userId: string, id: string, payload: any) {
    const { data, error } = await supabase
      .from('transactions')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async remove(userId: string, id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return true
  },

  async summary(userId: string) {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('transaction_date', firstDay)
      .lte('transaction_date', lastDay)

    if (error) throw error

    const income = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const expenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

    const byCategory = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((acc: any, t: any) => {
        const cat = t.category || 'Outros'
        acc[cat] = (acc[cat] || 0) + Number(t.amount)
        return acc
      }, {})

    return {
      income,
      expenses,
      balance: income - expenses,
      byCategory
    }
  }
}
