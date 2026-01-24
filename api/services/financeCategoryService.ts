import { supabase } from '../lib/supabase'

/**
 * Default finance categories for new users
 */
const DEFAULT_EXPENSE_CATEGORIES = [
    { name: 'Alimentação', type: 'expense', icon: 'utensils' },
    { name: 'Transporte', type: 'expense', icon: 'car' },
    { name: 'Moradia', type: 'expense', icon: 'home' },
    { name: 'Saúde', type: 'expense', icon: 'heart' },
    { name: 'Educação', type: 'expense', icon: 'book' },
    { name: 'Lazer', type: 'expense', icon: 'gamepad-2' },
    { name: 'Compras', type: 'expense', icon: 'shopping-bag' },
    { name: 'Contas', type: 'expense', icon: 'file-text' },
    { name: 'Outros', type: 'expense', icon: 'more-horizontal' },
]

const DEFAULT_INCOME_CATEGORIES = [
    { name: 'Salário', type: 'income', icon: 'briefcase' },
    { name: 'Freelance', type: 'income', icon: 'laptop' },
    { name: 'Investimentos', type: 'income', icon: 'trending-up' },
    { name: 'Outros', type: 'income', icon: 'plus-circle' },
]

export const financeCategoryService = {
    /**
     * Create default finance categories for a new user
     */
    async createDefaultCategories(userId: string): Promise<void> {
        const allCategories = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]

        const categoriesWithUserId = allCategories.map(cat => ({
            ...cat,
            user_id: userId
        }))

        const { error } = await supabase
            .from('finance_categories')
            .insert(categoriesWithUserId)

        if (error) {
            console.error('[FinanceCategories] Failed to create default categories:', error)
            // Don't throw - this is a non-critical operation
        } else {
            console.log(`[FinanceCategories] Created ${categoriesWithUserId.length} default categories for user ${userId}`)
        }
    },

    /**
     * Get all categories for a user
     */
    async list(userId: string) {
        const { data, error } = await supabase
            .from('finance_categories')
            .select('*')
            .eq('user_id', userId)
            .order('name')

        if (error) throw error
        return data ?? []
    },

    /**
     * Create a new category
     */
    async create(userId: string, category: { name: string; type: 'income' | 'expense'; icon?: string }) {
        const { data, error } = await supabase
            .from('finance_categories')
            .insert({ ...category, user_id: userId })
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Delete a category
     */
    async delete(userId: string, categoryId: string) {
        const { error } = await supabase
            .from('finance_categories')
            .delete()
            .eq('user_id', userId)
            .eq('id', categoryId)

        if (error) throw error
        return true
    }
}
