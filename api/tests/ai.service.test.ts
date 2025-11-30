import { describe, it, expect, vi } from 'vitest'
import * as groqLib from '../lib/groq'
import { aiService } from '../services/aiService'

describe('aiService', () => {
  it('generateTags falls back to heuristics when Groq unavailable', async () => {
    vi.spyOn(groqLib, 'generateAIResponse').mockResolvedValue(null)
    const tags = await aiService.generateTags('u1', 'Compra no supermercado', 'finance', { force: true })
    expect(tags.includes('groceries')).toBe(true)
  })

  it('generateDailySummary returns bullets when Groq unavailable', async () => {
    vi.spyOn(groqLib, 'generateAIResponse').mockResolvedValue(null)
    const summary = await aiService.generateDailySummary('u1', 'Hoje treinei. Depois meditei. E estudei.', { force: true })
    expect(Array.isArray(summary)).toBe(true)
    expect(summary.length).toBeGreaterThan(0)
  })
})
