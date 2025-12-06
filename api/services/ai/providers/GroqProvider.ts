import Groq from 'groq-sdk';
import { AIProvider, AIRequest, AIResponse } from '../types';

export class GroqProvider implements AIProvider {
    name = 'groq';
    private client: Groq;

    constructor() {
        const apiKey = process.env.GROQ_API_KEY || '';
        if (!apiKey) console.warn('GROQ_API_KEY not found');
        this.client = new Groq({ apiKey });
    }

    async generate(request: AIRequest): Promise<AIResponse> {
        const start = Date.now();
        const model = 'llama3-70b-8192'; // Standard Groq Llama 3

        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: 'system', content: request.systemPrompt },
                    { role: 'user', content: request.userPrompt }
                ],
                model: model,
                temperature: request.temperature ?? 0.5,
                response_format: request.jsonMode ? { type: 'json_object' } : undefined
            });

            return {
                text: completion.choices[0]?.message?.content || '',
                tokens: completion.usage?.total_tokens || 0,
                ms: Date.now() - start,
                modelUsed: model
            };
        } catch (error) {
            console.error('Groq Generation Error:', error);
            throw error;
        }
    }
}
