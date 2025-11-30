import Groq from 'groq-sdk'

const apiKey = process.env.GROQ_API_KEY
if (!apiKey) {
  console.warn('GROQ_API_KEY is not set. AI features will not work.')
}

const isTestOrBrowser = typeof window !== 'undefined' || process.env.NODE_ENV === 'test'

export const groq = isTestOrBrowser
  ? ({
      chat: {
        completions: {
          create: async () => ({ choices: [{ message: { content: '' } }], usage: { total_tokens: 0 } })
        }
      }
    } as any)
  : new Groq({ apiKey })

export async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  model = 'llama-3.1-8b-instant'
): Promise<{ text: string; tokens?: number; ms: number } | null> {
  // Deterministic mock mode for tests/integration without external calls
  if (process.env.AI_TEST_MODE === 'mock') {
    const started = Date.now()
    // Very basic deterministic outputs based on prompt
    if (systemPrompt.includes('tags')) {
      return { text: JSON.stringify(['mock','tag']), ms: Date.now() - started }
    }
    if (systemPrompt.includes('FOFA') || systemPrompt.toLowerCase().includes('swot')) {
      return { text: JSON.stringify({ strengths:['mock'], weaknesses:['mock'], opportunities:['mock'], threats:['mock'] }), ms: Date.now() - started }
    }
    if (systemPrompt.toLowerCase().includes('plano semanal')) {
      return { text: JSON.stringify({ Monday:['mock'] }), ms: Date.now() - started }
    }
    if (systemPrompt.toLowerCase().includes('resuma')) {
      return { text: JSON.stringify(['mock bullet 1','mock bullet 2']), ms: Date.now() - started }
    }
    return { text: '', ms: Date.now() - started }
  }
  if (!apiKey || isTestOrBrowser) return null
  const started = Date.now()
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model,
      temperature: 0.2,
      max_tokens: 512,
    })
    const text = chatCompletion.choices[0]?.message?.content || ''
    const tokens = (chatCompletion as any).usage?.total_tokens
    return { text, tokens, ms: Date.now() - started }
  } catch (error) {
    console.error('Groq API Error:', error)
    return null
  }
}
