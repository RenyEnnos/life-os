import { habitsService } from './habitsService'
import { symbiosisService } from './symbiosisService'
import { rewardsService } from './rewardsService'
import { financeService } from './financeService'

export type DashboardSummary = {
    lifeScore: any
    habitConsistency: { percentage: number; weeklyData: number[] }
    vitalLoad: { totalImpact: number; state: 'balanced' | 'overloaded' | 'underloaded'; label: string }
    widgets: any
}

export const dashboardService = {
    async getSummary(userId: string): Promise<DashboardSummary> {
        const today = new Date().toISOString().split('T')[0]

        // Parallel Fetching
        const [score, habits, habitLogs, links] = await Promise.all([
            rewardsService.getUserScore(userId),
            habitsService.list(userId, {}),
            habitsService.getLogs(userId, { date: undefined }), // Fix: getLogs might check 'date' param. 'from' was guess.
            symbiosisService.list(userId)
        ])

        // 1. Calculate Habit Consistency
        const activeHabits = (habits || []).filter((h: any) => h.active)
        const consistency = await this.calculateConsistency(userId, activeHabits, habitLogs || [])

        return {
            lifeScore: score,
            habitConsistency: consistency,
            vitalLoad: this.calculateVitalLoad(links),
            widgets: {}
        }
    },

    async calculateConsistency(userId: string, habits: any[], logs: any[]) {
        const today = new Date().toISOString().split('T')[0]
        if (!habits.length) return { percentage: 0, weeklyData: [0, 0, 0, 0, 0, 0, 0] }

        // Assuming logs have 'logged_date' or 'date' property. 
        // Based on useDashboardData it was 'date'. In DB it's often 'logged_date'.
        // I will use a helper to extract date safely.
        const getDate = (l: any) => l.logging_date || l.logged_date || l.date;

        const todayLogs = logs.filter(l => getDate(l) === today)
        const todayCount = new Set(todayLogs.map(l => l.habit_id)).size
        const percentage = Math.round((todayCount / habits.length) * 100)

        // Weekly
        const weeklyData = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const dayLogs = logs.filter(l => getDate(l) === d)
            const dayCount = new Set(dayLogs.map(l => l.habit_id)).size
            weeklyData.push(dayCount)
        }

        return { percentage, weeklyData }
    },

    calculateVitalLoad(links: any[]) {
        const totalImpact = links.reduce((sum: number, link: any) => sum + (link.impact_vital ?? 0), 0);
        const state = totalImpact > 3 ? 'overloaded' : totalImpact < -1 ? 'underloaded' : 'balanced';
        const label = state === 'balanced' ? 'Carga vital equilibrada' : state === 'overloaded' ? 'Carga vital alta — priorize recuperação' : 'Carga vital baixa — adicione estímulos leves';
        // Cast state to strict type to fix lint error
        return { totalImpact, state: state as 'balanced' | 'overloaded' | 'underloaded', label }
    }
}
