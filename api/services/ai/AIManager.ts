import { AIRequest, AIResponse, Intent } from './types';
import { GroqProvider } from './providers/GroqProvider';
import { GeminiProvider } from './providers/GeminiProvider';

export class AIManager {
    private groq: GroqProvider;
    private gemini: GeminiProvider;

    constructor() {
        this.groq = new GroqProvider();
        this.gemini = new GeminiProvider();
    }

    async execute(intent: Intent, request: AIRequest): Promise<AIResponse> {
        // Strategy Pattern Analysis
        // Tier "Speed" (Groq -> Gemini Flash)
        if (intent === 'speed') {
            return this.executeSpeedStrategy(request);
        }

        // Tier "Deep Reason" (Gemini Pro)
        if (intent === 'deep_reason') {
            return this.executeDeepReasonStrategy(request);
        }

        // Default
        return this.executeSpeedStrategy(request);
    }

    private async executeSpeedStrategy(request: AIRequest): Promise<AIResponse> {
        try {
            // Priority: Groq (Llama 3)
            return await this.groq.generate(request);
        } catch (error) {
            console.warn('Groq Failed, failover to Gemini Flash', error);
            // Fallback: Gemini Flash
            return await this.gemini.generate({ ...request, model: 'gemini-flash' });
        }
    }

    private async executeDeepReasonStrategy(request: AIRequest): Promise<AIResponse> {
        // Gemini Pro (Wide Context)
        // No failover to Groq for deep reason usually, maybe failover to basic Gemini
        return await this.gemini.generate({ ...request, model: 'gemini-pro' });
    }
}

export const aiManager = new AIManager();
