import { supabase } from '../lib/supabase'

export type BudgetStatus = {
    categoryId: string
    categoryName: string
    limit: number
    spent: number
    remaining: number
    status: 'safe' | 'warning' | 'exceeded' // warning > 80%
    period: 'monthly' | 'weekly' | 'yearly'
}

export const budgetService = {
    async list(userId: string) {
        const { data: budgets, error } = await supabase
            .from('budgets')
            .select('*, finance_categories(name)')
            .eq('user_id', userId)

        if (error) throw error
        return budgets
    },

    async checkStatus(userId: string): Promise<BudgetStatus[]> {
        const { data: budgets } = await supabase
            .from('budgets')
            .select('*, finance_categories(name)')
            .eq('user_id', userId)

        if (!budgets || budgets.length === 0) return []

        // Calculate start of period (assuming monthly for MVP)
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

        // Aggregate expenses per category
        const { data: expenses } = await supabase
            .from('transactions')
            .select('amount, category_id')
            .eq('user_id', userId)
            .eq('type', 'expense')
            .gte('transaction_date', startOfMonth)
            .lte('transaction_date', endOfMonth)
            .not('category_id', 'is', null)

        const spendingMap = (expenses || []).reduce((acc, txn) => {
            const catId = txn.category_id
            if (catId) {
                acc[catId] = (acc[catId] || 0) + Number(txn.amount)
            }
            return acc
        }, {} as Record<string, number>)

        return budgets.map(b => {
            const spent = spendingMap[b.category_id as string] || 0
            const limit = Number(b.amount_limit)
            const remaining = limit - spent
            const percentage = spent / limit

            let status: BudgetStatus['status'] = 'safe'
            if (percentage >= 1.0) status = 'exceeded'
            else if (percentage >= 0.8) status = 'warning'

            return {
                categoryId: b.category_id as string,
                categoryName: (b.finance_categories as any)?.name || 'Unknown',
                limit,
                spent,
                remaining,
                status,
                period: b.period as any
            }
        })
    }
}
