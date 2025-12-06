import Groq from 'groq-sdk'

const apiKey = process.env.GROQ_API_KEY
if (!apiKey) {
  console.warn('GROQ_API_KEY is not set. AI features will not work.')
}

const isTestOrBrowser = typeof window !== 'undefined' || process.env.NODE_ENV === 'test'
const useMock = process.env.AI_TEST_MODE === 'mock'

export async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  model = 'llama-3.1-8b-instant',
  jsonMode = false
): Promise<{ text: string; tokens?: number; ms: number } | null> {
  // Deterministic mock mode for tests/integration without external calls
  if (useMock) {
    const started = Date.now()
    // Very basic deterministic outputs based on prompt
    if (systemPrompt.includes('tags')) {
      return { text: JSON.stringify({ tags: ['mock', 'tag'] }), ms: Date.now() - started }
    }
    if (systemPrompt.includes('FOFA') || systemPrompt.toLowerCase().includes('swot')) {
      return { text: JSON.stringify({ strengths: ['mock'], weaknesses: ['mock'], opportunities: ['mock'], threats: ['mock'] }), ms: Date.now() - started }
    }
    if (systemPrompt.toLowerCase().includes('plano semanal')) {
      return { text: JSON.stringify({ Monday: ['mock'] }), ms: Date.now() - started }
    }
    if (systemPrompt.toLowerCase().includes('resuma') || systemPrompt.includes('summary')) {
      return { text: JSON.stringify({ summary: ['mock bullet 1', 'mock bullet 2'] }), ms: Date.now() - started }
    }
    return { text: '', ms: Date.now() - started }
  }

  if (!apiKey || isTestOrBrowser) return null
  const started = Date.now()
  try {
    const client = new Groq({ apiKey })
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model,
      temperature: jsonMode ? 0.1 : 0.2,
      max_tokens: 512,
      response_format: jsonMode ? { type: 'json_object' } : undefined,
    })
    const text = chatCompletion.choices[0]?.message?.content || ''
    const tokens = (chatCompletion as { usage?: { total_tokens?: number } }).usage?.total_tokens
    return { text, tokens, ms: Date.now() - started }
  } catch (error) {
    console.error('Groq API Error:', error)
    return null
  }
}
