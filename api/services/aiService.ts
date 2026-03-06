import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { aiManager } from './ai/AIManager'
import { getCached, setCache } from './aiCache'

const TagsSchema = z.object({
  tags: z.array(z.string())
})

const SwotSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string())
})

const WeeklyPlanSchema = z.record(z.string(), z.array(z.string()))

const DailySummarySchema = z.object({
  summary: z.array(z.string())
})

const TaskParseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.array(z.string()).optional(),
  energy_level: z.enum(['high', 'low', 'any']).optional(),
  time_block: z.enum(['morning', 'afternoon', 'evening', 'any']).optional()
})

const HabitParseSchema = z.object({
  name: z.string(),
  frequency: z.string().optional(),
  target_value: z.number().optional(),
  unit: z.string().optional(),
  reminder_time: z.string().optional(),
  tags: z.array(z.string()).optional()
})

const TransactionParseSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number(),
  description: z.string(),
  transaction_date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional()
})

const UniversalEntitySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('task'), data: TaskParseSchema }),
  z.object({ type: z.literal('habit'), data: HabitParseSchema }),
  z.object({ type: z.literal('transaction'), data: TransactionParseSchema })
])

const HabitDiagnosisSchema = z.object({
  type: z.enum(['success', 'warning', 'info']),
  message: z.string(),
  detail: z.string(),
  action: z.object({
    type: z.enum(['CHANGE_ROUTINE', 'CHANGE_FREQUENCY', 'PAUSE_HABIT', 'CREATE_TASK']),
    habitId: z.string().optional(),
    value: z.any().optional(),
    label: z.string()
  }).optional()
})

export const aiService = {
  async checkLimit(userId: string, feature: string, force = false): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]

    // Check user preferences for Low-IA mode
    const { data: user } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', userId)
      .single()

    const prefs = user?.preferences as Record<string, unknown> | undefined
    const lowIA = typeof prefs?.lowIA === 'boolean' ? (prefs!.lowIA as boolean) : false
    if (lowIA && !force) return false
    // Limit: 20 calls per feature per day

    const { count, error } = await supabase
      .from('ai_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('function_name', feature)
      .gte('created_at', `${today}T00:00:00`)

    if (error) throw error

    return (count || 0) < 20
  },

  async logUsage(userId: string, feature: string, success: boolean, meta?: { errorMessage?: string; tokens?: number; ms?: number }) {
    await supabase.from('ai_logs').insert([{ user_id: userId, function_name: feature, success, error_message: meta?.errorMessage, tokens_used: meta?.tokens ?? null, response_time_ms: meta?.ms ?? null }])
  },

  async generateTags(userId: string, context: string, type: 'habit' | 'task' | 'journal' | 'finance', opts?: { force?: boolean }) {
    if (!context || !type) throw new Error('context and type are required')
    const allowed = await this.checkLimit(userId, 'generateTags', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a helpful assistant that suggests short, relevant tags (max 5) for a ${type}. Return a JSON object with a "tags" key containing an array of strings, e.g. {"tags": ["tag1", "tag2"]}.`
    const cached = await getCached(userId, 'generateTags', { type, context })
    if (cached) { await this.logUsage(userId, 'generateTags', true); return cached }

    let response;
    try {
      response = await aiManager.execute('speed', {
        systemPrompt,
        userPrompt: context,
        jsonMode: true
      });
    } catch (e) {
      console.error('AI Manager failed', e);
    }

    if (!response || !response.text) {
      // heuristic fallback
      const c = context.toLowerCase()
      const rules: string[] = []
      if (c.includes('supermercado') || c.includes('mercado')) rules.push('groceries')
      if (c.includes('treino') || c.includes('academia')) rules.push('fitness')
      if (c.includes('meditar') || c.includes('meditação')) rules.push('mindfulness')
      if (c.includes('reunião')) rules.push('work')
      await this.logUsage(userId, 'generateTags', true)
      return rules.slice(0, 5)
    }

    try {
      const parsed = JSON.parse(response.text)
      const result = TagsSchema.safeParse(parsed)

      if (!result.success) {
        throw new Error('Schema validation failed')
      }

      const tags = result.data.tags
      await setCache(userId, 'generateTags', { type, context }, tags)
      await this.logUsage(userId, 'generateTags', true, { tokens: response.tokens, ms: response.ms })
      return tags
    } catch {
      await this.logUsage(userId, 'generateTags', false, { errorMessage: 'JSON/Schema error', tokens: response?.tokens, ms: response?.ms })
      return []
    }
  },

  async generateSwot(userId: string, projectContext: string, opts?: { force?: boolean }) {
    if (!projectContext) throw new Error('context required')
    const allowed = await this.checkLimit(userId, 'generateSwot', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a strategic assistant. Given a project description, suggest a SWOT analysis. Return a JSON object with keys: strengths, weaknesses, opportunities, threats. Each key should be an array of strings.`
    const cached = await getCached(userId, 'generateSwot', { projectContext })
    if (cached) { await this.logUsage(userId, 'generateSwot', true); return cached }

    let response;
    try {
      response = await aiManager.execute('deep_reason', {
        systemPrompt,
        userPrompt: projectContext,
        jsonMode: true
      });
    } catch (e) { console.error(e); }

    if (!response || !response.text) {
      // fallback structure
      const swot = { strengths: ['Organização'], weaknesses: ['Recursos limitados'], opportunities: ['Automação'], threats: ['Distrações'] }
      await this.logUsage(userId, 'generateSwot', true)
      return swot
    }

    try {
      const parsed = JSON.parse(response.text)
      const result = SwotSchema.safeParse(parsed)

      if (!result.success) {
        throw new Error('Schema validation failed')
      }

      const swot = result.data
      await setCache(userId, 'generateSwot', { projectContext }, swot)
      await this.logUsage(userId, 'generateSwot', true, { tokens: response.tokens, ms: response.ms })
      return swot
    } catch {
      await this.logUsage(userId, 'generateSwot', false, { errorMessage: 'JSON/Schema error', tokens: response?.tokens, ms: response?.ms })
      throw new Error('Failed to parse AI response')
    }
  },

  async generateWeeklyPlan(userId: string, tasksContext: string, opts?: { force?: boolean }) {
    if (!tasksContext) throw new Error('context required')
    const allowed = await this.checkLimit(userId, 'generateWeeklyPlan', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a productivity coach. Given a list of tasks, suggest a weekly plan. Return a JSON object where keys are days (Monday, Tuesday...) and values are arrays of task titles.`
    const cached = await getCached(userId, 'generateWeeklyPlan', { tasksContext })
    if (cached) { await this.logUsage(userId, 'generateWeeklyPlan', true); return cached }

    let response;
    try {
      response = await aiManager.execute('deep_reason', {
        systemPrompt,
        userPrompt: tasksContext,
        jsonMode: true
      });
    } catch (e) { console.error(e); }

    if (!response || !response.text) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      const plan: Record<string, string[]> = {}
      days.forEach((d) => (plan[d] = []))
      await this.logUsage(userId, 'generateWeeklyPlan', true)
      return plan
    }

    try {
      const parsed = JSON.parse(response.text)
      const result = WeeklyPlanSchema.safeParse(parsed)

      if (!result.success) {
        throw new Error('Schema validation failed')
      }

      const plan = result.data
      await setCache(userId, 'generateWeeklyPlan', { tasksContext }, plan)
      await this.logUsage(userId, 'generateWeeklyPlan', true, { tokens: response.tokens, ms: response.ms })
      return plan
    } catch {
      await this.logUsage(userId, 'generateWeeklyPlan', false, { errorMessage: 'JSON/Schema error', tokens: response?.tokens, ms: response?.ms })
      throw new Error('Failed to parse AI response')
    }
  },

  async generateDailySummary(userId: string, journalContent: string, opts?: { force?: boolean }) {
    if (!journalContent) throw new Error('context required')
    const allowed = await this.checkLimit(userId, 'generateDailySummary', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a thoughtful assistant. Summarize the following journal entry into 3-5 concise bullet points. Return a JSON object with a "summary" key containing an array of strings.`
    const cached = await getCached(userId, 'generateDailySummary_v2', { journalContent })
    if (cached) { await this.logUsage(userId, 'generateDailySummary', true); return cached }

    let response;
    try {
      response = await aiManager.execute('speed', {
        systemPrompt,
        userPrompt: journalContent,
        jsonMode: true
      });
    } catch (e) { console.error(e); }

    if (!response || !response.text) {
      // Robust fallback: split by newline first, then by period if needed.
      let bullets = journalContent.split('\n').map(s => s.trim()).filter(s => s.length > 5)

      if (bullets.length === 0) {
        bullets = journalContent.split('.').map(s => s.trim()).filter(s => s.length > 5)
      }

      // If still empty, just use the whole content as one bullet
      if (bullets.length === 0) {
        bullets = [journalContent.trim() || 'Sem conteúdo para resumir.']
      }

      await this.logUsage(userId, 'generateDailySummary', true)
      return bullets.slice(0, 5)
    }

    try {
      const parsed = JSON.parse(response.text)
      const result = DailySummarySchema.safeParse(parsed)

      if (!result.success) {
        throw new Error('Schema validation failed')
      }

      const summary = result.data.summary
      await setCache(userId, 'generateDailySummary_v2', { journalContent }, summary)
      await this.logUsage(userId, 'generateDailySummary', true, { tokens: response.tokens, ms: response.ms })
      return summary
    } catch {
      await this.logUsage(userId, 'generateDailySummary', false, { errorMessage: 'JSON/Schema error', tokens: response?.tokens, ms: response?.ms })
      throw new Error('Failed to parse AI response')
    }
  },

  async getLogs(userId: string) {
    const { data, error } = await supabase
      .from('ai_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data
  },

  async parseTask(userId: string, naturalInput: string, opts?: { force?: boolean }) {
    if (!naturalInput) throw new Error('natural input required')
    const allowed = await this.checkLimit(userId, 'parseTask', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a productivity assistant. Parse a natural language task description into a structured task object. Extract title, description, due date (ISO format), priority (low/medium/high), tags, energy level (high/low/any), and time block (morning/afternoon/evening/any). Return a JSON object.`
    const cached = await getCached(userId, 'parseTask', { naturalInput })
    if (cached) { await this.logUsage(userId, 'parseTask', true); return cached }

    let response;
    try {
      response = await aiManager.execute('speed', {
        systemPrompt,
        userPrompt: naturalInput,
        jsonMode: true
      });
    } catch (e) { console.error(e); }

    if (!response || !response.text) {
      await this.logUsage(userId, 'parseTask', true)
      return { title: naturalInput }
    }

    try {
      const parsed = JSON.parse(response.text)
      const result = TaskParseSchema.safeParse(parsed)

      if (!result.success) {
        await this.logUsage(userId, 'parseTask', false, { errorMessage: 'Schema validation failed', tokens: response.tokens, ms: response.ms })
        return { title: naturalInput }
      }

      const task = result.data
      await setCache(userId, 'parseTask', { naturalInput }, task)
      await this.logUsage(userId, 'parseTask', true, { tokens: response.tokens, ms: response.ms })
      return task
    } catch {
      await this.logUsage(userId, 'parseTask', false, { errorMessage: 'JSON/Schema error', tokens: response?.tokens, ms: response?.ms })
      return { title: naturalInput }
    }
  },

  async parseEntity(userId: string, naturalInput: string, opts?: { force?: boolean }) {
    if (!naturalInput) throw new Error('natural input required')
    const allowed = await this.checkLimit(userId, 'parseEntity', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a productivity assistant specialized in Portuguese (Brazil). 
    Your task is to parse a natural language input into one of three entities: task, habit, or transaction.

    Rules:
    1. If it's a TASK: Extract title, description, due date (ISO format), priority (low/medium/high), tags, energy level (high/low/any), and time block (morning/afternoon/evening/any).
    2. If it's a HABIT (recurring behavior): Extract name, frequency (daily, weekly, monthly), target_value (number), unit (e.g., 'km', 'litros', 'vezes'), reminder_time (HH:mm), and tags.
    3. If it's a TRANSACTION (finance): Extract type (income/expense), amount (number), description, transaction_date (ISO format), tags, and category.

    Return a JSON object with a "type" field ('task', 'habit', or 'transaction') and a "data" field containing the structured entity.
    
    Example:
    "Gastei 50 reais com pizza" -> { "type": "transaction", "data": { "type": "expense", "amount": 50, "description": "Pizza", "category": "Food" } }
    "Correr 5km todo dia às 7h" -> { "type": "habit", "data": { "name": "Correr", "frequency": "daily", "target_value": 5, "unit": "km", "reminder_time": "07:00" } }
    "Email John amanhã" -> { "type": "task", "data": { "title": "Email John", "due_date": "2024-..." } }
    `

    const cached = await getCached(userId, 'parseEntity', { naturalInput })
    if (cached) { await this.logUsage(userId, 'parseEntity', true); return cached }

    let response;
    try {
      response = await aiManager.execute('speed', {
        systemPrompt,
        userPrompt: naturalInput,
        jsonMode: true
      });
    } catch (e) { console.error(e); }

    if (!response || !response.text) {
      await this.logUsage(userId, 'parseEntity', true)
      return { type: 'task', data: { title: naturalInput } }
    }

    try {
      const parsed = JSON.parse(response.text)
      const result = UniversalEntitySchema.safeParse(parsed)

      if (!result.success) {
        await this.logUsage(userId, 'parseEntity', false, { errorMessage: 'Schema validation failed', tokens: response.tokens, ms: response.ms })
        return { type: 'task', data: { title: naturalInput } }
      }

      const entity = result.data
      await setCache(userId, 'parseEntity', { naturalInput }, entity)
      await this.logUsage(userId, 'parseEntity', true, { tokens: response.tokens, ms: response.ms })
      return entity
    } catch {
      await this.logUsage(userId, 'parseEntity', false, { errorMessage: 'JSON/Schema error', tokens: response?.tokens, ms: response?.ms })
      return { type: 'task', data: { title: naturalInput } }
    }
  },

  async generateHabitDiagnosis(userId: string, habitsContext: string, opts?: { force?: boolean }) {
    if (!habitsContext) throw new Error('context required')
    const allowed = await this.checkLimit(userId, 'habitDoctor', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a productivity doctor specialized in habits. 
    Given a user's habits and their recent completion data, provide a diagnosis and an actionable suggestion.
    
    Rules:
    1. If they are doing well (80%+ consistency): Type "success".
    2. If they are struggling (30%-70%): Type "info" or "warning".
    3. If they are failing (<30%): Type "warning".
    
    Return a JSON object with keys: 
    - "type": success/warning/info
    - "message": short punchy title
    - "detail": actionable advice
    - "action": (Optional) { "type": "CHANGE_ROUTINE" | "CHANGE_FREQUENCY" | "PAUSE_HABIT" | "CREATE_TASK", "habitId": "id", "value": "new_value", "label": "Button text" }

    Example Action: { "type": "CHANGE_ROUTINE", "habitId": "123", "value": "morning", "label": "Mudar para Manhã" }
    
    Focus on WHY they might be failing based on the data.
    Respond in the language of the user's input (default to Portuguese Brazil).`

    const cached = await getCached(userId, 'habitDoctor', { habitsContext })
    if (cached) { await this.logUsage(userId, 'habitDoctor', true); return cached }

    let response;
    try {
      response = await aiManager.execute('deep_reason', {
        systemPrompt,
        userPrompt: habitsContext,
        jsonMode: true
      });
    } catch (e) { console.error(e); }

    if (!response || !response.text) {
      const fallback = { type: 'info', message: 'Nexus Estável', detail: 'Continue mantendo a consistência para uma análise mais profunda.' }
      await this.logUsage(userId, 'habitDoctor', true)
      return fallback
    }

    try {
      const parsed = JSON.parse(response.text)
      const result = HabitDiagnosisSchema.safeParse(parsed)

      if (!result.success) {
        throw new Error('Schema validation failed')
      }

      const diagnosis = result.data
      await setCache(userId, 'habitDoctor', { habitsContext }, diagnosis)
      await this.logUsage(userId, 'habitDoctor', true, { tokens: response.tokens, ms: response.ms })
      return diagnosis
    } catch {
      await this.logUsage(userId, 'habitDoctor', false, { errorMessage: 'JSON/Schema error', tokens: response?.tokens, ms: response?.ms })
      throw new Error('Failed to parse AI response')
    }
  }
}
