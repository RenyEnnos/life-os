export type Intent = 'speed' | 'deep_reason' | 'standard';

export interface AIRequest {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    jsonMode?: boolean;
    model?: string;
}

export interface AIResponse {
    text: string;
    tokens?: number;
    ms?: number;
    modelUsed: string;
}

export interface AIProvider {
    name: string;
    generate(request: AIRequest): Promise<AIResponse>;
}
