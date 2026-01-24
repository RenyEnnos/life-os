import { eventBus, Events } from '../lib/events'
import { rewardsService } from './rewardsService'
import { habitsService } from './habitsService'

export const activeSymbiosis = {
    init() {
        console.log('[Symbiosis] Active Intelligence Listener Started')

        eventBus.on(Events.HABIT_COMPLETED, async (payload) => {
            const { userId, habitId, value } = payload
            console.log(`[Symbiosis] Habit Completed: ${habitId} (Value: ${value})`)

            try {
                // 1. Fetch Habit Details to check Attribute
                const habit = await habitsService.list(userId, {})
                // list returns array, need to find specific one. Ideally habitsService.get(id)
                // Optimization: habitsService.get(id) doesn't exist yet, we iterate or add it.
                // For now, let's assume we can filter.
                const targetHabit = (habit as any[]).find((h: any) => h.id === habitId)

                if (targetHabit?.attribute) {
                    console.log(`[Symbiosis] Attribute Boost: ${targetHabit.attribute}`)
                    // Future: Add XP specific to attribute
                    // await rewardsService.addAttributeXp(userId, targetHabit.attribute, 10)
                }

                // 2. Check for Symbiosis Links (e.g. "Gym" -> "Project A")
                // Future implementation using symbiosisService.findLinks(habitId)

            } catch (err) {
                console.error('[Symbiosis] Error processing habit completion', err)
            }
        })

        eventBus.on(Events.TRANSACTION_CREATED, async (payload) => {
            const { userId, transaction } = payload
            console.log(`[Symbiosis] Transaction Logged: ${transaction.amount} (${transaction.type})`)
            // Simple Gamification: +5 XP for tracking finances (Organization/Output)
            try {
                await rewardsService.addXp(userId, 5)
            } catch (err) {
                console.error('[Symbiosis] Error processing finance reward', err)
            }
        })
    }
}
