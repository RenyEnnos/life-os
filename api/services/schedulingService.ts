import { calendarService } from './calendarService'
import { tasksService } from './tasksService'
import { aiManager } from './ai/AIManager'
import { format, addMinutes, startOfDay, endOfDay, isWithinInterval } from 'date-fns'

export interface TimeSlot {
    start: string
    end: string
}

export interface ScheduledTask {
    taskId: string
    title: string
    start: string
    end: string
}

const SCHEDULING_PROMPT = `You are a productivity expert assistant. Your task is to schedule the following user tasks into the provided free time slots in their calendar.
Consider:
1. Priority: High priority tasks should be scheduled earlier or in better slots.
2. Duration: Ensure the task fits in the slot.
3. Deadlines: Respect due dates if provided.
4. Context: Group similar tasks if it makes sense.
5. Buffer Time: Ensure at least {{BUFFER}} minutes of break between any two scheduled tasks or existing events.

Free Slots (ISO format):
{{FREE_SLOTS}}

Tasks to Schedule:
{{TASKS}}

Respond ONLY in JSON format:
[
  {
    "taskId": "UUID",
    "title": "Task Title",
    "start": "ISO Date String",
    "end": "ISO Date String"
  }
]
`

export const schedulingService = {
    async getSuggestedSchedule(userId: string, date: string = format(new Date(), 'yyyy-MM-dd'), bufferTime: number = 15): Promise<ScheduledTask[]> {
        const start = startOfDay(new Date(date))
        const end = endOfDay(new Date(date))

        // 1. Get Tasks
        const allTasks = await tasksService.list(userId, { completed: 'false' })
        const unscheduledTasks = allTasks.filter((t: any) => !t.scheduled_start)

        if (unscheduledTasks.length === 0) return []

        // 2. Get Calendar Events to find busy slots
        const calendar = await calendarService.getCalendarClient(userId)
        const eventsResponse = await calendar.events.list({
            calendarId: 'primary',
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        })

        const busySlots = (eventsResponse.data.items || []).map((event: any) => ({
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date
        }))

        // 3. Calculate Free Slots (simplified logic: check hourly from 08:00 to 20:00)
        // In a real app, this would be more robust.
        const freeSlots: TimeSlot[] = []
        let current = addMinutes(start, 8 * 60) // Start at 08:00
        const workdayEnd = addMinutes(start, 20 * 60) // End at 20:00

        while (current < workdayEnd) {
            const slotEnd = addMinutes(current, 60) // 1 hour slots
            const isBusy = busySlots.some(busy => {
                const busyStart = new Date(busy.start)
                const busyEnd = new Date(busy.end)
                return (
                    isWithinInterval(current, { start: busyStart, end: busyEnd }) ||
                    isWithinInterval(addMinutes(slotEnd, -1), { start: busyStart, end: busyEnd })
                )
            })

            if (!isBusy) {
                freeSlots.push({ start: current.toISOString(), end: slotEnd.toISOString() })
            }
            current = slotEnd
        }

        // 4. Prompt AI
        const freeSlotsText = freeSlots.map(s => `- ${s.start} to ${s.end}`).join('\n')
        const tasksText = unscheduledTasks
            .map((t: any) => `- [${t.id}] ${t.title} (Duration: ${t.estimated_duration || 30}m, Priority: ${t.priority || 'medium'})`)
            .join('\n')

        const userPrompt = SCHEDULING_PROMPT
            .replace('{{FREE_SLOTS}}', freeSlotsText)
            .replace('{{TASKS}}', tasksText)
            .replace('{{BUFFER}}', bufferTime.toString())

        const aiResponse = await aiManager.execute('deep_reason', {
            systemPrompt: 'You are a master of time blocking and productivity.',
            userPrompt,
            jsonMode: true
        })

        try {
            return JSON.parse(aiResponse.text)
        } catch (error) {
            console.error('Failed to parse scheduled tasks:', error)
            return []
        }
    },

    async applySchedule(userId: string, scheduledTasks: ScheduledTask[]) {
        const results = await Promise.all(scheduledTasks.map(async (st) => {
            // 1. Update DB
            await tasksService.update(userId, st.taskId, {
                scheduled_start: st.start,
                scheduled_end: st.end
            })

            // 2. Sync to Google Calendar
            const calendar = await calendarService.getCalendarClient(userId)
            const event = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: {
                    summary: st.title,
                    description: 'Scheduled by LifeOS AI',
                    start: { dateTime: st.start },
                    end: { dateTime: st.end }
                }
            })

            // 3. Save Event ID for future sync
            await tasksService.update(userId, st.taskId, {
                google_event_id: event.data.id || undefined
            })

            return { taskId: st.taskId, eventId: event.data.id }
        }))

        return results
    }
}
