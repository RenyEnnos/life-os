import { supabase } from '../lib/supabase'
import { GeminiProvider } from './ai/providers/GeminiProvider'
import { habitsService } from './habitsService'
import { projectsService } from './projectsService'

const gemini = new GeminiProvider()

export interface HabitRecommendation {
    title: string
    rationale: string
    benefits: string
    frequency: string
    category: 'productivity' | 'health' | 'wellness' | 'finance'
}

export const habitRecommendationService = {
    async getRecommendations(userId: string, dismissedTitles: string[] = []): Promise<HabitRecommendation[]> {
        // 1. Gather Context
        const [habits, projects] = await Promise.all([
            habitsService.list(userId, {}),
            projectsService.list(userId, { status: 'active', limit: 5 })
        ])

        // 2. Build Prompt
        const habitList = habits.map((h: any) => `- ${h.title} (${h.probability_score}% completion)`).join('\n')
        const projectList = projects.map((p: any) => `- ${p.title}: ${p.description || ''}`).join('\n')
        const dismissedText = dismissedTitles.length > 0
            ? `\nHábitos Recusados Recentemente (NÃO sugira estes): \n- ${dismissedTitles.join('\n- ')}`
            : ''

        const userPrompt = `
Contexto do Usuário:
Hábitos Atuais:
${habitList || 'Nenhum hábito ativo.'}

Projetos/Objetivos Atuais:
${projectList || 'Nenhum projeto ativo.'}
${dismissedText}

Com base nestes dados, sugira 3 novos hábitos que complementem a rotina do usuário e o ajudem a alcançar seus objetivos. 
Evite hábitos que ele já possua ou que tenha recusado recentemente.
Foque no equilíbrio entre produtividade, saúde e bem-estar.

Responda APENAS em JSON no formato:
[
  {
    "title": "Nome do Hábito",
    "rationale": "Por que estamos sugerindo isso?",
    "benefits": "Benefícios esperados",
    "frequency": "Frequência sugerida (ex: Diário, 3x por semana)",
    "category": "productivity | health | wellness | finance"
  }
]
`

        try {
            const aiResponse = await gemini.generate({
                systemPrompt: 'Você é um coach de alta performance especializado em biohacking e produtividade. Suas sugestões são baseadas em ciência e psicologia comportamental.',
                userPrompt,
                jsonMode: true,
                model: 'gemini-flash',
                temperature: 0.7
            })

            const recommendations = JSON.parse(aiResponse.text)
            return recommendations
        } catch (error) {
            console.error('Error generating habit recommendations:', error)
            return []
        }
    }
}
