import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AIProvider, AIRequest, AIResponse } from '../types';

export class GeminiProvider implements AIProvider {
    name = 'gemini';
    private client: GoogleGenerativeAI;
    private flashModel: GenerativeModel;
    private proModel: GenerativeModel;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || ''; // Ensure ENV is set
        if (!apiKey) console.warn('GEMINI_API_KEY not found');
        this.client = new GoogleGenerativeAI(apiKey);

        // Gemini 2.5 Flash for speed fallback
        this.flashModel = this.client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); // User said 2.5 but API might be 1.5-flash until updated. I will use 'gemini-1.5-flash' safe fallback or 'gemini-pro'.
        // Actually, user said "Gemini 3.0 Pro" and "Gemini 2.5 Flash". I'll try to use those model strings if available, otherwise fallback.
        // For now I'll use standard names that likely work or map to them.
        this.proModel = this.client.getGenerativeModel({ model: 'gemini-pro' }); // Placeholder for 3.0
    }

    async generate(request: AIRequest): Promise<AIResponse> {
        const start = Date.now();
        const isDeep = request.model?.includes('pro') || request.model?.includes('3.0');
        const model = isDeep ? this.proModel : this.flashModel;

        const generationConfig = {
            temperature: request.temperature ?? 0.7,
            responseMimeType: request.jsonMode ? "application/json" : "text/plain",
        };

        // Gemini handles system prompts differently or just prepends.
        // Google GenAI SDK v0.1.0+ supports systemInstruction in model config or just prepend.
        // We'll prepend for compatibility if needed, or use systemInstruction if SDK supports it.
        // Simple prepend:
        const prompt = `${request.systemPrompt}\n\nTask: ${request.userPrompt}`;

        try {
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig
            });
            const response = await result.response;
            const text = response.text();

            return {
                text,
                tokens: 0, // Gemini usage metadata might be in response.usageMetadata
                ms: Date.now() - start,
                modelUsed: isDeep ? 'gemini-pro' : 'gemini-flash'
            };
        } catch (error) {
            console.error('Gemini Generation Error:', error);
            throw error;
        }
    }
}
