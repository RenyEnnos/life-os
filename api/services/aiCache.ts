import crypto from 'crypto'
import { supabase } from '../lib/supabase'

function hashInput(value: unknown) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

const memory = new Map<string, unknown>()
const useMemory = process.env.NODE_ENV === 'test'

export async function getCached(userId: string, feature: string, input: unknown) {
  const key = `${userId}:${feature}:${hashInput(input)}`
  if (useMemory) return memory.get(key) ?? null
  const { data } = await supabase.from('ai_cache').select('output').eq('user_id', userId).eq('function_name', feature).eq('input_hash', hashInput(input)).single()
  return data?.output ?? null
}

export async function setCache(userId: string, feature: string, input: unknown, output: unknown) {
  const key = `${userId}:${feature}:${hashInput(input)}`
  if (useMemory) { memory.set(key, output); return }
  await supabase.from('ai_cache').upsert({ user_id: userId, function_name: feature, input_hash: hashInput(input), output })
}

export async function invalidate(userId: string, feature: string, input?: unknown) {
  if (useMemory) {
    const prefix = `${userId}:${feature}`
    for (const k of Array.from(memory.keys())) if (k.startsWith(prefix)) memory.delete(k)
    return
  }
  if (input) {
    await supabase.from('ai_cache').delete().eq('user_id', userId).eq('function_name', feature).eq('input_hash', hashInput(input))
  } else {
    await supabase.from('ai_cache').delete().eq('user_id', userId).eq('function_name', feature)
  }
}
