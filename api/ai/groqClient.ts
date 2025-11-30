type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }
export async function groqChat(apiKey: string, model: string, messages: ChatMessage[]) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 400 })
  })
  const json = await res.json()
  return { text: json?.choices?.[0]?.message?.content ?? '', usage: json?.usage }
}
