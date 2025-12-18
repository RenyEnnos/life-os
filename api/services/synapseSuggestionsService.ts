import { supabase } from '../lib/supabase'
import { GeminiProvider } from './ai/providers/GeminiProvider'

type Suggestion = {
  id: string
  title: string
  rationale: string
  action_label: string
  source: 'gemini' | 'heuristic' | 'cache'
}

type ContextSnapshot = {
  dayPart: 'morning' | 'afternoon' | 'night'
  tasks: { id: string; title: string; due_date?: string | null; completed?: boolean | null; energy?: string | null }[]
  habits: { id: string; title: string; active?: boolean | null }[]
  readiness?: number
  hydration?: number
  mood_hint?: string
}

const cache = new Map<string, { ts: number; suggestions: Suggestion[] }>()
const requestWindow = new Map<string, number[]>()
const CACHE_TTL_MS = 2 * 60 * 1000
const RATE_WINDOW_MS = 30 * 1000
const MAX_REQUESTS_IN_WINDOW = 3

const gemini = new GeminiProvider()

export const synapseSuggestionsService = {
  async getSuggestions(userId: string, mood_hint?: string): Promise<Suggestion[]> {
    // Rate limiting with reuse of last response
    const now = Date.now()
    const hits = requestWindow.get(userId) || []
    const recent = hits.filter(ts => now - ts < RATE_WINDOW_MS)
    if (recent.length >= MAX_REQUESTS_IN_WINDOW) {
      const cached = cache.get(userId)
      if (cached && now - cached.ts < CACHE_TTL_MS) {
        return cached.suggestions.map(s => ({ ...s, source: 'cache' }))
      }
    }
    requestWindow.set(userId, [...recent, now])

    // Cache
    const cached = cache.get(userId)
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      return cached.suggestions.map(s => ({ ...s, source: 'cache' }))
    }

    const ctx = await buildContext(userId, mood_hint)
    const prompt = buildPrompt(ctx)

    let suggestions: Suggestion[] | null = null
    try {
      const ai = await gemini.generate({
        systemPrompt: 'Você é o Synapse do Life OS. Gere no máximo 3 sugestões claras, cada uma com title, rationale (<=120 chars) e action_label (<=3 palavras). Use português. Retorne apenas JSON.',
        userPrompt: prompt,
        jsonMode: true,
        model: 'gemini-flash',
        temperature: 0.5
      })
      suggestions = parseSuggestions(ai.text)
      if (suggestions) {
        suggestions = suggestions.map((s, idx) => ({
          id: s.id ?? `gem-${idx}`,
          title: s.title,
          rationale: s.rationale,
          action_label: s.action_label ?? 'Agir',
          source: 'gemini'
        }))
      }
    } catch (error) {
      console.warn('Gemini suggestions failed, fallback to heuristic', error)
    }

    if (!suggestions || suggestions.length === 0) {
      suggestions = heuristicSuggestions(ctx)
    }

    cache.set(userId, { ts: now, suggestions })
    return suggestions
  }
}

function getDayPart(date = new Date()): ContextSnapshot['dayPart'] {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'night'
}

async function buildContext(userId: string, mood_hint?: string): Promise<ContextSnapshot> {
  const dayPart = getDayPart()

  const [tasksRes, habitsRes, healthRes] = await Promise.all([
    supabase.from('tasks').select('id,title,due_date,completed').eq('user_id', userId).is('deleted_at', null).eq('completed', false).order('due_date', { ascending: true }).limit(8),
    supabase.from('habits').select('id,title,active').eq('user_id', userId).is('deleted_at', null).eq('active', true).limit(8),
    supabase.from('health_metrics').select('metric_type,value').eq('user_id', userId).order('recorded_date', { ascending: false }).limit(50)
  ])

  const tasks = (tasksRes.data || []).map(t => ({
    id: t.id as string,
    title: t.title as string,
    due_date: t.due_date as string | null | undefined,
    completed: t.completed as boolean | null | undefined,
    energy: null
  }))

  const habits = (habitsRes.data || []).map(h => ({
    id: h.id as string,
    title: h.title as string,
    active: h.active as boolean | null | undefined
  }))

  const readiness = healthRes.data?.find(h => h.metric_type === 'readiness')?.value as number | undefined
  const hydration = healthRes.data?.find(h => h.metric_type === 'hydration')?.value as number | undefined

  return { dayPart, tasks, habits, readiness, hydration, mood_hint }
}

function buildPrompt(ctx: ContextSnapshot) {
  const tasks = ctx.tasks.slice(0, 5).map(t => `- ${t.title}${t.due_date ? ` (due ${t.due_date})` : ''}${t.energy ? ` [energy=${t.energy}]` : ''}`).join('\n') || 'Nenhuma tarefa';
  const habits = ctx.habits.slice(0, 5).map(h => `- ${h.title}`).join('\n') || 'Nenhum hábito';
  const readiness = ctx.readiness ? `Readiness: ${ctx.readiness}` : 'Sem readiness';
  const hydration = ctx.hydration ? `Hidratação: ${ctx.hydration}` : 'Sem hidratação';
  const mood = ctx.mood_hint ? `Humor percebido: ${ctx.mood_hint}` : 'Humor desconhecido';

  return `Dia-parte: ${ctx.dayPart}.
${mood}
Tarefas (Fluxo):
${tasks}

Hábitos (Health):
${habits}

Sinais vitais:
- ${readiness}
- ${hydration}

Gere até 3 sugestões em JSON: [{"id":"...","title":"...","rationale":"...","action_label":"..."}]`
}

function parseSuggestions(text: string): Suggestion[] | null {
  try {
    const match = text.match(/\[[\s\S]*\]/)
    const json = match ? JSON.parse(match[0]) : JSON.parse(text)
    if (!Array.isArray(json)) return null
    return json
      .filter(item => item?.title && item?.rationale)
      .slice(0, 3)
      .map((item, idx) => ({
        id: item.id ?? `sg-${idx}`,
        title: String(item.title).slice(0, 80),
        rationale: String(item.rationale).slice(0, 140),
        action_label: item.action_label ? String(item.action_label).slice(0, 24) : 'Agir',
        source: 'gemini' as const
      }))
  } catch {
    return null
  }
}

function heuristicSuggestions(ctx: ContextSnapshot): Suggestion[] {
  const suggestions: Suggestion[] = []
  const topTask = ctx.tasks[0]
  const secondTask = ctx.tasks[1]

  if (ctx.dayPart === 'morning' && topTask) {
    suggestions.push({
      id: `h-${topTask.id}`,
      title: topTask.title,
      rationale: 'Comece com foco curto agora.',
      action_label: 'Foco',
      source: 'heuristic'
    })
  }

  if (ctx.dayPart === 'afternoon' && (topTask || secondTask)) {
    suggestions.push({
      id: `h-exec-${topTask?.id ?? secondTask?.id ?? '1'}`,
      title: (topTask || secondTask)!.title,
      rationale: 'Execução guiada com pausa planejada.',
      action_label: 'Executar',
      source: 'heuristic'
    })
  }

  if (ctx.dayPart === 'night') {
    suggestions.push({
      id: 'h-reflect',
      title: 'Refletir e fechar loops',
      rationale: 'Anote 3 linhas e planeje amanhã.',
      action_label: 'Refletir',
      source: 'heuristic'
    })
  }

  if ((ctx.readiness ?? 0) < 40) {
    suggestions.unshift({
      id: 'h-recovery',
      title: 'Recuperar antes de forçar',
      rationale: 'Carga alta detectada, priorize descanso curto.',
      action_label: 'Recuperar',
      source: 'heuristic'
    })
  }

  return suggestions.slice(0, 3)
}
