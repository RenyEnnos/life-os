import { supabase } from '../lib/supabase'
import { generateAIResponse } from '../lib/groq'

export const aiService = {
  async checkLimit(userId: string, feature: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]

    // Check user preferences for Low-IA mode
    const { data: user } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', userId)
      .single()

    // If Low-IA mode is enabled, we still allow manual calls, but we might want to flag it.
    // For now, we just check rate limits.
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

  async logUsage(userId: string, feature: string, success: boolean, errorMessage?: string) {
    await supabase.from('ai_logs').insert([{
      user_id: userId,
      function_name: feature,
      success,
      error_message: errorMessage
    }])
  },

  async generateTags(userId: string, context: string, type: 'habit' | 'task' | 'journal' | 'finance') {
    const allowed = await this.checkLimit(userId, 'generateTags')
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a helpful assistant that suggests short, relevant tags (max 5) for a ${type}. Return ONLY a JSON array of strings, e.g. ["tag1", "tag2"]. No other text.`
    const response = await generateAIResponse(systemPrompt, context)

    if (!response) {
      await this.logUsage(userId, 'generateTags', false, 'Groq API failed')
      throw new Error('Failed to generate tags')
    }

    try {
      // Extract JSON array if there's extra text
      const jsonMatch = response.match(/\[.*\]/s)
      const tags = jsonMatch ? JSON.parse(jsonMatch[0]) : []
      await this.logUsage(userId, 'generateTags', true)
      return tags
    } catch (e) {
      await this.logUsage(userId, 'generateTags', false, 'JSON parse error')
      return []
    }
  },

  async generateSwot(userId: string, projectContext: string) {
    const allowed = await this.checkLimit(userId, 'generateSwot')
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a strategic assistant. Given a project description, suggest a SWOT analysis. Return ONLY a JSON object with keys: strengths, weaknesses, opportunities, threats. Each key should be an array of strings. Example: {"strengths": ["..."], ...}`
    const response = await generateAIResponse(systemPrompt, projectContext)

    if (!response) {
      await this.logUsage(userId, 'generateSwot', false, 'Groq API failed')
      throw new Error('Failed to generate SWOT')
    }

    try {
      const jsonMatch = response.match(/\{.*\}/s)
      const swot = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
      await this.logUsage(userId, 'generateSwot', true)
      return swot
    } catch (e) {
      await this.logUsage(userId, 'generateSwot', false, 'JSON parse error')
      throw new Error('Failed to parse AI response')
    }
  },

  async generateWeeklyPlan(userId: string, tasksContext: string) {
    const allowed = await this.checkLimit(userId, 'generateWeeklyPlan')
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a productivity coach. Given a list of tasks, suggest a weekly plan. Return a JSON object where keys are days (Monday, Tuesday...) and values are arrays of task titles or suggestions. Keep it concise.`
    const response = await generateAIResponse(systemPrompt, tasksContext)

    if (!response) {
      await this.logUsage(userId, 'generateWeeklyPlan', false, 'Groq API failed')
      throw new Error('Failed to generate plan')
    }

    try {
      const jsonMatch = response.match(/\{.*\}/s)
      const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
      await this.logUsage(userId, 'generateWeeklyPlan', true)
      return plan
    } catch (e) {
      await this.logUsage(userId, 'generateWeeklyPlan', false, 'JSON parse error')
      throw new Error('Failed to parse AI response')
    }
  },

  async generateDailySummary(userId: string, journalContent: string) {
    const allowed = await this.checkLimit(userId, 'generateDailySummary')
    if (!allowed) throw new Error('Daily AI limit reached for this feature.')

    const systemPrompt = `You are a thoughtful assistant. Summarize the following journal entry into 3-5 concise bullet points. Return ONLY the bullet points as a JSON array of strings.`
    const response = await generateAIResponse(systemPrompt, journalContent)

    if (!response) {
      await this.logUsage(userId, 'generateDailySummary', false, 'Groq API failed')
      throw new Error('Failed to generate summary')
    }

    try {
      const jsonMatch = response.match(/\[.*\]/s)
      const summary = jsonMatch ? JSON.parse(jsonMatch[0]) : []
      await this.logUsage(userId, 'generateDailySummary', true)
      return summary
    } catch (e) {
      await this.logUsage(userId, 'generateDailySummary', false, 'JSON parse error')
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
