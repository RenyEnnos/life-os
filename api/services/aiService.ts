import crypto from 'crypto'
import { repoFactory } from '../repositories/factory'
import { supabase } from '../lib/supabase'
import { groqChat } from '../ai/groqClient'

export type AIFunction = 'swot' | 'classify-transaction' | 'weekly-plan' | 'daily-summary'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

function hashInput(obj: any) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex')
}

async function getCached(userId: string, fn: AIFunction, input: any) {
  const input_hash = hashInput(input)
  const { data } = await supabase.from('ai_cache').select('output, updated_at').eq('user_id', userId).eq('function_name', fn).eq('input_hash', input_hash).single()
  return data ? data.output : null
}

async function setCache(userId: string, fn: AIFunction, input: any, output: any) {
  const input_hash = hashInput(input)
  await supabase.from('ai_cache').upsert({ user_id: userId, function_name: fn, input_hash, output })
}

async function countUsageToday(userId: string, fn: AIFunction) {
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabase.from('ai_logs').select('id').eq('user_id', userId).eq('function_name', fn).gte('created_at', `${today}T00:00:00Z`)
  return (data ?? []).length
}

export class AIService {
  private groqKey?: string
  constructor() { this.groqKey = process.env.GROQ_API_KEY }

  async callGroq(userId: string, fn: AIFunction, messages: any[], maxCallsPerDay = 10) {
    const { data: user } = await supabase.from('users').select('preferences').eq('id', userId).single()
    const lowIA = !!(user?.preferences?.lowIA)
    if (lowIA) throw new Error('Low-IA mode enabled')
    const used = await countUsageToday(userId, fn)
    if (used >= maxCallsPerDay) throw new Error('Daily AI limit reached')
    if (!this.groqKey) throw new Error('GROQ_API_KEY not configured')

    const started = Date.now()
    const { text, usage } = await groqChat(this.groqKey, DEFAULT_MODEL, messages)
    await supabase.from('ai_logs').insert({ user_id: userId, function_name: fn, tokens_used: usage?.total_tokens ?? null, response_time_ms: Date.now() - started, success: true })
    return text
  }

  classifyTransactionLocally(description: string) {
    const d = description.toLowerCase()
    const rules: Record<string, string> = {
      market: 'groceries', supermercado: 'groceries', uber: 'transport', gasolina: 'transport', aluguel: 'housing', academia: 'health', farmácia: 'health', salário: 'income', freelance: 'income'
    }
    for (const k of Object.keys(rules)) if (d.includes(k)) return rules[k]
    return 'unknown'
  }
}

export const aiService = new AIService()
