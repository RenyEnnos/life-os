import { supabase } from '../lib/supabase'
import { generateAIResponse } from '../lib/groq'
import { getCached, setCache } from './aiCache'

export const aiService = {
  async checkLimit(userId: string, feature: string, force = false): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]

    // Check user preferences for Low-IA mode
    const { data: user } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', userId)
      .single()

    const lowIA = !!(user?.preferences as any)?.lowIA
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

    const systemPrompt = `You are a helpful assistant that suggests short, relevant tags (max 5) for a ${type}. Return ONLY a JSON array of strings, e.g. ["tag1", "tag2"]. No other text.`
    const cached = await getCached(userId, 'generateTags', { type, context })
    if (cached) { await this.logUsage(userId, 'generateTags', true); return cached }
    const response = await generateAIResponse(systemPrompt, context)
    if (!response) {
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
      // Extract JSON array if there's extra text
      const jsonMatch = response.text.match(/\[.*\]/s)
      const tags = jsonMatch ? JSON.parse(jsonMatch[0]) : []
      await setCache(userId, 'generateTags', { type, context }, tags)
      await this.logUsage(userId, 'generateTags', true, { tokens: response.tokens, ms: response.ms })
      return tags
    } catch (e) {
      await this.logUsage(userId, 'generateTags', false, { errorMessage: 'JSON parse error', tokens: response?.tokens, ms: response?.ms })
      return []
    }
  },

  async generateSwot(userId: string, projectContext: string, opts?: { force?: boolean }) {
    if (!projectContext) throw new Error('context required')
    const allowed = await this.checkLimit(userId, 'generateSwot', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a strategic assistant. Given a project description, suggest a SWOT analysis. Return ONLY a JSON object with keys: strengths, weaknesses, opportunities, threats. Each key should be an array of strings. Example: {"strengths": ["..."], ...}`
    const cached = await getCached(userId, 'generateSwot', { projectContext })
    if (cached) { await this.logUsage(userId, 'generateSwot', true); return cached }
    const response = await generateAIResponse(systemPrompt, projectContext)
    if (!response) {
      // fallback structure
      const swot = { strengths: ['Organização'], weaknesses: ['Recursos limitados'], opportunities: ['Automação'], threats: ['Distrações'] }
      await this.logUsage(userId, 'generateSwot', true)
      return swot
    }

    try {
      const jsonMatch = response.text.match(/\{.*\}/s)
      const swot = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
      await setCache(userId, 'generateSwot', { projectContext }, swot)
      await this.logUsage(userId, 'generateSwot', true, { tokens: response.tokens, ms: response.ms })
      return swot
    } catch (e) {
      await this.logUsage(userId, 'generateSwot', false, { errorMessage: 'JSON parse error', tokens: response?.tokens, ms: response?.ms })
      throw new Error('Failed to parse AI response')
    }
  },

  async generateWeeklyPlan(userId: string, tasksContext: string, opts?: { force?: boolean }) {
    if (!tasksContext) throw new Error('context required')
    const allowed = await this.checkLimit(userId, 'generateWeeklyPlan', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a productivity coach. Given a list of tasks, suggest a weekly plan. Return a JSON object where keys are days (Monday, Tuesday...) and values are arrays of task titles or suggestions. Keep it concise.`
    const cached = await getCached(userId, 'generateWeeklyPlan', { tasksContext })
    if (cached) { await this.logUsage(userId, 'generateWeeklyPlan', true); return cached }
    const response = await generateAIResponse(systemPrompt, tasksContext)
    if (!response) {
      const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
      const plan: Record<string, string[]> = {}
      days.forEach((d) => (plan[d] = []))
      await this.logUsage(userId, 'generateWeeklyPlan', true)
      return plan
    }

    try {
      const jsonMatch = response.text.match(/\{.*\}/s)
      const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
      await setCache(userId, 'generateWeeklyPlan', { tasksContext }, plan)
      await this.logUsage(userId, 'generateWeeklyPlan', true, { tokens: response.tokens, ms: response.ms })
      return plan
    } catch (e) {
      await this.logUsage(userId, 'generateWeeklyPlan', false, { errorMessage: 'JSON parse error', tokens: response?.tokens, ms: response?.ms })
      throw new Error('Failed to parse AI response')
    }
  },

  async generateDailySummary(userId: string, journalContent: string, opts?: { force?: boolean }) {
    if (!journalContent) throw new Error('context required')
    const allowed = await this.checkLimit(userId, 'generateDailySummary', !!opts?.force)
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a thoughtful assistant. Summarize the following journal entry into 3-5 concise bullet points. Return ONLY the bullet points as a JSON array of strings.`
    const cached = await getCached(userId, 'generateDailySummary', { journalContent })
    if (cached) { await this.logUsage(userId, 'generateDailySummary', true); return cached }
    const response = await generateAIResponse(systemPrompt, journalContent)
    if (!response) {
      const bullets = journalContent.split(/[\.\n]/).map(s => s.trim()).filter(Boolean).slice(0,5)
      await this.logUsage(userId, 'generateDailySummary', true)
      return bullets
    }

    try {
      const jsonMatch = response.text.match(/\[.*\]/s)
      const summary = jsonMatch ? JSON.parse(jsonMatch[0]) : []
      await setCache(userId, 'generateDailySummary', { journalContent }, summary)
      await this.logUsage(userId, 'generateDailySummary', true, { tokens: response.tokens, ms: response.ms })
      return summary
    } catch (e) {
      await this.logUsage(userId, 'generateDailySummary', false, { errorMessage: 'JSON parse error', tokens: response?.tokens, ms: response?.ms })
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
  }
}
